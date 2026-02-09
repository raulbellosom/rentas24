# 02_BACKEND_APPWRITE_REQUIREMENTS.md - Rentas24

## Reference
- `00_ai_project_context.md`
- `00_project_brief.md`
- `01_frontend_requirements.md`

---

## Appwrite Platform

- Appwrite self-hosted 1.8.1
- Endpoint: `https://appwrite.racoondevs.com/v1`
- Services:
  - Auth
  - Databases
  - Storage
  - Functions

---

## Auth + Profiles Mirror

- Appwrite Auth is the authentication source of truth.
- Extra user/business fields are stored in `profiles`.
- Rule: every Auth user must have exactly one profile document.
  - Preferred: `profiles.$id == authUserId`

Enforcement:
- Function trigger: `ensure-profile-on-signup`
- Optional sync function for profile edits: `sync-user-profile`

---

## Database

- Primary database: `main`
- No relational attributes
- Cross-entity links are scalar string IDs

---

## Storage Buckets

- `user_avatars` (private)
- `property_photos` (public only for published properties)
- `user_documents` (private, optional)

---

## Functions Runtime

- Node.js >= 18
- `node-appwrite` >= 17.0.0
- Function file structure:
  - `.env.example`
  - `README.md`
  - `package.json`
  - `src/index.js`
