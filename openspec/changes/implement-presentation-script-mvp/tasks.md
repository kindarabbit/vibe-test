## 1. Baseline Routes And Structure

- [x] 1.1 Confirm Next.js project files, `/`, and `/app` routes exist.
- [x] 1.2 Confirm shared layout, global styles, Tailwind config, and TypeScript config exist.
- [x] 1.3 Confirm `features/scripts` module contains types, mock data, storage, generator, and component folders.

## 2. Script Generation Flow

- [x] 2.1 Implement controlled title and source text inputs in `ScriptForm`.
- [x] 2.2 Implement tone selection for natural, formal, and friendly options.
- [x] 2.3 Implement duration selection for 5, 10, and 15 minute options.
- [x] 2.4 Validate required title and source text before generation.
- [x] 2.5 Generate a mock `PresentationScript` from valid form values.
- [x] 2.6 Show the generated or selected script in `ScriptPreview`.

## 3. Script Management Flow

- [x] 3.1 Store generated scripts in app state.
- [x] 3.2 Render generated scripts in `ScriptList` and `ScriptCard`.
- [x] 3.3 Implement status updates among draft, review, and done.
- [x] 3.4 Implement status filtering and no-results empty state.
- [x] 3.5 Implement copy-to-clipboard behavior and confirmation feedback.
- [x] 3.6 Persist and load scripts through localStorage helpers.

## 4. UX And Accessibility

- [x] 4.1 Keep the landing page CTA connected to `/app`.
- [x] 4.2 Ensure inputs have labels and buttons have descriptive text.
- [x] 4.3 Ensure status is shown with text, not color alone.
- [x] 4.4 Check mobile layout for major overflow or hidden primary actions.

## 5. Verification

- [x] 5.1 Run the most relevant available local verification command.
- [x] 5.2 Manually verify `/` and `/app` render.
- [x] 5.3 Confirm no login, payment, DB, upload, real-time collaboration, or external AI API was added.
