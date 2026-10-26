import { Activity, CalendarDays, CheckCircle2, Dumbbell } from 'lucide-react'
import { Metric } from '../components/Metric'
import { ProgressMarker } from '../components/ProgressMarker'
import { exercises } from '../data/exercises'
import { checkInInsight } from '../logic/recommendations'
import {
  averageEffort,
  capabilityScores,
  currentStreakDays,
  sessionsThisWeek,
} from '../logic/progress'
import type { CompletedSession, Exercise, Screen, SessionCheckIn } from '../types/app'

export function ProgressScreen({
  goTo,
  completed,
  progressPercent,
  sessionExercises,
  latestCheckIn,
  sessionHistory,
  resetOnboarding,
}: {
  goTo: (screen: Screen) => void
  completed: boolean
  progressPercent: number
  sessionExercises: Exercise[]
  latestCheckIn: SessionCheckIn | null
  sessionHistory: CompletedSession[]
  resetOnboarding: () => void
}) {
  const weeklySessions = sessionsThisWeek(sessionHistory)
  const streakDays = currentStreakDays(sessionHistory)
  const effortAverage = averageEffort(sessionHistory)
  const scores = capabilityScores(sessionHistory)

  return (
    <div className="screen stack">
      <section className="celebration-card">
        <CheckCircle2 size={34} />
        <p className="eyebrow">{completed ? 'Session complete' : 'Progress'}</p>
        <h2>{completed ? 'That counts. Quietly powerful.' : 'Your capability is building.'}</h2>
        <p>
          Progress here favours consistency, confidence, and movement quality —
          the useful things that tend to survive real life.
        </p>
      </section>

      <div className="metric-grid progress-metrics">
        <Metric label="This week" value={`${weeklySessions.length} sessions`} icon={<CalendarDays size={18} />} />
        <Metric label="Streak" value={`${streakDays} days`} icon={<Activity size={18} />} />
        <Metric label="Library" value={`${exercises.length} moves`} icon={<Dumbbell size={18} />} />
      </div>

      <section className="card">
        <p className="eyebrow">Capability markers</p>
        <div className="marker-list">
          <ProgressMarker label="Strength" value={scores.strength} />
          <ProgressMarker label="Balance" value={scores.balance} />
          <ProgressMarker label="Mobility" value={scores.mobility} />
          <ProgressMarker label="Calm recovery" value={scores.recovery} />
        </div>
      </section>

      <section className="card">
        <p className="eyebrow">Session history</p>
        <h3>{sessionHistory.length === 0 ? 'No saved sessions yet' : `${sessionHistory.length} completed sessions`}</h3>
        <p>
          {effortAverage
            ? `Average effort is ${effortAverage}/5 across saved workouts.`
            : `Completed workouts are saved even when you skip check-in.`}
        </p>
        {sessionHistory.length > 0 && (
          <div className="session-history-list">
            {sessionHistory.slice(0, 3).map((session) => (
              <article className="history-item" key={session.id}>
                <div>
                  <strong>{session.title}</strong>
                  <span>{formatSessionDate(session.completedAt)} · {session.durationMinutes} min</span>
                </div>
                <em>{session.checkIn ? `${session.checkIn.effort}/5 effort` : 'No check-in'}</em>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="card">
        <p className="eyebrow">Feedback loop</p>
        <h3>Tomorrow’s adjustment</h3>
        <p>{checkInInsight(latestCheckIn)}</p>
      </section>

      <section className="card">
        <p className="eyebrow">Today’s movement mix</p>
        <div className="tag-cloud">
          {[...new Set(sessionExercises.map((exercise) => exercise.track))].map((track) => (
            <span key={track}>{track}</span>
          ))}
        </div>
      </section>

      <div className="sticky-action">
        <button className="secondary-button" onClick={resetOnboarding}>
          Edit setup
        </button>
        <button className="primary-button" onClick={() => goTo('today')}>
          Return to Today
        </button>
      </div>
    </div>
  )
}

function formatSessionDate(date: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}
