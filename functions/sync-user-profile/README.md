# sync-user-profile

Type: HTTP Function  
Runtime: Node 18+  
SDK: `node-appwrite@^17`

## Purpose

Synchronizes profile edits between:
- Appwrite database document: `profiles/{userId}`
- Appwrite Auth user fields: `name`, `email`, `phone`

If email changes, this function resets `emailVerification` to `false` in Auth.
It also sets `profiles.emailVerified=false` for mirror consistency.

## Security model

Uses the authenticated function user (`APPWRITE_FUNCTION_USER_ID`) as source of truth.  
Only allows editing the profile associated with that user ID.

## Environment variables

- `APPWRITE_FUNCTION_ENDPOINT` (or `APPWRITE_ENDPOINT`)
- `APPWRITE_FUNCTION_PROJECT_ID` (or `APPWRITE_PROJECT_ID`)
- `APPWRITE_FUNCTION_API_KEY` (or `APPWRITE_API_KEY`)
- `APPWRITE_DB_ID`
- `APPWRITE_COL_PROFILES_ID`

## API key scopes

- `users.read`
- `users.write`
- `databases.read`
- `databases.write`

## Expected payload

```json
{
  "firstName": "Juan",
  "lastName": "Perez",
  "email": "juan@example.com",
  "phoneCode": "+52",
  "phone": "3221234567",
  "address": { "city": "Puerto Vallarta" },
  "photos": { "profile": "https://..." }
}
```
