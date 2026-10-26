import { Dumbbell, Play, ShieldCheck, Sparkles } from 'lucide-react'
import { SessionCoachCard } from '../components/CoachMedia'
import { Metric } from '../components/Metric'
import { activeAdaptations } from '../logic/recommendations'
import type { Adaptations, Screen, SessionPlan } from '../types/app'

export function OverviewScreen({
  goTo,
  startWorkout,
  adaptations,
  sessionPlan,
}: {
  goTo: (screen: Screen) => void
  startWorkout: () => void
  adaptations: Adaptations
  sessionPlan: SessionPlan
}) {
  return (
    <div className="screen stack">
      <section className="card session-summary">
        <span className="pill">Personalised</span>
        <h2>{sessionPlan.title}</h2>
        <p>
          {sessionPlan.subtitle} with support for{' '}
          {activeAdaptations(adaptations).join(', ') || 'your normal routine'}.
        </p>
        <div className="summary-row">
          <Metric label="Level" value={sessionPlan.level} icon={<Sparkles size={18} />} />
          <Metric label="Equipment" value={sessionPlan.equipment} icon={<Dumbbell size={18} />} />
        </div>
      </section>

      <section className="card">
        <p className="eyebrow">Why this session</p>
        <h3>Built from your setup</h3>
        <p>{sessionPlan.rationale}</p>
      </section>

      <SessionCoachCard tracks={sessionPlan.tracks} />

      <section className="exercise-list">
        {sessionPlan.exercises.map((exercise, index) => (
          <article className="exercise-card" key={exercise.id}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <div>
              <h3>{exercise.name}</h3>
              <p>{exercise.focus} · {exercise.duration}</p>
              <small>{exercise.cue}</small>
            </div>
          </article>
        ))}
      </section>

      <section className="safety-note">
        <ShieldCheck size={20} />
        <p>
          Stop if you feel sharp pain, dizziness, chest pain, or unusual shortness
          of breath. Choose the easier variation whenever your body votes for it.
        </p>
      </section>

      <div className="sticky-action">
        <button className="secondary-button" onClick={() => goTo('plan')}>
          Adjust plan
        </button>
        <button className="primary-button" onClick={startWorkout}>
          Start workout <Play size={18} />
        </button>
      </div>
    </div>
  )
}
