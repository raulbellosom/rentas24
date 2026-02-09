# 03_APPWRITE_DB_SCHEMA.md – Rentas24

## Reference
- `00_ai_project_context.md`
- `00_project_brief.md`
- `01_frontend_requirements.md`
- `02_backend_appwrite_requirements.md`

This document defines the **logical schema** for Appwrite 1.8.1.
For the exact console-ready mirror (attributes, constraints, indexes, permissions), see:
- `03_appwrite_db_mirror.md`

---

## Rules

- No relationship attributes. References are `string` IDs only.
- Default “soft delete”: `enabled=true` on key collections.
- Public listings must be queryable by: `published=true AND enabled=true`.

---

## Collections (Overview)

1. **profiles**
2. **property_types**
3. **rent_recurrencies**
4. **properties**
5. **rental_proposals**
6. **rental_payments**

---

## Storage Buckets (Overview)

- user_avatars
- property_photos
- user_documents (optional)
