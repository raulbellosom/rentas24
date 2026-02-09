import { Client, Databases, Users } from "node-appwrite";

function parseBody(req) {
  try {
    const raw = req.body ?? req.payload ?? "{}";
    return typeof raw === "string" ? JSON.parse(raw) : raw;
  } catch {
    return {};
  }
}

function normalizeString(value, max = 0) {
  const str = String(value ?? "").trim();
  return max > 0 ? str.slice(0, max) : str;
}

function normalizePhone(value, phoneCode = "") {
  const raw = String(value || "").trim();
  if (!raw) return "";
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  if (raw.startsWith("+")) return raw.replace(/[^+\d]/g, "");
  const codeDigits = String(phoneCode || "").replace(/\D/g, "");
  return `+${codeDigits || "52"}${digits}`;
}

function fullName(firstName, lastName) {
  return `${String(firstName || "").trim()} ${String(lastName || "").trim()}`.trim();
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
  return {
    endpoint:
      process.env.APPWRITE_FUNCTION_ENDPOINT || process.env.APPWRITE_ENDPOINT,
    projectId:
      process.env.APPWRITE_FUNCTION_PROJECT_ID || process.env.APPWRITE_PROJECT_ID,
    apiKey: process.env.APPWRITE_FUNCTION_API_KEY || process.env.APPWRITE_API_KEY,
    databaseId: process.env.APPWRITE_DB_ID || "main",
    profilesCollectionId: process.env.APPWRITE_COL_PROFILES_ID || "profiles",
  };
}

export default async ({ req, res, error, log }) => {
  const config = getConfig();
  if (!config.endpoint || !config.projectId || !config.apiKey) {
    return res.json(
      { ok: false, message: "Missing endpoint/project/apiKey configuration" },
      500
    );
  }

  const client = new Client()
    .setEndpoint(config.endpoint)
    .setProject(config.projectId)
    .setKey(config.apiKey);

  const users = new Users(client);
  const db = new Databases(client);
  const body = parseBody(req);
  const userId =
    process.env.APPWRITE_FUNCTION_USER_ID ||
    req.headers?.["x-appwrite-user-id"] ||
    body.userId;

  if (!userId) {
    return res.json({ ok: false, message: "Unauthorized" }, 401);
  }

  try {
    const authUser = await users.get(userId);
    const profile = await db.getDocument(
      config.databaseId,
      config.profilesCollectionId,
      userId
    );

    const nextFirstName = normalizeString(
      body.firstName ?? profile.firstName,
      95
    );
    const nextLastName = normalizeString(body.lastName ?? profile.lastName, 95);
    const nextEmail = normalizeString(body.email ?? profile.email, 120);
    const nextPhoneCode = normalizeString(
      body.phoneCode ?? profile.phoneCode ?? "+52",
      5
    );
    const nextPhone = normalizePhone(body.phone ?? profile.phone, nextPhoneCode);
    const nextAddress = body.address
      ? JSON.stringify(body.address)
      : profile.addressJson;

    const currentPhotos = (() => {
      try {
        return JSON.parse(profile.photosJson || "{}");
      } catch {
        return {};
      }
    })();

    const nextPhotos = JSON.stringify({
      ...currentPhotos,
      ...(body.photos || {}),
    });

    const patch = {
      firstName: nextFirstName,
      lastName: nextLastName,
      email: nextEmail,
      phoneCode: nextPhoneCode,
      phone: nextPhone,
      addressJson: nextAddress,
      photosJson: nextPhotos,
    };
    const emailChanged =
      nextEmail &&
      String(authUser.email || "").trim().toLowerCase() !== nextEmail.toLowerCase();
    if (emailChanged) {
      patch.emailVerified = false;
    }

    await withUnknownAttributeFallback(
      (nextPatch) =>
        db.updateDocument(
          config.databaseId,
          config.profilesCollectionId,
          userId,
          nextPatch
        ),
      patch,
      log
    );

    const authUpdates = [];
    const nextName = fullName(nextFirstName, nextLastName);
    if (nextName && nextName !== authUser.name) {
      await users.updateName(userId, nextName);
      authUpdates.push("name");
    }

    if (emailChanged) {
      await users.updateEmail(userId, nextEmail);
      await users.updateEmailVerification(userId, false);
      authUpdates.push("email");
    }

    if (nextPhone && nextPhone !== authUser.phone) {
      await users.updatePhone(userId, nextPhone);
      authUpdates.push("phone");
    }

    return res.json({
      ok: true,
      userId,
      updatedProfile: Object.keys(patch),
      syncedAuth: authUpdates,
    });
  } catch (e) {
    error(`sync-user-profile failed: ${e.message}`);
    log(e.stack || "no-stack");
    return res.json({ ok: false, message: e.message, code: e.code || 500 }, 500);
  }
};
