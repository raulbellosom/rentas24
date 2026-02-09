import { Permission, Role } from "appwrite";
import {
  account,
  buildFilePreview,
  databases,
  functions,
  ID,
  Query,
  userPermissions,
} from "./appwrite";
import { env } from "../env";

const ok = (status, data = {}) => ({ ok: true, status, data, error: null });
const fail = (status, message, data = {}) => ({
  ok: false,
  status,
  data,
  error: message,
});

const defaultAddress = {
  street_1: "",
  street_2: "",
  number_ext: "",
  number_int: "",
  colony: "",
  city: "",
  state: "",
  country: "",
  postal_code: "",
};

const defaultAnnouncement = {
  price: 0,
  currency: "MXN",
  is_recurrent: false,
  recurrency_id: "",
  isAdvance: false,
  advanceAmount: 0,
  start_date: "",
  end_date: "",
};

const safeJsonParse = (value, fallback) => {
  if (!value || typeof value !== "string") return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const toBool = (value, fallback = false) => {
  if (value === undefined || value === null || value === "") return fallback;
  if (typeof value === "boolean") return value;
  return String(value).toLowerCase() === "true";
};

const toNumber = (value, fallback = 0) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const toIsoDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
};

const toInputDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
};

const splitName = (fullName) => {
  const normalized = String(fullName || "")
    .trim()
    .replace(/\s+/g, " ");
  if (!normalized) return { firstName: "", lastName: "" };
  const [firstName, ...rest] = normalized.split(" ");
  return { firstName, lastName: rest.join(" ") };
};

const unknownAttributeFromError = (error) => {
  const message = String(error?.message || "");
  const match = message.match(/Unknown attribute:\s*"([^"]+)"/i);
  return match ? match[1] : "";
};

const runWithUnknownAttributeFallback = async (runner, payload) => {
  const patch = { ...payload };
  while (true) {
    try {
      return await runner(patch);
    } catch (error) {
      const attr = unknownAttributeFromError(error);
      if (!attr || !(attr in patch)) {
        throw error;
      }
      delete patch[attr];
    }
  }
};

const extractFileIdFromUrl = (value) => {
  const str = String(value || "");
  const match = str.match(/\/files\/([^/]+)\//);
  return match ? match[1] : str;
};

const mapProfileToUser = (authUser, profileDoc) => {
  const nameFromAuth = splitName(authUser?.name);
  const address = safeJsonParse(profileDoc?.addressJson, defaultAddress);
  const files = safeJsonParse(profileDoc?.filesJson, {});
  const photos = safeJsonParse(profileDoc?.photosJson, {});
  const profileEmailVerified = profileDoc?.emailVerified;

  return {
    id: authUser?.$id || profileDoc?.$id || "",
    firstName: profileDoc?.firstName || nameFromAuth.firstName || "",
    lastName: profileDoc?.lastName || nameFromAuth.lastName || "",
    email: profileDoc?.email || authUser?.email || "",
    phone_code: profileDoc?.phoneCode || "+52",
    phone: profileDoc?.phone || authUser?.phone || "",
    role: profileDoc?.role || "tenant",
    terms: Boolean(profileDoc?.termsAccepted),
    enabled: profileDoc?.enabled !== false,
    status: profileDoc?.status ?? 1,
    address,
    files,
    photos: {
      profile: photos.profile || "",
      cover: photos.cover || "",
    },
    emailVerified:
      typeof profileEmailVerified === "boolean"
        ? profileEmailVerified
        : Boolean(authUser?.emailVerification),
    createdAt: profileDoc?.$createdAt || authUser?.$createdAt || "",
    updatedAt: profileDoc?.$updatedAt || authUser?.$updatedAt || "",
  };
};

const mapPropertyDoc = (doc) => {
  const characteristics = safeJsonParse(doc.characteristicsJson, {
    rooms: "",
    bathrooms: "",
    maxPeople: 1,
    services: [],
  });

  const address = safeJsonParse(doc.addressJson, defaultAddress);

  const announcement = {
    price: doc.price ?? 0,
    currency: doc.currency || "MXN",
    is_recurrent: Boolean(doc.isRecurrent),
    recurrency_id: doc.recurrencyId || "",
    isAdvance: Boolean(doc.isAdvance),
    advanceAmount: doc.advanceAmount ?? 0,
    start_date: toInputDate(doc.startDate),
    end_date: toInputDate(doc.endDate),
  };

  const photoFileIds = Array.isArray(doc.photoFileIds) ? doc.photoFileIds : [];
  const photos = photoFileIds.map((fileId) =>
    buildFilePreview(env.APPWRITE_BUCKET_PROPERTY_PHOTOS_ID, fileId)
  );

  return {
    id: doc.$id,
    title: doc.title || "",
    description: doc.description || "",
    type_id: doc.typeId || "",
    status: doc.enabled ? 1 : 0,
    characteristics,
    address,
    announcement,
    available: Boolean(doc.available),
    photos,
    photoFileIds,
    user_id: doc.ownerId || "",
    ownerId: doc.ownerId || "",
    published: Boolean(doc.published),
    enabled: Boolean(doc.enabled),
    createdAt: doc.$createdAt,
    updatedAt: doc.$updatedAt,
  };
};

const mapTypeDoc = (doc) => ({
  id: doc.$id,
  name: doc.name,
  key: doc.key,
  enabled: Boolean(doc.enabled),
});

const mapRecurrencyDoc = (doc) => ({
  id: doc.$id,
  name: doc.name,
  key: doc.key,
  enabled: Boolean(doc.enabled),
});

const getStoredToken = () => {
  try {
    const current = JSON.parse(window.localStorage.getItem("user") || "{}");
    return current?.token || "";
  } catch {
    return "";
  }
};

const getProfileDocument = async (userId) => {
  return databases.getDocument(
    env.APPWRITE_DB_ID,
    env.APPWRITE_COL_PROFILES_ID,
    userId
  );
};

const createProfileDocument = async (userId, data, permissions) => {
  return runWithUnknownAttributeFallback(
    (patch) =>
      databases.createDocument(
        env.APPWRITE_DB_ID,
        env.APPWRITE_COL_PROFILES_ID,
        userId,
        patch,
        permissions
      ),
    data
  );
};

const updateProfileDocument = async (userId, data) => {
  return runWithUnknownAttributeFallback(
    (patch) =>
      databases.updateDocument(
        env.APPWRITE_DB_ID,
        env.APPWRITE_COL_PROFILES_ID,
        userId,
        patch
      ),
    data
  );
};

const ensureProfileDocument = async (authUser, signupData = {}) => {
  try {
    return await getProfileDocument(authUser.$id);
  } catch {
    const fallbackNames = splitName(authUser.name);
    const profileData = {
      firstName: signupData.firstName || fallbackNames.firstName || "Usuario",
      lastName: signupData.lastName || fallbackNames.lastName || "",
      email: authUser.email || signupData.email || "",
      phoneCode: signupData.phone_code || "+52",
      phone: signupData.phone || "",
      role: "tenant",
      addressJson: JSON.stringify(defaultAddress),
      photosJson: JSON.stringify({}),
      emailVerified: Boolean(authUser.emailVerification),
      termsAccepted: Boolean(signupData.terms),
      status: 1,
      enabled: true,
    };

    try {
      return await createProfileDocument(authUser.$id, profileData, userPermissions(authUser.$id));
    } catch {
      return null;
    }
  }
};

const waitForProfile = async (userId, retries = 4, delayMs = 300) => {
  for (let i = 0; i < retries; i += 1) {
    try {
      return await getProfileDocument(userId);
    } catch {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  return null;
};

const getCurrentUserWithProfile = async () => {
  const authUser = await account.get();
  let profileDoc =
    (await waitForProfile(authUser.$id, 2, 200)) ||
    (await ensureProfileDocument(authUser));
  const emailVerified = Boolean(authUser.emailVerification);

  if (profileDoc && profileDoc.emailVerified !== emailVerified) {
    try {
      profileDoc = await updateProfileDocument(authUser.$id, {
        emailVerified,
      });
    } catch {
      profileDoc = { ...profileDoc, emailVerified };
    }
  }

  return mapProfileToUser(authUser, profileDoc);
};

const propertyPayloadFromLegacy = (body) => {
  const startDate = toIsoDate(body.announcement?.start_date);
  const endDate = toIsoDate(body.announcement?.end_date);
  const enabled = String(body.status ?? "1") !== "0";

  const payload = {
    ownerId: body.user_id,
    typeId: body.type_id,
    title: String(body.title || "").trim(),
    description: String(body.description || "").trim(),
    characteristicsJson: JSON.stringify(body.characteristics || {}),
    photoFileIds: Array.isArray(body.photos)
      ? body.photos.map(extractFileIdFromUrl)
      : [],
    addressJson: JSON.stringify(body.address || defaultAddress),
    price: toNumber(body.announcement?.price, 0),
    currency: body.announcement?.currency || "MXN",
    isRecurrent: Boolean(body.announcement?.is_recurrent),
    recurrencyId: body.announcement?.recurrency_id || "",
    isAdvance: Boolean(body.announcement?.isAdvance),
    advanceAmount: toNumber(body.announcement?.advanceAmount, 0),
    faqsJson: JSON.stringify({}),
    available: toBool(body.available, true),
    published: true,
    enabled,
  };

  if (startDate) payload.startDate = startDate;
  if (endDate) payload.endDate = endDate;

  return payload;
};

const propertyPermissions = (ownerId, isPublished) => {
  const base = [
    Permission.read(Role.user(ownerId)),
    Permission.update(Role.user(ownerId)),
    Permission.delete(Role.user(ownerId)),
  ];
  if (isPublished) {
    base.push(Permission.read(Role.any()));
  }
  return base;
};

const runSyncProfileFunction = async (payload) => {
  if (!env.APPWRITE_FUNCTION_SYNC_PROFILE_ID) {
    return null;
  }

  try {
    return await functions.createExecution(
      env.APPWRITE_FUNCTION_SYNC_PROFILE_ID,
      JSON.stringify(payload),
      false
    );
  } catch {
    return null;
  }
};

const parseFunctionExecution = (execution) => {
  const status = Number(execution?.responseStatusCode || 0);
  const body = safeJsonParse(execution?.responseBody, {});
  return { status, body };
};

const executeEmailVerificationAction = async ({
  action,
  userAuthId = "",
  email = "",
  token = "",
  asyncExecution = true,
}) => {
  if (!env.APPWRITE_FUNCTION_EMAIL_VERIFICATION_ID) {
    return fail(503, "Email verification function is not configured");
  }

  try {
    const execution = await functions.createExecution(
      env.APPWRITE_FUNCTION_EMAIL_VERIFICATION_ID,
      JSON.stringify({
        action,
        userAuthId,
        email,
        token,
      }),
      asyncExecution
    );

    if (asyncExecution) {
      return ok(202, { queued: true });
    }

    const { status, body } = parseFunctionExecution(execution);
    const finalStatus = status || 500;
    if (finalStatus >= 200 && finalStatus < 300 && body?.ok !== false) {
      return ok(finalStatus, body);
    }

    return fail(
      finalStatus,
      body?.error || body?.message || "Email verification failed",
      body
    );
  } catch {
    return fail(500, "Could not execute email verification function");
  }
};

const maybeSendVerificationEmail = async (userAuthId, email, action = "send") => {
  const result = await executeEmailVerificationAction({
    action,
    userAuthId,
    email,
    asyncExecution: true,
  });
  return result.ok ? result : null;
};

const deleteCurrentSessionSafe = async () => {
  try {
    await account.deleteSession("current");
  } catch {
    try {
      await account.deleteSessions();
    } catch {
      // noop
    }
  }
};

const createEmailPasswordSessionWithRecovery = async (email, password) => {
  try {
    return await account.createEmailPasswordSession(email, password);
  } catch (error) {
    const status = Number(error?.code || 0);
    if (status !== 401) {
      throw error;
    }

    // Some browsers keep a stale/current session cookie. Clear and retry once.
    await deleteCurrentSessionSafe();
    return account.createEmailPasswordSession(email, password);
  }
};

const handleAppwriteError = (error) => {
  const status = Number(error?.code) || 500;
  const message = error?.message || "Unexpected Appwrite error";
  return fail(status, message, { message });
};

const ensurePublicConfig = () => {
  if (!env.APPWRITE_PROJECT_ID) {
    return fail(
      500,
      "Missing APPWRITE_PROJECT_ID",
      {
        message:
          "Falta APPWRITE_PROJECT_ID en .env. Configuralo y reinicia el servidor de Vite.",
      }
    );
  }
  return null;
};

export const handleSignUp = async (data) => {
  try {
    const fullName = `${data.firstName || ""} ${data.lastName || ""}`.trim();
    const authUser = await account.create(
      ID.unique(),
      data.email,
      data.password,
      fullName
    );

    await maybeSendVerificationEmail(authUser.$id, authUser.email, "send");

    return ok(201, {
      requiresEmailVerification: true,
      email: authUser.email || data.email,
      message:
        "Cuenta creada. Revisa tu correo para verificar tu email antes de iniciar sesion.",
    });
  } catch (error) {
    return handleAppwriteError(error);
  }
};

export const handleSignIn = async (data) => {
  try {
    const session = await createEmailPasswordSessionWithRecovery(
      data.email,
      data.password
    );
    const user = await getCurrentUserWithProfile();

    if (!user.enabled) {
      await deleteCurrentSessionSafe();
      return fail(403, "Tu cuenta esta deshabilitada", {
        message: "Tu cuenta esta deshabilitada. Contacta a soporte.",
        reason: "ACCOUNT_DISABLED",
      });
    }

    if (!user.emailVerified) {
      await deleteCurrentSessionSafe();
      return fail(
        403,
        "Debes verificar tu correo antes de iniciar sesion",
        {
          message:
            "Tu correo aun no ha sido verificado. Revisa tu bandeja o reenvia el correo de verificacion.",
          reason: "EMAIL_NOT_VERIFIED",
          email: user.email || data.email,
          userId: user.id || "",
        }
      );
    }

    return ok(200, {
      token: session.$id,
      user,
    });
  } catch (error) {
    return handleAppwriteError(error);
  }
};

export const handleProfile = async () => {
  try {
    const user = await getCurrentUserWithProfile();
    if (!user.enabled || !user.emailVerified) {
      await deleteCurrentSessionSafe();
      return fail(403, "Session is not allowed", {
        reason: !user.enabled ? "ACCOUNT_DISABLED" : "EMAIL_NOT_VERIFIED",
      });
    }
    return ok(200, user);
  } catch (error) {
    return handleAppwriteError(error);
  }
};

export const handleSignOut = async () => {
  try {
    await account.deleteSessions();
    return ok(200, { message: "Signed out" });
  } catch (error) {
    return handleAppwriteError(error);
  }
};

export const handleUpdateUser = async (_, data) => {
  try {
    const authUser = await account.get();
    const profileDoc = await getProfileDocument(authUser.$id);
    const profileAddress = safeJsonParse(profileDoc.addressJson, defaultAddress);

    const nextAddress = {
      ...profileAddress,
      state: data.state || profileAddress.state || "",
      city: data.city || profileAddress.city || "",
      postal_code: data.zipCode || profileAddress.postal_code || "",
      street_1: data.street || profileAddress.street_1 || "",
    };

    const nextFirstName = String(data.firstName || "").trim();
    const nextLastName = String(data.lastName || "").trim();
    const nextFullName = `${nextFirstName} ${nextLastName}`.trim();

    const patch = {
      firstName: nextFirstName || profileDoc.firstName,
      lastName: nextLastName || profileDoc.lastName,
      email: String(data.email || profileDoc.email || "").trim(),
      phone: String(data.phone || profileDoc.phone || "").trim(),
      addressJson: JSON.stringify(nextAddress),
    };
    const emailChanged =
      String(profileDoc.email || "").trim().toLowerCase() !==
      patch.email.toLowerCase();
    if (emailChanged) {
      patch.emailVerified = false;
    }

    await updateProfileDocument(authUser.$id, patch);

    if (nextFullName && nextFullName !== authUser.name) {
      await account.updateName(nextFullName);
    }

    await runSyncProfileFunction({
      firstName: patch.firstName,
      lastName: patch.lastName,
      email: patch.email,
      phone: patch.phone,
    });

    const user = await getCurrentUserWithProfile();
    return ok(200, { token: getStoredToken(), user });
  } catch (error) {
    return handleAppwriteError(error);
  }
};

export const handleUpdatePassword = async (_, data) => {
  try {
    await account.updatePassword(data.newPassword, data.password);
    return ok(200, { message: "Password updated" });
  } catch (error) {
    return handleAppwriteError(error);
  }
};

export const handleUpdatePhotoProfile = async (_, body, id) => {
  try {
    const authUser = await account.get();
    if (authUser.$id !== id) {
      return fail(403, "You can only update your own profile photo", {
        message: "Operación no permitida",
      });
    }

    const profileDoc = await getProfileDocument(authUser.$id);
    const photos = safeJsonParse(profileDoc.photosJson, {});
    const nextPhotos = {
      ...photos,
      [body.type]: body.photo,
    };

    await updateProfileDocument(authUser.$id, {
      photosJson: JSON.stringify(nextPhotos),
    });

    const user = await getCurrentUserWithProfile();
    return ok(200, { token: getStoredToken(), user });
  } catch (error) {
    return handleAppwriteError(error);
  }
};

export const handleDisableUser = async (_, id) => {
  try {
    const authUser = await account.get();
    if (authUser.$id !== id) {
      return fail(403, "You can only disable your own account", {
        message: "Operación no permitida",
      });
    }

    await updateProfileDocument(authUser.$id, {
      enabled: false,
      status: 0,
    });

    await account.deleteSessions();
    return ok(200, { message: "Cuenta deshabilitada con éxito" });
  } catch (error) {
    return handleAppwriteError(error);
  }
};

export const handleGetTypes = async () => {
  const cfgError = ensurePublicConfig();
  if (cfgError) return cfgError;

  try {
    const [typesDocs, recurrenciesDocs] = await Promise.all([
      databases.listDocuments(
        env.APPWRITE_DB_ID,
        env.APPWRITE_COL_PROPERTY_TYPES_ID,
        [Query.equal("enabled", true), Query.limit(100), Query.orderAsc("name")]
      ),
      databases.listDocuments(
        env.APPWRITE_DB_ID,
        env.APPWRITE_COL_RENT_RECURRENCIES_ID,
        [Query.equal("enabled", true), Query.limit(100), Query.orderAsc("name")]
      ),
    ]);

    return ok(200, {
      types: typesDocs.documents.map(mapTypeDoc),
      recurrencies: recurrenciesDocs.documents.map(mapRecurrencyDoc),
    });
  } catch (error) {
    return handleAppwriteError(error);
  }
};

export const handleResendVerificationEmail = async (email) => {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  if (!normalizedEmail) {
    return fail(400, "Email is required", {
      message: "Proporciona un correo para reenviar la verificacion",
    });
  }

  return executeEmailVerificationAction({
    action: "resend",
    email: normalizedEmail,
    asyncExecution: false,
  });
};

export const handleVerifyEmailToken = async (token) => {
  const normalizedToken = String(token || "").trim();
  if (!normalizedToken) {
    return fail(400, "Token is required", { message: "Token invalido" });
  }

  return executeEmailVerificationAction({
    action: "verify",
    token: normalizedToken,
    asyncExecution: false,
  });
};

export const handleGetType = async (id) => {
  try {
    const doc = await databases.getDocument(
      env.APPWRITE_DB_ID,
      env.APPWRITE_COL_PROPERTY_TYPES_ID,
      id
    );
    return ok(200, { types: mapTypeDoc(doc) });
  } catch (error) {
    return handleAppwriteError(error);
  }
};

export const handleGetArticles = async () => {
  const cfgError = ensurePublicConfig();
  if (cfgError) return cfgError;

  try {
    const docs = await databases.listDocuments(
      env.APPWRITE_DB_ID,
      env.APPWRITE_COL_PROPERTIES_ID,
      [
        Query.equal("published", true),
        Query.equal("enabled", true),
        Query.limit(200),
        Query.orderDesc("$updatedAt"),
      ]
    );
    return ok(200, { articles: docs.documents.map(mapPropertyDoc) });
  } catch (error) {
    return handleAppwriteError(error);
  }
};

export const handleGetArticle = async (id) => {
  const cfgError = ensurePublicConfig();
  if (cfgError) return cfgError;

  try {
    const doc = await databases.getDocument(
      env.APPWRITE_DB_ID,
      env.APPWRITE_COL_PROPERTIES_ID,
      id
    );
    return ok(200, { article: mapPropertyDoc(doc) });
  } catch (error) {
    return handleAppwriteError(error);
  }
};

export const handleCreateArticle = async (_, data) => {
  try {
    const authUser = await account.get();
    const payload = propertyPayloadFromLegacy({
      ...data,
      user_id: authUser.$id,
    });

    const doc = await databases.createDocument(
      env.APPWRITE_DB_ID,
      env.APPWRITE_COL_PROPERTIES_ID,
      ID.unique(),
      payload,
      propertyPermissions(authUser.$id, payload.published)
    );

    return ok(200, { article: mapPropertyDoc(doc) });
  } catch (error) {
    return handleAppwriteError(error);
  }
};

export const handleUpdateArticle = async (_, id, data) => {
  try {
    const authUser = await account.get();
    const payload = propertyPayloadFromLegacy({
      ...data,
      user_id: authUser.$id,
    });

    const doc = await databases.updateDocument(
      env.APPWRITE_DB_ID,
      env.APPWRITE_COL_PROPERTIES_ID,
      id,
      payload,
      propertyPermissions(authUser.$id, payload.published)
    );

    return ok(200, { article: mapPropertyDoc(doc) });
  } catch (error) {
    return handleAppwriteError(error);
  }
};

export const handleDeleteArticle = async (_, id) => {
  try {
    await databases.deleteDocument(
      env.APPWRITE_DB_ID,
      env.APPWRITE_COL_PROPERTIES_ID,
      id
    );
    return ok(201, { message: "Artículo eliminado" });
  } catch (error) {
    return handleAppwriteError(error);
  }
};

export const handleGetArticlesByType = async (id) => {
  const cfgError = ensurePublicConfig();
  if (cfgError) return cfgError;

  try {
    const docs = await databases.listDocuments(
      env.APPWRITE_DB_ID,
      env.APPWRITE_COL_PROPERTIES_ID,
      [
        Query.equal("typeId", id),
        Query.equal("published", true),
        Query.equal("enabled", true),
        Query.limit(200),
      ]
    );
    return ok(200, { articles: docs.documents.map(mapPropertyDoc) });
  } catch (error) {
    return handleAppwriteError(error);
  }
};

export const handleGetArticlesByUserId = async (_, id) => {
  const cfgError = ensurePublicConfig();
  if (cfgError) return cfgError;

  try {
    const docs = await databases.listDocuments(
      env.APPWRITE_DB_ID,
      env.APPWRITE_COL_PROPERTIES_ID,
      [
        Query.equal("ownerId", id),
        Query.equal("enabled", true),
        Query.limit(200),
        Query.orderDesc("$updatedAt"),
      ]
    );
    return ok(200, { articles: docs.documents.map(mapPropertyDoc) });
  } catch (error) {
    return handleAppwriteError(error);
  }
};

export const handleGetArticleById = async (_, id) => {
  const cfgError = ensurePublicConfig();
  if (cfgError) return cfgError;

  try {
    const doc = await databases.getDocument(
      env.APPWRITE_DB_ID,
      env.APPWRITE_COL_PROPERTIES_ID,
      id
    );
    return ok(200, { article: mapPropertyDoc(doc) });
  } catch (error) {
    return handleAppwriteError(error);
  }
};

export const handleGetAnnounce = async (id) => {
  const cfgError = ensurePublicConfig();
  if (cfgError) return cfgError;

  try {
    const doc = await databases.getDocument(
      env.APPWRITE_DB_ID,
      env.APPWRITE_COL_PROPERTIES_ID,
      id
    );
    return ok(200, { articles: mapPropertyDoc(doc) });
  } catch (error) {
    return handleAppwriteError(error);
  }
};
