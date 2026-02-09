# publish-property

Type: HTTP Function  
Runtime: Node 18+  
SDK: `node-appwrite@^17`

## Purpose

Publishes a property after validating required data:
- Owner authorization
- title
- description
- addressJson
- price > 0
- at least one photo file id

## Input

```json
{
  "propertyId": "..."
}
```

## Environment variables

- `APPWRITE_FUNCTION_ENDPOINT` or `APPWRITE_ENDPOINT`
- `APPWRITE_FUNCTION_PROJECT_ID` or `APPWRITE_PROJECT_ID`
- `APPWRITE_FUNCTION_API_KEY` or `APPWRITE_API_KEY`
- `APPWRITE_DB_ID`
- `APPWRITE_COL_PROPERTIES_ID`
