import { Client, Databases, ID, Query, Users } from "node-appwrite";
import {
  getVerificationEmailHtml,
  json,
  safeBodyJson,
  sendEmailWithNodemailer,
} from "./_shared.js";

const getConfig = () => ({
  endpoint:
    process.env.APPWRITE_FUNCTION_ENDPOINT || process.env.APPWRITE_ENDPOINT,
  projectId:
    process.env.APPWRITE_FUNCTION_PROJECT_ID || process.env.APPWRITE_PROJECT_ID,
  apiKey: process.env.APPWRITE_FUNCTION_API_KEY || process.env.APPWRITE_API_KEY,
  databaseId: process.env.APPWRITE_DB_ID || "main",
  profilesCollectionId: process.env.APPWRITE_COL_PROFILES_ID || "profiles",
  verificationsCollectionId:
    process.env.APPWRITE_COL_EMAIL_VERIFICATIONS_ID || "email_verifications",
  appBaseUrl: process.env.APP_BASE_URL || "http://localhost:5173",
  tokenTtlMinutes: Number(process.env.EMAIL_VERIFICATION_TTL_MINUTES) || 120,
  resendCooldownSeconds:
    Number(process.env.EMAIL_VERIFICATION_RESEND_COOLDOWN_SECONDS) || 180,
});

const parseAction = (req, body) => {
  const queryAction = new URL(req.url, "http://localhost").searchParams.get("action");
  return body.action || queryAction || "send";
};

const appwriteClient = (config) =>
  new Client()
    .setEndpoint(config.endpoint)
    .setProject(config.projectId)
    .setKey(config.apiKey);

const unknownAttribute = (message) => {
  const match = String(message || "").match(/Unknown attribute:\s*"([^"]+)"/i);
  return match ? match[1] : "";
};

const withUnknownAttributeFallback = async (writeDoc, payload, log) => {
  const patch = { ...payload };
  while (true) {
    try {
      return await writeDoc(patch);
    } catch (e) {
      const attr = unknownAttribute(e?.message);
      if (!attr || !(attr in patch)) {
        throw e;
      }
      delete patch[attr];
      log?.(`Skipping unsupported profile attribute "${attr}"`);
    }
  }
};

const invalidateTokens = async (db, config, userAuthId) => {
  const docs = await db.listDocuments(
    config.databaseId,
    config.verificationsCollectionId,
    [
      Query.equal("userAuthId", userAuthId),
      Query.equal("used", false),
      Query.equal("invalidated", false),
      Query.limit(100),
    ]
  );

  await Promise.all(
    docs.documents.map((doc) =>
      db.updateDocument(
        config.databaseId,
        config.verificationsCollectionId,
        doc.$id,
        { invalidated: true }
      )
    )
  );
};

const resolveUser = async (users, body) => {
  if (body.userAuthId) {
    return users.get(body.userAuthId);
  }

  if (!body.email) return null;
  const result = await users.list([Query.equal("email", body.email), Query.limit(1)]);
  if (!result.total) return null;
  return result.users[0];
};

const getRetryAfterSeconds = (nextAllowedAt) => {
  const diffMs = Math.max(0, nextAllowedAt - Date.now());
  return Math.max(1, Math.ceil(diffMs / 1000));
};

const assertResendCooldown = async (db, config, userAuthId) => {
  if (config.resendCooldownSeconds <= 0) {
    return null;
  }

  const docs = await db.listDocuments(
    config.databaseId,
    config.verificationsCollectionId,
    [Query.equal("userAuthId", userAuthId), Query.orderDesc("$createdAt"), Query.limit(1)]
  );

  if (!docs.total) {
    return null;
  }

  const latest = docs.documents[0];
  const latestCreatedAt = new Date(latest.$createdAt).getTime();
  if (Number.isNaN(latestCreatedAt)) {
    return null;
  }

  const nextAllowedAt = latestCreatedAt + config.resendCooldownSeconds * 1000;
  if (nextAllowedAt <= Date.now()) {
    return null;
  }

  return {
    retryAfterSeconds: getRetryAfterSeconds(nextAllowedAt),
    nextAllowedAt: new Date(nextAllowedAt).toISOString(),
  };
};

const sendVerification = async ({ db, users, config, body }) => {
  const authUser = await resolveUser(users, body);
  if (!authUser || !authUser.email) {
    return { status: 404, payload: { ok: false, error: "User not found" } };
  }

  if (authUser.emailVerification) {
    return {
      status: 200,
      payload: { ok: true, message: "Email already verified" },
    };
  }

  const cooldown = await assertResendCooldown(db, config, authUser.$id);
  if (cooldown) {
    return {
      status: 429,
      payload: {
        ok: false,
        error: "Resend cooldown active",
        message: `Debes esperar ${cooldown.retryAfterSeconds} segundos para reenviar el correo.`,
        ...cooldown,
      },
    };
  }

  await invalidateTokens(db, config, authUser.$id);

  const token = ID.unique();
  const expiresAt = new Date(
    Date.now() + config.tokenTtlMinutes * 60 * 1000
  ).toISOString();

  await db.createDocument(
    config.databaseId,
    config.verificationsCollectionId,
    ID.unique(),
    {
      userAuthId: authUser.$id,
      email: authUser.email,
      token,
      expireAt: expiresAt,
      used: false,
      invalidated: false,
    }
  );

  const emailHtml = getVerificationEmailHtml(token, config.appBaseUrl);
  await sendEmailWithNodemailer(
    authUser.email,
    "Verifica tu correo - Rentas24",
    emailHtml
  );

  return {
    status: 200,
    payload: { ok: true, message: "Verification email sent successfully" },
  };
};

const verifyToken = async ({ db, users, config, body, log }) => {
  if (!body.token) {
    return { status: 400, payload: { ok: false, error: "Missing token" } };
  }

  const docs = await db.listDocuments(
    config.databaseId,
    config.verificationsCollectionId,
    [
      Query.equal("token", body.token),
      Query.equal("used", false),
      Query.equal("invalidated", false),
      Query.limit(1),
    ]
  );

  if (!docs.total) {
    return {
      status: 400,
      payload: { ok: false, error: "Invalid or already used token" },
    };
  }

  const doc = docs.documents[0];
  if (new Date(doc.expireAt) < new Date()) {
    return { status: 400, payload: { ok: false, error: "Token expired" } };
  }

  await users.updateEmailVerification(doc.userAuthId, true);
  await db.updateDocument(
    config.databaseId,
    config.verificationsCollectionId,
    doc.$id,
    { used: true }
  );
  try {
    await withUnknownAttributeFallback(
      (patch) =>
        db.updateDocument(
          config.databaseId,
          config.profilesCollectionId,
          doc.userAuthId,
          patch
        ),
      { emailVerified: true, email: doc.email },
      log
    );
  } catch (e) {
    log(`Could not sync profiles.emailVerified for user ${doc.userAuthId}: ${e.message}`);
  }

  return {
    status: 200,
    payload: { ok: true, message: "Email verified successfully" },
  };
};

export default async ({ req, res, log, error }) => {
  const config = getConfig();
  if (!config.endpoint || !config.projectId || !config.apiKey) {
    return json(res, 500, { ok: false, error: "Missing Appwrite connection vars" });
  }

  const body = safeBodyJson(req);
  const action = parseAction(req, body);
  const client = appwriteClient(config);
  const db = new Databases(client);
  const users = new Users(client);

  try {
    log(`email-verification action=${action}`);

    if (action === "send") {
      const result = await sendVerification({ db, users, config, body });
      return json(res, result.status, result.payload);
    }

    if (action === "resend") {
      const result = await sendVerification({ db, users, config, body });
      return json(res, result.status, result.payload);
    }

    if (action === "verify") {
      const result = await verifyToken({ db, users, config, body, log });
      return json(res, result.status, result.payload);
    }

    return json(res, 400, {
      ok: false,
      error: "Invalid action. Use send, resend or verify.",
    });
  } catch (e) {
    error(e.message);
    return json(res, 500, { ok: false, error: e.message });
  }
};
