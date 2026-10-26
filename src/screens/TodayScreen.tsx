import { Activity, ChevronRight, Clock3, HeartPulse } from 'lucide-react'
import { AdaptationPanel } from '../components/AdaptationPanel'
import { CoachAvatar } from '../components/CoachMedia'
import { Metric } from '../components/Metric'
import { trainerProfiles } from '../data/trainers'
import type { Adaptations, Screen, SessionPlan } from '../types/app'

export function TodayScreen({
  adaptations,
  setAdaptations,
  goTo,
  sessionPlan,
  completed,
}: {
  adaptations: Adaptations
  setAdaptations: (adaptations: Adaptations) => void
  goTo: (screen: Screen) => void
  sessionPlan: SessionPlan
  completed: boolean
}) {
  return (
    <div className="screen stack">
      <section className="hero-card">
        <div className="hero-copy">
          <span className="pill soft">Today’s recommendation</span>
          <h2>{sessionPlan.title}</h2>
          <p>
            {sessionPlan.purpose}
          </p>
        </div>
        <div className="trainer-cluster" aria-label="Diverse trainer team">
          {trainerProfiles.map((trainer) => (
            <CoachAvatar trainer={trainer} key={trainer.name} />
          ))}
        </div>
      </section>

      <section className="readiness-card">
        <div>
          <p className="eyebrow">Readiness check</p>
          <h3>How should we shape this session?</h3>
        </div>
        <AdaptationPanel adaptations={adaptations} setAdaptations={setAdaptations} />
      </section>

      <div className="metric-grid">
        <Metric label="Duration" value={`${sessionPlan.durationMinutes} min`} icon={<Clock3 size={18} />} />
        <Metric label="Exercises" value={`${sessionPlan.exercises.length}`} icon={<Activity size={18} />} />
        <Metric label="Intensity" value={adaptations.intensity} icon={<HeartPulse size={18} />} />
      </div>

      <section className="card action-card">
        <div>
          <p className="eyebrow">Up next</p>
          <h3>{completed ? 'Nice work. Want another look?' : 'Review the plan before starting'}</h3>
          <p>
            {sessionPlan.subtitle}. See the movement list, safety notes, and why today’s mix was selected.
          </p>
        </div>
        <button className="primary-button" onClick={() => goTo('overview')}>
          View session <ChevronRight size={18} />
        </button>
      </section>
    </div>
  )
}
