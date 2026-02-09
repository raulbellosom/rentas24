# email-verification

Type: HTTP Function  
Runtime: Node 18+  
SDK: `node-appwrite@^17`

## Purpose

Handles verification email lifecycle:

- `send`: create token + send verification email
- `resend`: invalidate previous active tokens + send a new one
- `verify`: validate token and mark user email as verified in Appwrite Auth and `profiles.emailVerified=true`

Resend cooldown:

- Default cooldown is 3 minutes between sends for the same user/email.
- Returns HTTP `429` with `retryAfterSeconds` when the cooldown is active.

## Required Appwrite collection

This function expects a token collection (default: `email_verifications`) with fields:

- `userAuthId` (string)
- `email` (string/email)
- `token` (string, unique recommended)
- `expireAt` (datetime)
- `used` (boolean)
- `invalidated` (boolean)

## Environment variables

- `APPWRITE_FUNCTION_ENDPOINT` (or `APPWRITE_ENDPOINT`)
- `APPWRITE_FUNCTION_PROJECT_ID` (or `APPWRITE_PROJECT_ID`)
- `APPWRITE_FUNCTION_API_KEY` (or `APPWRITE_API_KEY`)
- `APPWRITE_DB_ID`
- `APPWRITE_COL_PROFILES_ID`
- `APPWRITE_COL_EMAIL_VERIFICATIONS_ID`
- `APP_BASE_URL`
- `EMAIL_SMTP_HOST`
- `EMAIL_SMTP_PORT`
- `EMAIL_SMTP_SECURE`
- `EMAIL_SMTP_USER`
- `EMAIL_SMTP_PASS`
- `EMAIL_FROM_NAME`
- `EMAIL_FROM_ADDRESS`
- `EMAIL_VERIFICATION_TTL_MINUTES`
- `EMAIL_VERIFICATION_RESEND_COOLDOWN_SECONDS` (default: `180`)

## API key scopes

- `users.read`
- `users.write`
- `databases.read`
- `databases.write`

## Body examples

Send:

```json
{
  "action": "send",
  "userAuthId": "66f0...",
  "email": "user@example.com"
}
```

Verify:

```json
{
  "action": "verify",
  "token": "66f0..."
}
```
