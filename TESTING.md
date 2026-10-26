# Testing Guide

This project currently has three automated verification layers:

```bash
npm run verify
```

`npm run verify` runs linting, unit tests, and the production build in sequence.

## What is covered

### Lint

```bash
npm run lint
```

Checks `src` and `tests` with ESLint, React Hooks rules and zero warnings allowed. TypeScript correctness is handled by the production build.

### Unit tests

```bash
npm test
```

Vitest covers:

- session plan generation
- weekly plan generation
- safety-related exercise filtering
- check-in driven adaptation changes
- progress metrics such as weekly sessions, streak, average effort, and capability scores

Unit tests live in:

```text
tests/logic/
```

### Production build

```bash
npm run build
```

Runs TypeScript project build and Vite production bundling.

## Manual QA still required

Before sharing a prototype build, manually test:

1. Onboarding → Today
2. Weekly Plan → select a training day → Session Overview
3. Workout → Check-in → Progress
4. Library filters and expandable cards
5. Profile edits → regenerated plan
6. Refresh persistence for onboarding, selected day, check-in, accessibility preferences, and session history
7. Profile Settings accessibility preferences:
   - Larger text
   - Higher contrast
   - Reduced motion
8. Mobile width around 390px
9. iPad/tablet width around 760px+
10. Replit preview on port `3000`

## Current smoke status

### SDLC baseline — 26 October 2026

Local verification on macOS with Node 25.6.1:

- ESLint with zero warnings, 15 Vitest tests and TypeScript/Vite production build pass.
- `npm audit --audit-level=high`: zero vulnerabilities following compatible dependency updates.
- Independent read-only code review identified six issues, then accepted the fixes for prototype publication.
- Chromium browser checks at 390 × 844 and 820 × 1180 covered onboarding, weekly selection, workout completion, skip/save feedback, refresh persistence, library filtering and expansion, and accessibility-only profile edits.
- Regression checks confirm skipped feedback keeps completion; submitted feedback updates the same record; history retains the selected day's effective adaptations; moderate discomfort reduces the next recommendation; larger text increases root text from 16px to 19.2px without resetting training state.
- Simulated storage quota failures keep the tab usable and display the persistence warning.
- No horizontal document overflow at either checked viewport. These are browser viewport checks, not physical iPhone/iPad or Safari verification.

Review fixes also cover local-calendar streaks and safe storage reads/writes. GitHub CI repeats lint, tests, build and dependency audit. It does not deploy.

Before any production release, complete Safari/physical-device testing, assistive-technology QA and professional exercise-content review. Media and countdown playback remain prototype placeholders. Local history is limited to 50 sessions; no cloud backup exists. Storage fallback is in-memory, not a durable atomic database transaction.

Recovery: GitHub's original baseline is `7c6c8e54c77ade54bf35d8672c66e8df171c0267` (README only). Revert a later app commit through a reviewed Git revert if required. There are no server/database migrations in this baseline; avoid clearing users' browser storage. Publishing source to GitHub is separate from hosting or production release.

### Earlier smoke check

Last checked on 2026-07-20:

- `npm run verify` passes.
- Vite dev mode responds on port `3000`.
- Production preview responds on port `3000`.
- Browser smoke verified:
  - Onboarding loads and enters the app.
  - Today shows recommendation, adaptation controls, metrics, and primary action.
  - Weekly Plan shows selectable training days and disabled recovery days.
  - Selecting a training day routes to the correct Session Overview.
  - Workout advances through all exercises and reaches Finish.
  - Check-in saves effort, discomfort, and mood.
  - Progress updates with completed session history.
  - Refresh preserves completed session data through `localStorage`.

## Next automated test to add

Add a Playwright smoke test for the main user journey:

```text
Onboarding → Today → Weekly Plan → Select day → Session Overview → Workout → Check-in → Progress
```

Add accessibility checks for focus order, tap target size, contrast, and text scaling.
