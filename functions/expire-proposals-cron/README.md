# expire-proposals-cron

Type: Cron Function (daily)  
Runtime: Node 18+  
SDK: `node-appwrite@^17`

## Purpose

Marks pending proposals as expired when `expiresAt < now`.

Update performed:
- `status: PENDING -> EXPIRED`

## Environment variables

- `APPWRITE_FUNCTION_ENDPOINT` or `APPWRITE_ENDPOINT`
- `APPWRITE_FUNCTION_PROJECT_ID` or `APPWRITE_PROJECT_ID`
- `APPWRITE_FUNCTION_API_KEY` or `APPWRITE_API_KEY`
- `APPWRITE_DB_ID`
- `APPWRITE_COL_RENTAL_PROPOSALS_ID`
