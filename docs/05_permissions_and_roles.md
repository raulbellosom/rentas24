# 05_PERMISSIONS_AND_ROLES.md – Rentas24

## Reference
- `00_ai_project_context.md`
- `02_backend_appwrite_requirements.md`
- `03_appwrite_db_schema.md` / `03_appwrite_db_mirror.md`

---

## Roles (Business)

- admin
- owner
- tenant

Implementation:
- `profiles.role` is an enum: `admin,owner,tenant`
- Access is enforced with Appwrite document permissions plus role checks in Functions for privileged actions.

---

## Permission Strategy (Appwrite)

### Conventions

Owner-only document permissions:
- `read("user:{userId}")`
- `update("user:{userId}")`
- `delete("user:{userId}")` (if deletes are allowed; otherwise soft-delete with `enabled=false`)

Public read:
- `read("any")` only for records that are safe to be public **and** filtered by `published=true` and `enabled=true`.

### Soft Delete
Most collections include:
- `enabled: boolean` default `true`

Disabled records must be filtered out by frontend queries.

---

## Collection Access Summary

- `profiles`: private to the user + admin
- `property_types`: admin writable, public readable
- `rent_recurrencies`: admin writable, public readable
- `properties`: public read only if `published=true AND enabled=true`
- `rental_proposals`: private between tenant and owner
- `rental_payments`: private between tenant and owner
