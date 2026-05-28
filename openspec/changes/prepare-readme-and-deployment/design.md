## Context

The project has planning documents, an archived OpenSpec MVP capability, a working Next.js app, and Playwright E2E tests. The repository still needs a first-class README for handoff, grading, review, and deployment.

## Goals / Non-Goals

**Goals:**

- Make the project understandable from GitHub without reading every planning file.
- Provide local setup, run, build, and test commands.
- Explain current MVP behavior and known limitations.
- Provide deployment notes suitable for Vercel or another Next.js host.

**Non-Goals:**

- No actual deployment in this change.
- No app feature changes.
- No external AI API integration.
- No new CI workflow.

## Decisions

- Keep the README concise but complete enough for a reviewer to run the project.
- Reference detailed planning docs instead of duplicating every requirement.
- Include `npm` commands because the repository currently uses `package-lock.json`.
- Mention that E2E uses local Chrome when available through Playwright config.

## Risks / Trade-offs

- README can drift as the app changes → Keep sections high-level and link to planning/OpenSpec docs.
- Deployment details can vary by provider → Use provider-neutral notes plus Vercel defaults.
