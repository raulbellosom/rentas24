# 00_AI_PROJECT_CONTEXT.md – Rentas24

## Purpose of This Document

This file defines the **root, immutable context** for the Rentas24 modernization.
It exists to give continuous, stable context to AI agents (VS Code Agent Mode), developers, and automation.

This document is the **highest authority** of the documentation bundle. Nothing else may contradict it.

---

## Project Identity

- Product: **Rentas24**
- Domain: **Real estate rentals** (property listings, owners, tenants, proposals, rental payments)
- Frontend: React + Vite (JavaScript only)
- Backend: Appwrite **1.8.1** self-hosted at `https://appwrite.racoondevs.com`
- Data model: **No relational attributes**. Only scalar references (`string` IDs).
- Goal: Replace legacy backend (Docker + Express + Sequelize) with Appwrite primitives:
  - Auth
  - Databases
  - Storage
  - Functions

---

## Non‑Negotiable Rules

### 1) Frontend
- ReactJS + Vite
- JavaScript only (no TypeScript)
- Mobile‑first UI
- TailwindCSS 4.1 (dark mode first‑class)
- No mock data, no fake data
- No emojis in UI, code, docs

### 2) Backend (Appwrite)
- Appwrite 1.8.1 only (no undocumented APIs)
- Collections and attributes must match real Appwrite types/constraints
- Permissions enforced primarily by Appwrite permissions (not frontend)
- No SQL-style relations; all links are via string IDs

### 3) Environment Variables
- `.env.example` must exist and be kept updated
- Same logical variable names across layers (`APP_*`, `APPWRITE_*`, `EMAIL_*`)
- Frontend receives only safe public env through Vite allowlist (no secret exposure)

### 4) AI Agent Contract
- This bundle is the **single source of truth**
- If something is missing, the agent must:
  1) Propose a documentation update first, or
  2) Ask for clarification
- The agent must not invent new entities beyond this bundle.

---

## Primary User Roles (Business)

- **Admin**: manages platform, compliance, content moderation, supports users
- **Owner**: publishes properties, receives proposals, manages rentals
- **Tenant**: browses properties, sends proposals, manages payments / history

(Technical roles & permissions are defined in `05_permissions_and_roles.md`.)

---

## Success Criteria

- Appwrite schema mirror is complete and implementable in Console
- Frontend can migrate incrementally using Agents AI referencing `/documentation`
- Core flows work end-to-end:
  - Auth + profile mirror
  - Property listing CRUD
  - Proposals between tenant/owner
  - Rental payments (records) attached to property and tenant
- Consistent mobile-first UI + dark mode

---

## Status

- Bundle created on 2026-02-09.
