# Replit Agent Instructions

This repository contains the Evolve Exercise App: a mobile and iPad-first adaptive exercise prototype built with React, Vite, and TypeScript.

## Project intent

Build a calm, inclusive exercise app that gives users a personalised weekly training agenda rather than a generic video library.

The app has three training tracks:

- Military Calisthenics
- Chair Tai Chi
- Everyday Strength & Mobility

The design direction is “Calm, inclusive agenda.” Preserve the warm, accessible, editorial feel. Avoid aggressive gym-app styling, dark tactical aesthetics, calorie obsession, or competitive leaderboard patterns unless explicitly requested.

## Current architecture

- `src/App.tsx` contains top-level state, screen selection, and flow orchestration.
- `src/screens/` contains screen-level UI for onboarding, today, plan, library, profile, overview, workout, check-in, and progress.
- `src/components/` contains reusable UI pieces such as navigation, metric cards, choice groups, and adaptation controls.
- `src/data/exercises.ts` contains seed exercise content.
- `src/data/trainers.ts` contains coach/media metadata placeholders mapped by track.
- Weekly agendas are generated in `src/logic/recommendations.ts` via `buildWeekPlan()`.
- `src/logic/recommendations.ts` contains onboarding-to-adaptation mapping plus `SessionPlan` generation for named workouts.
- `src/logic/progress.ts` contains local progress/session-history calculations.
- `src/logic/persistence.ts` contains localStorage-backed React hooks.
- `src/logic/storage.ts` handles unavailable browser storage with an explicit warning and in-memory fallback.
- `src/types/app.ts` contains shared app types.
- `src/styles.css` contains the full visual system and responsive layout.
- `public/` contains static assets.
- `PROJECT_BRIEF.md`, `BUILD_PLAN.md`, and `CONTENT_RESEARCH.md` provide product context.

This is currently a frontend-only prototype. State is stored in `localStorage`.

Session history is local-only and capped in persistence. Save completed sessions at Finish with `checkIn: null`; optional feedback updates that same record. Use each selected day's effective `adaptations` in its history snapshot. When a backend is added, migrate completed sessions and check-ins into durable user-scoped storage.

Recommendations should use `buildSessionPlan()` when UI needs session title, rationale, equipment, duration, and exercises together. Use `buildWeekPlan()` for the full weekly agenda. `buildSession()` remains as a compatibility wrapper for callers that only need exercises.

The selected weekly training day is persisted with `evolve-selected-day-index`; overview, workout, check-in, and session history should use the selected `WeekSessionPlan.session`.

The header avatar opens Profile Settings. Profile changes should update the stored `UserProfile`, regenerate adaptations from profile defaults, reset selected day/workout progress, and keep historical completed sessions intact.

Profile-level accessibility preferences live on `UserProfile.accessibility` and are applied as classes on `src/App.tsx`'s app shell. Keep larger text, higher contrast, and reduced motion as presentation preferences only; accessibility-only saves must preserve training adaptations, selected day and workout state.

Coach/media UI uses `src/components/CoachMedia.tsx`. Until real media assets exist, keep placeholders explicit: include coach identity, representation notes, media style, and the future slot for video/image/captions/audio.

## Replit run commands

Development:

```bash
npm install
npm run dev -- --host 0.0.0.0 --port 3000
```

Production build check:

```bash
npm run build
```

Full local verification:

```bash
npm run verify
```

Preview production build:

```bash
npm run preview -- --host 0.0.0.0 --port 3000
```

The `.replit` file is configured to run the Vite dev server on port `3000`.

## Development priorities

When extending the app, work in this order:

1. Preserve the core journey:
   - Today
   - Weekly Plan
   - Exercise Library
   - Profile Settings
   - Session Overview
   - Active Workout
   - Session Check-in
   - Progress
2. Add onboarding assessment.
3. Expand exercise content safely across all three tracks.
4. Improve persistence and prepare backend-ready data models.
5. Add real trainer/media assets when available.
6. Add accessibility QA and responsive testing.
7. Add account/auth/backend integration only when explicitly requested.

## Mobile and iPad-first requirements

Design and test for:

- Small mobile screens around 390px wide.
- Modern large phones.
- iPad/tablet layouts from roughly 760px wide upward.

Keep:

- Large tap targets.
- Bottom navigation.
- Generous spacing.
- Readable type.
- High contrast.
- One dominant action per screen.
- Avoid desktop-first dense dashboards.

## Design rules

Use the existing tokens in `src/styles.css`:

- Forest green for primary actions.
- Terracotta for accents and supportive information.
- Soft cream/sage backgrounds.
- Editorial serif headings.
- Readable sans-serif body text.

Avoid introducing a second unrelated design system.

## Safety and health constraints

This app is not a medical product. Do not add medical claims.

Exercise content should use cautious, plain-language safety copy. Any production exercise programme, contraindication guidance, injury advice, or older-adult programming should be reviewed by qualified exercise and clinical professionals before release.

Do not imply that the app can diagnose, treat, or rehabilitate conditions.

Post-session check-in feedback may adjust future difficulty, but it should remain framed as training preference/readiness guidance, not medical advice.

## Code style expectations

- Use TypeScript.
- Keep components readable and small as the app grows.
- Prefer clear names over clever abstractions.
- `npm run lint` runs ESLint with React Hooks checks and zero warnings allowed. TypeScript correctness is enforced by `npm run build`.
- Run `npm run build` before considering work complete.
- Run `npm run verify` before considering feature work complete when practical.
- If adding routes, data modules, or backend integration, update this file and the README.

## Suggested next refactor

The app already has screen, component, data, logic, and type modules. The next useful refactor is to introduce richer domain modules when backend work begins:

```text
src/
  domain/
    plans.ts
    sessions.ts
    checkIns.ts
    progression.ts
  services/
    storage.ts
    analytics.ts
```

Do this refactor only when it helps the active task; do not refactor for its own sake.
