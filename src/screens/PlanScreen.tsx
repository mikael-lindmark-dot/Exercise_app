import { AdaptationPanel } from '../components/AdaptationPanel'
import type { Adaptations, UserProfile, WeekSessionPlan } from '../types/app'

export function PlanScreen({
  adaptations,
  setAdaptations,
  profile,
  weekPlan,
  selectedDayIndex,
  openPlannedSession,
}: {
  adaptations: Adaptations
  setAdaptations: (adaptations: Adaptations) => void
  profile: UserProfile
  weekPlan: WeekSessionPlan[]
  selectedDayIndex: number
  openPlannedSession: (dayIndex: number) => void
}) {
  return (
    <div className="screen stack">
      <section className="card">
        <p className="eyebrow">Adaptive week</p>
        <h2>Your calm training rhythm</h2>
        <p>
          Planned for {profile.weeklyDays} days per week, led by {profile.preferredTrack.toLowerCase()},
          with recovery woven in instead of treated like an afterthought.
        </p>
      </section>

      <section className="week-list">
        {weekPlan.map((item, index) => (
          <button
            className={`week-item ${index === selectedDayIndex ? 'active' : ''} ${item.isTrainingDay ? '' : 'recovery'}`}
            key={`${item.day}-${item.session.id}`}
            onClick={() => openPlannedSession(index)}
            aria-disabled={!item.isTrainingDay}
          >
            <span className="day-chip">{item.day}</span>
            <span>
              <strong>{item.session.title}</strong>
              <small>
                {item.dateLabel} · {item.isTrainingDay ? item.session.tracks[0] : 'Recovery'}
              </small>
            </span>
            <em>{item.isTrainingDay ? `${item.session.durationMinutes} min` : 'Reset'}</em>
          </button>
        ))}
      </section>

      <section className="card">
        <p className="eyebrow">Fast adapt</p>
        <h3>Change the week from today</h3>
        <AdaptationPanel compact adaptations={adaptations} setAdaptations={setAdaptations} />
      </section>
    </div>
  )
}
