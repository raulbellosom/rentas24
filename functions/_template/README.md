# Appwrite Function Template

Use this folder as base for new functions.

## Steps

1. Copy `/functions/_template` to `/functions/<function-name>`
2. Update:
   - `README.md`
   - `.env.example`
   - `package.json`
   - `src/index.js`

## Rules

- Runtime: Node 18+
- SDK: `node-appwrite@^17`
- Keep unified env names (`APPWRITE_*`, `APP_*`, `EMAIL_*`)
- Never commit real secret values
