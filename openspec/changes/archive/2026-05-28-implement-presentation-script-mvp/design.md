## Context

The repository contains planning documents for a presentation script generator aimed at university students. The technical direction is a single-user, frontend-first Next.js MVP that validates the core product flow before adding authentication, backend storage, or external AI generation.

## Goals / Non-Goals

**Goals:**

- Implement a Next.js App Router baseline with `/` and `/app` routes.
- Keep the MVP centered on presentation script creation, preview, list management, filtering, status updates, and copy interaction.
- Use TypeScript domain types for scripts, tone, duration, and status.
- Use client state and localStorage for persistence.
- Keep generated output mock-based so the core workflow can be tested without external API keys.
- Keep UI responsive and accessible for basic keyboard and screen reader usage.

**Non-Goals:**

- No login, account management, payment, admin permissions, or real-time collaboration.
- No server database or production API.
- No large PPT file upload.
- No external AI API integration in this change.
- No Playwright test implementation until the later testing session.

## Decisions

- Use `features/scripts` instead of a generic `items` module because the core entity is a presentation script, not a generic task item.
  - Alternative considered: keep `items` from the template. Rejected because it weakens traceability to the product requirements.
- Use mock generation in `generator.ts`.
  - Alternative considered: connect an AI API immediately. Rejected because it introduces secrets, network dependency, and backend concerns before validating the flow.
- Use `useState`, `useMemo`, and small helper modules for MVP state.
  - Alternative considered: introduce a state management library. Rejected because the MVP has a small single-page state surface.
- Use localStorage through `storage.ts`.
  - Alternative considered: server persistence. Rejected because Session 2 and Session 3 are focused on frontend MVP delivery and comparison.
- Keep route structure minimal with `/` and `/app`.
  - Alternative considered: separate detail pages for each generated script. Rejected to control scope.

## Risks / Trade-offs

- Mock generation may not reflect real AI quality → Make `generator.ts` isolated so it can be replaced later.
- localStorage is single-device and not secure for sensitive data → Avoid storing sensitive information and document future backend migration.
- Client-only interactions can drift from future API contracts → Keep domain types explicit and align future endpoints with `PresentationScript`.
- Scope creep may add CRUD, upload, or AI features too early → Keep Must / Should / Nice priorities visible in tasks.

## Migration Plan

1. Add or refine baseline Next.js files and script feature modules.
2. Implement MVP behavior behind the existing `/app` page.
3. Verify locally with build or dev server when package tooling is available.
4. Roll back by reverting this change branch if the MVP flow becomes too broad.

## Open Questions

- Should MVP store a maximum number of scripts in localStorage?
- Are the initial tone options natural, formal, and friendly enough for the first release?
- Should delete/edit be included in Session 3 or left as Nice-to-have?
- Should filters include all of status, tone, duration, and search in the first implementation pass?
