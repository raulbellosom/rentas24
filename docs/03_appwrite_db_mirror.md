# 03_APPWRITE_DB_MIRROR.md – Rentas24

This file is the **console-ready mirror** of Appwrite schema.
Agents MUST keep it synchronized with the Appwrite Console.

## Instance

- endpoint: https://appwrite.racoondevs.com
- appwriteVersion: 1.8.1
- databaseId: main

## Index format (mandatory)

| Index Name           | Type     | Attributes  | Notes           |
| -------------------- | -------- | ----------- | --------------- |
| uq_collection_attr   | unique   | attribute ↑ | uniqueness      |
| key_collection_attr  | key      | attribute ↑ | query patterns  |
| full_collection_attr | fulltext | attribute   | fulltext search |

Rules:

- Index names <= 60 chars.
- Prefixes: `uq_`, `key_`, `full_`
- Use ↑ / ↓ for ASC/DESC.

---

## Buckets

| Bucket key (env var)               | bucketId        | Purpose         | Max single file size | Allowed extensions | Public?                 |
| ---------------------------------- | --------------- | --------------- | -------------------- | ------------------ | ----------------------- |
| APPWRITE_BUCKET_USER_AVATARS_ID    | user_avatars    | User avatars    | 5MB                  | png,jpg,jpeg,webp  | no                      |
| APPWRITE_BUCKET_PROPERTY_PHOTOS_ID | property_photos | Property photos | 15MB                 | png,jpg,jpeg,webp  | conditional (published) |
| APPWRITE_BUCKET_USER_DOCUMENTS_ID  | user_documents  | User documents  | 10MB                 | pdf,png,jpg,jpeg   | no                      |

---

## Collections

### profiles (required)

Purpose:

- Mirror of Auth user + extended profile fields.

Document ID:

- Preferred: `$id == authUserId`

| Attribute     | Type    | Required | Default | Constraint(s)      | Notes                                     |
| ------------- | ------- | -------- | ------- | ------------------ | ----------------------------------------- |
| firstName     | string  | yes      |         | size=95            | legacy User.firstName                     |
| lastName      | string  | yes      |         | size=95            | legacy User.lastName                      |
| email         | email   | yes      |         |                    | must match Auth email                     |
| emailVerified | boolean | no       | false   |                    | mirror of Auth emailVerification          |
| phoneCode     | string  | no       | "+52"   | size=5             | legacy phone_code                         |
| phone         | string  | no       |         | size=15            | optional but should be unique if present  |
| role          | enum    | no       | tenant  | admin,owner,tenant | business role                             |
| addressJson   | string  | no       | "{}"    | size=5000          | JSON string, legacy address object        |
| photosJson    | string  | no       | "{}"    | size=2000          | JSON string, legacy photos object         |
| termsAccepted | boolean | no       | false   |                    | legacy terms                              |
| status        | integer | no       | 1       | min=0,max=9        | legacy status/typeUser separation removed |
| enabled       | boolean | no       | true    |                    | soft delete                               |

Indexes:

| Index Name           | Type   | Attributes | Notes              |
| -------------------- | ------ | ---------- | ------------------ |
| uq_profiles_email    | unique | email ↑    | unique emails      |
| key_profiles_emailv  | key    | emailVerified ↑ | verify status filter |
| key_profiles_role    | key    | role ↑     | filter by role     |
| key_profiles_enabled | key    | enabled ↑  | soft delete filter |

Permissions:

- read/update: `user:{{userId}}`

Migration notes (2026-02):

- Remove legacy attribute `filesJson` from `profiles` if it still exists in Console.
- Add boolean attribute `emailVerified` with default `false`.
- Add key index `key_profiles_emailv` on `emailVerified` ascending.

---

### property_types

| Attribute | Type    | Required | Default | Constraint(s) | Notes                    |
| --------- | ------- | -------- | ------- | ------------- | ------------------------ |
| name      | string  | yes      |         | size=95       | legacy ArticleTypes.name |
| key       | string  | yes      |         | size=45       | legacy clave, url-safe   |
| enabled   | boolean | no       | true    |               | soft delete              |

Indexes:

| Index Name                | Type   | Attributes | Notes      |
| ------------------------- | ------ | ---------- | ---------- |
| uq_propertytypes_key      | unique | key ↑      | unique key |
| key_propertytypes_enabled | key    | enabled ↑  | filter     |

Permissions:

- read:any
- write: admin

---

### rent_recurrencies

| Attribute | Type    | Required | Default | Constraint(s) | Notes                           |
| --------- | ------- | -------- | ------- | ------------- | ------------------------------- |
| name      | string  | yes      |         | size=60       | legacy Recurrency.name          |
| key       | string  | yes      |         | size=30       | legacy clave                    |
| enabled   | boolean | no       | true    |               | legacy status mapped to enabled |

Indexes:

| Index Name               | Type   | Attributes | Notes      |
| ------------------------ | ------ | ---------- | ---------- |
| uq_recurrencies_key      | unique | key ↑      | unique key |
| key_recurrencies_enabled | key    | enabled ↑  | filter     |

Permissions:

- read:any
- write: admin

---

### properties

Purpose:

- Property listing (legacy Articles).

| Attribute           | Type     | Required | Default | Constraint(s)  | Notes                                       |
| ------------------- | -------- | -------- | ------- | -------------- | ------------------------------------------- |
| ownerId             | string   | yes      |         | size=64        | legacy user_id                              |
| typeId              | string   | yes      |         | size=64        | legacy type_id                              |
| title               | string   | yes      |         | size=150       | legacy title                                |
| description         | string   | yes      |         | size=20000     | legacy description                          |
| characteristicsJson | string   | no       | "{}"    | size=20000     | legacy characteristics object               |
| photoFileIds        | string[] | no       | []      | size=64,max=20 | legacy photos (file ids in property_photos) |
| addressJson         | string   | no       | "{}"    | size=5000      | legacy address object                       |
| price               | float    | yes      | 0       | min=0          | from announcement.price                     |
| currency            | string   | no       | "MXN"   | size=3         | announcement.currency                       |
| isRecurrent         | boolean  | no       | false   |                | announcement.is_recurrent                   |
| recurrencyId        | string   | no       | ""      | size=64        | maps to rent_recurrencies.$id               |
| isAdvance           | boolean  | no       | false   |                | announcement.isAdvance                      |
| advanceAmount       | float    | no       | 0       | min=0          | announcement.advanceAmount                  |
| startDate           | datetime | no       |         |                | announcement.start_date                     |
| endDate             | datetime | no       |         |                | announcement.end_date                       |
| faqsJson            | string   | no       | "{}"    | size=20000     | legacy faqs                                 |
| available           | boolean  | no       | true    |                | legacy available                            |
| published           | boolean  | no       | false   |                | controls public visibility                  |
| enabled             | boolean  | no       | true    |                | soft delete                                 |

Indexes:

| Index Name               | Type     | Attributes             | Notes                 |
| ------------------------ | -------- | ---------------------- | --------------------- |
| key_properties_ownerid   | key      | ownerId ↑              | list owner properties |
| key_properties_typeid    | key      | typeId ↑               | filter by type        |
| key_properties_pub_enab  | key      | published ↑, enabled ↑ | public listings       |
| key_properties_available | key      | available ↑            | availability filter   |
| key_properties_price     | key      | price ↑                | sorting / filtering   |
| full_properties_title    | fulltext | title                  | search by title       |

Permissions:

- owner full access: `user:{{userId}}`
- public read: `read:any` only when published (strategy must be consistent)

---

### rental_proposals

Purpose:

- Tenant proposal to rent a property (legacy Proposal).

| Attribute    | Type     | Required | Default | Constraint(s)                               | Notes                  |
| ------------ | -------- | -------- | ------- | ------------------------------------------- | ---------------------- |
| propertyId   | string   | yes      |         | size=64                                     | target property        |
| tenantId     | string   | yes      |         | size=64                                     | legacy client_id       |
| ownerId      | string   | yes      |         | size=64                                     | legacy owner_id        |
| proposalJson | string   | yes      |         | size=20000                                  | legacy proposal object |
| commentsJson | string   | no       | "[]"    | size=20000                                  | legacy comments array  |
| status       | enum     | no       | PENDING | PENDING,ACCEPTED,REJECTED,EXPIRED,CANCELLED | lifecycle              |
| expiresAt    | datetime | no       |         |                                             | optional               |
| enabled      | boolean  | no       | true    |                                             | soft delete            |

Indexes:

| Index Name               | Type | Attributes   | Notes                       |
| ------------------------ | ---- | ------------ | --------------------------- |
| key_proposals_propertyid | key  | propertyId ↑ | list proposals for property |
| key_proposals_ownerid    | key  | ownerId ↑    | owner inbox                 |
| key_proposals_tenantid   | key  | tenantId ↑   | tenant history              |
| key_proposals_status     | key  | status ↑     | filter by status            |

Permissions:

- created by tenant with read/update: `user:{{tenantId}}`
- owner read permission should be added server-side

---

### rental_payments

Purpose:

- Payment record (legacy Rents).

| Attribute    | Type     | Required | Default | Constraint(s) | Notes                  |
| ------------ | -------- | -------- | ------- | ------------- | ---------------------- |
| propertyId   | string   | yes      |         | size=64       | legacy article_id      |
| tenantId     | string   | yes      |         | size=64       | legacy user_id (payer) |
| ownerId      | string   | yes      |         | size=64       | property owner         |
| paidAt       | datetime | yes      |         |               | legacy rent_date       |
| amount       | float    | yes      | 0       | min=0         | payment amount         |
| currency     | string   | no       | "MXN"   | size=3        | currency               |
| commentsJson | string   | no       | "[]"    | size=20000    | legacy comments        |
| enabled      | boolean  | no       | true    |               | soft delete            |

Indexes:

| Index Name              | Type | Attributes   | Notes                  |
| ----------------------- | ---- | ------------ | ---------------------- |
| key_payments_propertyid | key  | propertyId ↑ | payments per property  |
| key_payments_tenantid   | key  | tenantId ↑   | payments per tenant    |
| key_payments_ownerid    | key  | ownerId ↑    | payments per owner     |
| key_payments_paidat     | key  | paidAt ↓     | sorting by most recent |

Permissions:

- private to owner+tenant

---

### email_verifications (function support)

Purpose:

- Token store used by `email-verification` function.

| Attribute   | Type     | Required | Default | Constraint(s) | Notes                     |
| ----------- | -------- | -------- | ------- | ------------- | ------------------------- |
| userAuthId  | string   | yes      |         | size=64       | target Auth user id       |
| email       | email    | yes      |         |               | email at token issue time |
| token       | string   | yes      |         | size=128      | unique recommended        |
| expireAt    | datetime | yes      |         |               | token expiration          |
| used        | boolean  | no       | false   |               | consumed token            |
| invalidated | boolean  | no       | false   |               | replaced token            |

Indexes:

| Index Name            | Type   | Attributes            | Notes             |
| --------------------- | ------ | --------------------- | ----------------- |
| uq_emailverif_token   | unique | token ↑               | one token id      |
| key_emailverif_userid | key    | userAuthId ↑          | user token lookup |
| key_emailverif_active | key    | used ↑, invalidated ↑ | active tokens     |

Permissions:

- private (function service key access)

---

## Notes: JSON fields in Appwrite

Legacy JSON columns were converted to **string attributes containing JSON** (e.g. `addressJson`).
Frontend must parse/serialize consistently.


