# 00_PROJECT_BRIEF.md – Rentas24

## Reference

This document is governed by:
- `00_ai_project_context.md`

It defines the product scope and goals. It does not redefine technical rules.

---

## Product Vision

Rentas24 is a platform to publish **property listings** and manage the **rental lifecycle**:
- Owners publish properties with photos, characteristics, pricing and terms
- Tenants browse and submit proposals
- Owners accept/reject proposals
- The system records rental payments and ongoing status

---

## Key Modules

1. **Public Listings**
   - Search/browse properties
   - Property detail page
   - Contact / proposal action

2. **Auth + Profiles**
   - Appwrite Auth for accounts
   - Profiles collection as the “user extension” mirror

3. **Owner Panel**
   - Property CRUD
   - Proposal inbox and decisioning
   - Rental overview

4. **Tenant Panel**
   - Proposal history
   - Rental payment history

5. **Admin**
   - User management (moderation/disable)
   - Content moderation (disable properties)
   - System configuration (types, recurrencies)

---

## Out of Scope (for now)

- Online payment processing
- E-sign contracts
- Tax invoicing
- Advanced messaging/chat
- Multi-currency accounting

---

## Migration Goal

Legacy Sequelize models are mapped to Appwrite collections:
- `User` → `profiles` (and Appwrite Auth)
- `Articles` → `properties`
- `ArticleTypes` → `property_types`
- `Recurrency` → `rent_recurrencies`
- `Proposal` → `rental_proposals`
- `Rents` → `rental_payments`

Mapping details in `10_migration_notes_from_sequelize.md`.
