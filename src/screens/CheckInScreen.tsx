import React from 'react'
import { CheckCircle2, ChevronRight, HeartPulse, ShieldCheck } from 'lucide-react'
import type { Screen, SessionCheckIn } from '../types/app'

const discomfortOptions: SessionCheckIn['discomfort'][] = ['None', 'Mild', 'Moderate', 'High']
const moodOptions: SessionCheckIn['mood'][] = ['Calmer', 'Energised', 'Tired', 'Unsure']

export function CheckInScreen({
  saveCheckIn,
  goTo,
}: {
  saveCheckIn: (checkIn: SessionCheckIn) => void
  goTo: (screen: Screen) => void
}) {
  const [effort, setEffort] = React.useState<SessionCheckIn['effort']>(3)
  const [discomfort, setDiscomfort] = React.useState<SessionCheckIn['discomfort']>('None')
  const [mood, setMood] = React.useState<SessionCheckIn['mood']>('Calmer')
  const [note, setNote] = React.useState('')

  const submit = () => {
    saveCheckIn({
      effort,
      discomfort,
      mood,
      note,
      completedAt: new Date().toISOString(),
    })
    goTo('progress')
  }

  return (
    <div className="screen checkin-screen">
      <section className="celebration-card">
        <CheckCircle2 size={34} />
        <p className="eyebrow">Session check-in</p>
        <h2>How did that land?</h2>
        <p>
          Your answer tunes the next recommendation. Tiny bit of honesty,
          surprisingly useful machine.
        </p>
      </section>

      <section className="card">
        <p className="eyebrow">Effort</p>
        <h3>How hard did it feel?</h3>
        <div className="effort-scale" aria-label="Effort rating">
          {([1, 2, 3, 4, 5] as const).map((rating) => (
            <button
              className={effort === rating ? 'selected' : ''}
              key={rating}
              onClick={() => setEffort(rating)}
            >
              {rating}
            </button>
          ))}
        </div>
        <p className="helper-copy">1 is very easy. 5 means “let’s not do that again tomorrow.”</p>
      </section>

      <section className="card">
        <p className="eyebrow">Discomfort</p>
        <h3>Any pain or discomfort?</h3>
        <div className="toggle-grid">
          {discomfortOptions.map((option) => (
            <button
              className={`toggle-chip ${discomfort === option ? 'active' : ''}`}
              key={option}
              onClick={() => setDiscomfort(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </section>

      <section className="card">
        <p className="eyebrow">Afterward</p>
        <h3>How do you feel now?</h3>
        <div className="toggle-grid">
          {moodOptions.map((option) => (
            <button
              className={`toggle-chip ${mood === option ? 'active' : ''}`}
              key={option}
              onClick={() => setMood(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </section>

      <section className="card">
        <p className="eyebrow">Optional note</p>
        <label className="note-label">
          <span>Anything to remember?</span>
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Example: wrists felt tired, balance felt better today..."
          />
        </label>
      </section>

      <section className="safety-note">
        <ShieldCheck size={20} />
        <p>
          If discomfort was moderate or high, the next plan will automatically
          bias gentler and add support.
        </p>
      </section>

      <div className="sticky-action">
        <button className="secondary-button" onClick={() => goTo('progress')}>
          Skip for now
        </button>
        <button className="primary-button" onClick={submit}>
          Save check-in <ChevronRight size={18} />
        </button>
      </div>

      <section className="swap-card">
        <HeartPulse size={20} />
        <div>
          <strong>Feedback loop</strong>
          <p>Effort, discomfort, and mood will shape tomorrow’s readiness default.</p>
        </div>
      </section>
    </div>
  )
}
