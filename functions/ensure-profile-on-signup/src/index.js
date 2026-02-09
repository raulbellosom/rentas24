import { Client, Databases, Functions, Users } from "node-appwrite";

function splitName(fullName) {
  const normalized = String(fullName || "")
    .trim()
    .replace(/\s+/g, " ");
  if (!normalized) return { firstName: "Usuario", lastName: "" };
  const [firstName, ...rest] = normalized.split(" ");
  return { firstName, lastName: rest.join(" ") };
}

function parsePayload(req) {
  try {
    const raw = req.body ?? req.payload ?? "{}";
    return typeof raw === "string" ? JSON.parse(raw) : raw;
  } catch {
    return {};
  }
}

function unknownAttribute(message) {
  const match = String(message || "").match(/Unknown attribute:\s*"([^"]+)"/i);
  return match ? match[1] : "";
}

async function withUnknownAttributeFallback(writeDoc, payload, log) {
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
}

function getConfig() {
  const endpoint =
    process.env.APPWRITE_FUNCTION_ENDPOINT || process.env.APPWRITE_ENDPOINT;
  const projectId =
    process.env.APPWRITE_FUNCTION_PROJECT_ID || process.env.APPWRITE_PROJECT_ID;
  const apiKey = process.env.APPWRITE_FUNCTION_API_KEY || process.env.APPWRITE_API_KEY;

  return {
    endpoint,
    projectId,
    apiKey,
    databaseId: process.env.APPWRITE_DB_ID || "main",
    profilesCollectionId: process.env.APPWRITE_COL_PROFILES_ID || "profiles",
    emailVerificationFunctionId:
      process.env.APPWRITE_FUNCTION_EMAIL_VERIFICATION_ID || "",
  };
}

export default async ({ req, res, log, error }) => {
  const config = getConfig();
  if (!config.endpoint || !config.projectId || !config.apiKey) {
    return res.json(
      { ok: false, message: "Missing Appwrite endpoint/project/key" },
      500
    );
  }

  const client = new Client()
    .setEndpoint(config.endpoint)
    .setProject(config.projectId)
    .setKey(config.apiKey);

  const users = new Users(client);
  const db = new Databases(client);
  const fn = new Functions(client);
  const payload = parsePayload(req);
  const userId = payload.$id || payload.userId || payload.id;

  if (!userId) {
    return res.json({ ok: false, message: "Missing user id in payload" }, 400);
  }

  try {
    const authUser = await users.get(userId);
    const { firstName, lastName } = splitName(authUser.name);

    const createData = {
      firstName,
      lastName,
      email: authUser.email || "",
      phoneCode: "+52",
      phone: authUser.phone || "",
      role: "tenant",
      addressJson: JSON.stringify({}),
      photosJson: JSON.stringify({}),
      emailVerified: Boolean(authUser.emailVerification),
      termsAccepted: false,
      status: 1,
      enabled: true,
    };

    const updateData = {
      firstName,
      lastName,
      email: authUser.email || "",
      phone: authUser.phone || "",
      emailVerified: Boolean(authUser.emailVerification),
    };

    let action = "updated";
    try {
      await db.getDocument(config.databaseId, config.profilesCollectionId, userId);
      await withUnknownAttributeFallback(
        (patch) =>
          db.updateDocument(
            config.databaseId,
            config.profilesCollectionId,
            userId,
            patch
          ),
        updateData,
        log
      );
    } catch {
      action = "created";
      await withUnknownAttributeFallback(
        (patch) =>
          db.createDocument(
            config.databaseId,
            config.profilesCollectionId,
            userId,
            patch
          ),
        createData,
        log
      );
    }

    if (config.emailVerificationFunctionId) {
      try {
        await fn.createExecution(
          config.emailVerificationFunctionId,
          JSON.stringify({
            action: "send",
            userAuthId: userId,
            email: authUser.email,
          }),
          true
        );
      } catch (fnError) {
        error(`Could not trigger email verification: ${fnError.message}`);
      }
    } else {
      log("APPWRITE_FUNCTION_EMAIL_VERIFICATION_ID not configured. Skipping email.");
    }

    return res.json({ ok: true, action, userId });
  } catch (e) {
    error(e.message);
    return res.json({ ok: false, message: e.message, code: e.code || 500 }, 500);
  }
};
