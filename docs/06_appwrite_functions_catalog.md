# 06_APPWRITE_FUNCTIONS_CATALOG.md - Rentas24

## Reference
- `00_ai_project_context.md`
- `02_backend_appwrite_requirements.md`
- `05_permissions_and_roles.md`

This file defines the official functions catalog.

---

## Global Rules

- Node.js >= 18
- `node-appwrite` >= 17.0.0
- Structure per function:
  - `.env.example`
  - `README.md`
  - `package.json`
  - `/src/index.js`
- No secrets in repo.
- Validate required environment variables at runtime.

---

## Functions

### 1) ensure-profile-on-signup

Type: Event Trigger  
Event: user creation (`users.*.create`)

Purpose:
- Create or upsert `profiles` mirror using `profiles.$id == authUserId`
- Set defaults (`role=tenant`, `enabled=true`, `status=1`)
- Set `profiles.emailVerified` from Auth `emailVerification`
- Optionally trigger `email-verification` function

---

### 2) sync-user-profile

Type: HTTP Function

Purpose:
- Update `profiles/{userId}` data
- Keep Appwrite Auth fields in sync (`name`, `email`, `phone`)
- Reset Auth `emailVerification=false` when email changes
- Keep `profiles.emailVerified` synchronized (`false` on email change)

---

### 3) email-verification

Type: HTTP Function

Purpose:
- Send verification email token (`send`)
- Resend verification (`resend`)
- Validate token and mark Auth email verified (`verify`)
- Sync `profiles.emailVerified=true` when token is valid

Dependencies:
- SMTP provider
- Token collection: `email_verifications`

---

### 4) publish-property

Type: HTTP Function

Purpose:
- Validate property draft ownership and required fields
- Set `published=true`
- Optionally add `read:any` permission

---

### 5) expire-proposals-cron

Type: Cron Job (daily)

Purpose:
- Mark proposals expired when `expiresAt < now`
