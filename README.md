# Evolve Exercise App

Evolve is an adaptive exercise app concept focused on personalised weekly training for a broad range of users. The product direction comes from the imported ChatGPT planning conversation for “Exercise App Development.”

The app combines three training tracks:

- Military Calisthenics: strength, stamina, discipline, and bodyweight progression.
- Chair Tai Chi: seated movement, balance, mobility, breathing, and calm.
- Everyday Strength & Mobility: functional movement that bridges fitness, recovery, and daily resilience.

The intended design direction is “Calm, inclusive agenda”: accessible, editorial, warm, and capability-led rather than aggressive or calorie-focused.

## Core user journey

The first clickable prototype should cover these primary screens:

1. Today
2. Weekly Plan
3. Exercise Library
4. Profile Settings
5. Session Overview
6. Active Workout
7. Session Check-in
8. Progress

Session adaptation should work across the flow, including adjustments for:

- Available time
- Intensity
- Knee discomfort
- Wrist discomfort
- Back sensitivity
- Balance support

## Product principles

- Personalised agenda, not just a workout video library.
- One dominant action per screen.
- Large accessible controls, captions, and clear alternatives.
- Capability-led progress: consistency, strength, balance, and mobility.
- Inclusive trainer representation across age, gender, body type, and ethnicity.
- Safety-first recommendations with plain-language guidance.

## Important production note

Exercise programming, demonstrations, contraindications, and safety copy should be reviewed by qualified exercise and clinical professionals before production release.

## Repo contents

- [PROJECT_BRIEF.md](./PROJECT_BRIEF.md): imported conversation context and product direction.
- [BUILD_PLAN.md](./BUILD_PLAN.md): detailed build-out plan.
- [CONTENT_RESEARCH.md](./CONTENT_RESEARCH.md): starter content model and exercise examples.
- [AGENTS.md](./AGENTS.md): Replit/Codex agent instructions for safely extending the project.
- [TESTING.md](./TESTING.md): automated and manual QA guidance.
- [src/data](./src/data): seed exercises, trainer profiles, and weekly plan content.
- [src/logic](./src/logic): recommendation and local persistence logic.
- [src/components](./src/components): reusable UI components.
- [src/screens](./src/screens): screen-level mobile/iPad pages.
- [src/types](./src/types): shared TypeScript types.

## Current prototype status

The app currently includes:

- Mobile/iPad-first onboarding assessment.
- Rules-based personalised session generation.
- Named session plans with title, subtitle, purpose, rationale, equipment, duration, tracks, and exercises.
- Generated weekly agenda that varies training and recovery days based on the user’s schedule.
- Selectable training days in the Weekly Plan; tapping a day opens that day’s generated session.
- Today, Weekly Plan, Exercise Library, Profile Settings, Session Overview, Active Workout, Session Check-in, and Progress screens.
- Exercise Library filters by track and difficulty level, with cues, swaps, equipment, and safety notes.
- Editable profile settings for goal, lead track, experience level, schedule, and support needs.
- Profile-level accessibility preferences for larger text, higher contrast, and reduced motion.
- Coach/media placeholders mapped by track, preparing the UI for future trainer video, images, captions, and audio cues.
- Session adaptations for time, intensity, knee, wrist, back, and balance support.
- Feedback loop that uses effort, discomfort, and mood to tune the next default recommendation.
- Local session history with weekly count, streak, average effort, recent sessions, and capability markers.
- 36 starter exercises across the three training tracks.
- Local persistence using `localStorage`.

## Running on Replit

This project is configured for Replit with `.replit`.

Development command:

```bash
npm install
npm run dev -- --host 0.0.0.0 --port 3000
```

Build check:

```bash
npm run build
```

Full verification:

```bash
npm run verify
```

Individual checks:

```bash
npm run lint
npm test
npm run build
```

`npm run lint` runs ESLint (including React Hooks checks) with zero warnings allowed. TypeScript correctness is enforced by `npm run build`. GitHub Actions repeats verification on pushes to `main` and pull requests; it does not deploy the application.

Use Node.js 22 LTS or newer supported by Vite. Install reproducibly with `npm ci` when `package-lock.json` is present.

Completed workouts are recorded at Finish, even when optional feedback is skipped. Accessibility-only profile edits preserve training choices. If browser storage is blocked or full, the app warns that changes are kept only in the current tab.

This is a frontend prototype: coach media, timed playback, accounts, cloud sync and clinically reviewed programming remain future work. Workout duration is a plan allowance; the current player advances manually. Capability percentages are illustrative prototype markers, not measured fitness assessments.

Production preview:

```bash
npm run preview -- --host 0.0.0.0 --port 3000
```

Replit agents should read [AGENTS.md](./AGENTS.md) before making changes.
