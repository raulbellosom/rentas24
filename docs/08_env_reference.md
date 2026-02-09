# 08_ENV_REFERENCE.md - Rentas24

## Reference
- `00_ai_project_context.md`
- `01_frontend_requirements.md`
- `02_backend_appwrite_requirements.md`
- `06_appwrite_functions_catalog.md`

---

## Unified Strategy

Rentas24 uses **one naming contract** for frontend and functions:
- `APP_*`
- `APPWRITE_*`
- `EMAIL_*`

No duplicated aliases like `VITE_APP_URL` vs `APP_URL`.

Vite receives only safe public values through `vite.config.js` define allowlist.

---

## Core App Variables

| Variable | Purpose |
| --- | --- |
| `APP_ENV` | local/staging/prod |
| `APP_BASE_URL` | Frontend base URL |
| `FEATURE_VERBOSE_LOGS` | Enable extra logs in frontend |

---

## Appwrite Core

| Variable | Purpose |
| --- | --- |
| `APPWRITE_ENDPOINT` | Appwrite endpoint (`https://appwrite.racoondevs.com/v1`) |
| `APPWRITE_PROJECT_ID` | Appwrite project id |
| `APPWRITE_DB_ID` | Database id (`main`) |

---

## Collection IDs

| Variable | Collection |
| --- | --- |
| `APPWRITE_COL_PROFILES_ID` | profiles |
| `APPWRITE_COL_PROPERTY_TYPES_ID` | property_types |
| `APPWRITE_COL_RENT_RECURRENCIES_ID` | rent_recurrencies |
| `APPWRITE_COL_PROPERTIES_ID` | properties |
| `APPWRITE_COL_RENTAL_PROPOSALS_ID` | rental_proposals |
| `APPWRITE_COL_RENTAL_PAYMENTS_ID` | rental_payments |
| `APPWRITE_COL_EMAIL_VERIFICATIONS_ID` | email_verifications (function support) |

---

## Bucket IDs

| Variable | Bucket |
| --- | --- |
| `APPWRITE_BUCKET_USER_AVATARS_ID` | user_avatars |
| `APPWRITE_BUCKET_PROPERTY_PHOTOS_ID` | property_photos |
| `APPWRITE_BUCKET_USER_DOCUMENTS_ID` | user_documents |

---

## Function IDs

| Variable | Function |
| --- | --- |
| `APPWRITE_FUNCTION_ENSURE_PROFILE_ID` | ensure-profile-on-signup |
| `APPWRITE_FUNCTION_SYNC_PROFILE_ID` | sync-user-profile |
| `APPWRITE_FUNCTION_EMAIL_VERIFICATION_ID` | email-verification |

---

## Server / Functions Secrets

| Variable | Purpose |
| --- | --- |
| `APPWRITE_API_KEY` | Service API key |
| `EMAIL_SMTP_HOST` | SMTP host |
| `EMAIL_SMTP_PORT` | SMTP port |
| `EMAIL_SMTP_SECURE` | SMTP TLS flag |
| `EMAIL_SMTP_USER` | SMTP username |
| `EMAIL_SMTP_PASS` | SMTP password |
| `EMAIL_FROM_NAME` | Sender display name |
| `EMAIL_FROM_ADDRESS` | Sender email |
| `EMAIL_VERIFICATION_TTL_MINUTES` | Verification token expiration |
| `EMAIL_VERIFICATION_RESEND_COOLDOWN_SECONDS` | Cooldown between resends (default: 180) |
