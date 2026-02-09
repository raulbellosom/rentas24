# 10_MIGRATION_NOTES_FROM_SEQUELIZE.md – Rentas24

## Legacy Models Found

- user.js
- articles.js
- articletypes.js
- recurrency.js
- proposal.js
- rents.js

## Mapping Summary

### User → Auth + profiles
Legacy:
- firstName, lastName, email, phone_code, phone, address (JSON), files (JSON), photos (JSON), terms, status, typeUser

New:
- Auth manages login/security.
- profiles stores the extra fields + role enum.

### Articles → properties
Legacy:
- title, description, characteristics (JSON), photos (JSON), address (JSON), available, announcement JSON, faqs, type_id, user_id

New:
- properties with explicit scalar fields + `*Json` strings.

### Proposal → rental_proposals
Legacy:
- proposal (JSON), comments, client_id, owner_id

New:
- rental_proposals with `proposalJson`, `commentsJson`, `tenantId`, `ownerId`, `propertyId`

### Rents → rental_payments
Legacy:
- rent_date, comments, user_id, article_id

New:
- rental_payments with `paidAt`, `amount`, etc.

Important:
- Legacy `rents.js` does not expose an `amount` field. If amount exists elsewhere, migration must extract it.
