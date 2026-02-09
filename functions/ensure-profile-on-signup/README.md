# ensure-profile-on-signup

Trigger: `users.*.create`  
Runtime: Node 18+  
SDK: `node-appwrite@^17`

## Purpose

Creates or updates `profiles/{authUserId}` as the mirror document for every new Appwrite Auth user.

Default profile values:
- `role: tenant`
- `enabled: true`
- `status: 1`
- `emailVerified` synchronized from Appwrite Auth `emailVerification`
- JSON fields initialized as `{}` (`addressJson`, `photosJson`)

## Optional behavior

If `APPWRITE_FUNCTION_EMAIL_VERIFICATION_ID` is set, this function triggers the `email-verification` function with action `send`.

## Required environment variables

- `APPWRITE_FUNCTION_ENDPOINT` (or `APPWRITE_ENDPOINT`)
- `APPWRITE_FUNCTION_PROJECT_ID` (or `APPWRITE_PROJECT_ID`)
- `APPWRITE_FUNCTION_API_KEY` (or `APPWRITE_API_KEY`)
- `APPWRITE_DB_ID`
- `APPWRITE_COL_PROFILES_ID`

## Recommended API key scopes

- `users.read`
- `databases.read`
- `databases.write`
- `execution.write` (only if chaining email-verification)
