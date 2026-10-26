# Build Plan

## Phase 1: Repo foundation

Goal: create a working local app foundation.

Deliverables:

- Mobile-first web prototype.
- Shared design tokens.
- Exercise content seed data.
- Core routes for the five primary screens.
- Basic state management for selected plan, adaptations, and workout progress.

Suggested stack:

- React
- Vite
- TypeScript
- CSS modules or Tailwind
- Local JSON seed data for exercises and plans

## Phase 2: Clickable prototype

Goal: recreate the imported prototype in this repo.

Deliverables:

- Today screen.
- Weekly Plan screen.
- Session Overview screen.
- Active Workout screen.
- Progress screen.
- Completion/check-in state.
- Session adaptation panel.
- Trainer placeholders and inclusive visual direction.

Acceptance criteria:

- User can move between all five main screens.
- User can select session adaptations before a workout.
- Adapted duration/intensity is reflected in the session.
- User can start, pause, resume, move next/previous, and complete a workout.
- Progress screen reflects completed session state.

## Phase 3: Content system

Goal: create a structured starter library for all three tracks.

Deliverables:

- Exercise model.
- Track model.
- Difficulty model.
- Session templates.
- Safety notes.
- Easier/harder alternatives.
- Equipment requirements.
- Movement cue fields.

Starter content target:

- 3 tracks
- 3 levels per track
- 12-15 exercises per track for alpha
- 40-50 total exercises for prototype
- 132 total exercises for beta

## Phase 4: Personalisation

Goal: make the app feel adaptive.

Deliverables:

- Onboarding questions.
- Readiness check.
- Rules-based recommendation engine.
- Weekly agenda generation.
- Adaptation rules for time, intensity, discomfort, balance support, and equipment.
- Post-session feedback loop.

## Phase 5: Accessibility and safety

Goal: make accessibility and safety core product features.

Deliverables:

- Large tap targets.
- High-contrast themes.
- Captions.
- Audio-friendly guidance copy.
- Clear safety disclaimers.
- Pain/discomfort stop guidance.
- Chair stability guidance.
- Movement alternatives.

## Phase 6: Backend-ready architecture

Goal: prepare for production without overbuilding early.

Deliverables:

- User profile schema.
- Workout completion schema.
- Exercise library schema.
- Plan/session schema.
- Feedback schema.
- Future Apple Health / Health Connect integration notes.

## Phase 7: Production roadmap

Indicative 18-week roadmap:

1. Weeks 1-2: Product definition, repo foundation, prototype architecture.
2. Weeks 3-4: Five-screen prototype and design system.
3. Weeks 5-6: Exercise content model and seed library.
4. Weeks 7-8: Onboarding and recommendation rules.
5. Weeks 9-10: Workout player and session adaptation.
6. Weeks 11-12: Progress, check-ins, and persistence.
7. Weeks 13-14: Accessibility, safety, QA, and content review.
8. Weeks 15-16: Backend integration and account model.
9. Weeks 17-18: Beta polish, analytics, deployment, and app-store planning.
