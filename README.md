# Kaydoption preview

A React and TypeScript concept preview for the adopter discovery experience. It runs with Node.js and uses sample pets plus externally hosted Unsplash photography.

## Run locally

```sh
npm start
```

Then open <http://localhost:4173>. The React development server proxies `/api` requests to the local API server on port 4174.

## Deploy the preview to Vercel

This repository is configured for Vercel: its Vite build publishes `dist/`, and the three demo API endpoints run as Node.js Functions under `/api/v1/pets`. Import the repository into Vercel or run `npx vercel` from the project root. Use Node.js 22.x; no production secrets or environment variables are needed for this demo.

This makes the **sample preview** deployable, not the full adoption platform described in the feature brief. The API uses in-memory fixture data and per-instance rate limits. Authentication, database persistence, tenant isolation, applications, document storage, scheduling, payments, and shelter administration are not implemented. Do not collect adopter information or use this deployment for real adoption decisions or transactions.

## Preview scope

The React + TypeScript preview provides typed pet search and matching hooks, server-backed species/size/age/compatibility filters, pagination, saved-pet hearts, and a lifestyle questionnaire with ranked matches. The preview API is in-memory and has no database, authentication, shelter console, foster workflow, application submission, file storage, booking, payment, notification, or e-signature integration. Sample shelter and pet details are illustrative. Do not use this preview to contact a shelter or make adoption decisions.

## Demo API

- `GET /api/v1/pets`: filter by `species`, `breed`, `min_age_months`, `max_age_months`, `size`, `good_with_kids`, `good_with_pets`, `shelter_id`, and `status`; paginates with `page` and `limit` (maximum 100).
- `POST /api/v1/pets/match`: scores currently available pets against optional lifestyle preferences and returns ranked matches with reasons. The score is normalized over the preferences supplied, so omitted preferences do not reduce a score.
- `GET /api/v1/pets/facets`: returns available-pet counts by species, size, and species/size combination.

These endpoints use fixture data in `server.js`; they are not production REST services and have no identity, tenant isolation, or persistence.

## Request validation and abuse controls

- Search query parameters and matching request bodies use shared Zod schemas in `shared/schemas.mjs`. The React hooks validate before sending, and the API validates again before processing. Match JSON bodies are limited to 64 KB.
- Pet search and facets allow 60 requests per IP per rolling minute; lifestyle matching allows 30. The API uses the socket peer address and does not trust client-supplied forwarding headers. Responses over the limit return HTTP 429 and `Retry-After`.
- This preview's limiter is in-memory and per process. Production deployments need a shared store such as Redis and trusted-proxy configuration so client IPs are derived safely across instances.
- Authentication/RBAC, adoption application submission, document uploads, PII access controls, audit history, and retention jobs are not implemented. There are currently no application PII or file-upload endpoints to protect. Add authorization and private, signature-validated object storage before building those workflows.

## Local secrets and pre-commit checks

- Copy `.env.example` to `.env` and replace placeholders locally. `.env` and other secret files are ignored by Git.
- Install the official Gitleaks binary from its [releases page](https://github.com/gitleaks/gitleaks/releases) and put it on `PATH`, or place the platform binary at `.tools/gitleaks` (`.exe` on Windows). The local `.tools` directory is ignored.
- `npm install` runs Husky’s `prepare` script. The pre-commit hook scans staged changes with Gitleaks, then runs ESLint and Prettier on staged files.
- The `.env.example` allowlist is limited to that placeholder template. Lockfiles and other project files remain scanned.

## Pre-launch architecture and schema review

The feature brief describes a multi-tenant service, but the supplied DDL is not sufficient for a production launch:

- **Tenant isolation is absent.** There is no tenant/organization model or membership table. A global `users.role` cannot represent a staff member belonging to one shelter and a foster/adopter relationship scoped to another. Add tenant ownership and membership, enforce it in every query/API authorization path, and consider PostgreSQL row-level security as defense in depth.
- **Several core workflows have no tables.** Intake/microchips/kennels, medical events and schedules, behavioral assessments, media metadata, foster placements and updates, appointments, uploaded-document metadata, interview notes, contracts/signatures, and notification/payment lifecycle records are missing.
- **The application/adoption constraints are incomplete.** The schema permits duplicate applications by the same person to the same pet. An adoption can point to an application for a different pet or adopter unless enforced by a transaction/trigger or a redesigned key relationship. Application status and pet status can drift apart without a transactional state-transition workflow.
- **Donations need payment lifecycle modeling.** A single required Stripe ID does not model checkout creation, webhook idempotency, refunds, failed payments, currency, or donor privacy. Treat Stripe webhooks as the payment source of truth and record unique event IDs.
- **Data and integrity safeguards need definition.** `landlord_approval DEFAULT TRUE` can imply approval that was never given; medical/behavioral fields need dated, attributed history rather than only current booleans; deletion cascades from shelters/pets/users can erase operational and financial history. Define retention, audit, and soft-delete policies before migrations.
- **Search and location need a real model.** There are no coordinates/geospatial indexes, radius-query support, temperament/medical vocabularies, or indexes for the full filter combinations. Avoid inferring precise location from a free-form address.
- **Security and operations are unspecified.** Production needs authentication/authorization, private document storage with short-lived signed URLs, upload scanning and limits, secrets handling, rate limits, backups, observability, and tested restore procedures. Never store raw card data; use Stripe-hosted/tokenized checkout.

Resolve these items in an implementation design, write migrations and authorization rules, and review them before exposing real adopter or shelter data. This preview is not a production deployment.
