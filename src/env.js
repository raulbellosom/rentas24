const runtimeInjectedEnv =
  typeof __R24_ENV__ !== "undefined" && __R24_ENV__ ? __R24_ENV__ : {};

const source = {
  ...import.meta.env,
  ...runtimeInjectedEnv,
};

const toBoolean = (value, fallback = false) => {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }
  if (typeof value === "boolean") {
    return value;
  }
  const normalized = String(value).toLowerCase();
  return normalized === "true" || normalized === "1" || normalized === "yes";
};

export const env = {
  APP_ENV: source.APP_ENV || "local",
  APP_BASE_URL: source.APP_BASE_URL || "http://localhost:5173",
  APPWRITE_ENDPOINT:
    source.APPWRITE_ENDPOINT || "https://appwrite.racoondevs.com/v1",
  APPWRITE_PROJECT_ID: source.APPWRITE_PROJECT_ID || "",
  APPWRITE_DB_ID: source.APPWRITE_DB_ID || "main",
  APPWRITE_COL_PROFILES_ID: source.APPWRITE_COL_PROFILES_ID || "profiles",
  APPWRITE_COL_PROPERTY_TYPES_ID:
    source.APPWRITE_COL_PROPERTY_TYPES_ID || "property_types",
  APPWRITE_COL_RENT_RECURRENCIES_ID:
    source.APPWRITE_COL_RENT_RECURRENCIES_ID || "rent_recurrencies",
  APPWRITE_COL_PROPERTIES_ID:
    source.APPWRITE_COL_PROPERTIES_ID || "properties",
  APPWRITE_COL_RENTAL_PROPOSALS_ID:
    source.APPWRITE_COL_RENTAL_PROPOSALS_ID || "rental_proposals",
  APPWRITE_COL_RENTAL_PAYMENTS_ID:
    source.APPWRITE_COL_RENTAL_PAYMENTS_ID || "rental_payments",
  APPWRITE_COL_EMAIL_VERIFICATIONS_ID:
    source.APPWRITE_COL_EMAIL_VERIFICATIONS_ID || "email_verifications",
  APPWRITE_BUCKET_USER_AVATARS_ID:
    source.APPWRITE_BUCKET_USER_AVATARS_ID || "user_avatars",
  APPWRITE_BUCKET_PROPERTY_PHOTOS_ID:
    source.APPWRITE_BUCKET_PROPERTY_PHOTOS_ID || "property_photos",
  APPWRITE_BUCKET_USER_DOCUMENTS_ID:
    source.APPWRITE_BUCKET_USER_DOCUMENTS_ID || "user_documents",
  APPWRITE_FUNCTION_SYNC_PROFILE_ID:
    source.APPWRITE_FUNCTION_SYNC_PROFILE_ID || "",
  APPWRITE_FUNCTION_EMAIL_VERIFICATION_ID:
    source.APPWRITE_FUNCTION_EMAIL_VERIFICATION_ID || "",
  APPWRITE_FUNCTION_ENSURE_PROFILE_ID:
    source.APPWRITE_FUNCTION_ENSURE_PROFILE_ID || "",
  EMAIL_VERIFICATION_TTL_MINUTES:
    Number(source.EMAIL_VERIFICATION_TTL_MINUTES) || 120,
  FEATURE_VERBOSE_LOGS: toBoolean(source.FEATURE_VERBOSE_LOGS, false),
};

export const hasPublicAppwriteConfig = Boolean(
  env.APPWRITE_ENDPOINT && env.APPWRITE_PROJECT_ID && env.APPWRITE_DB_ID
);
