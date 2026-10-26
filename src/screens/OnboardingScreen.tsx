import React from 'react'
import { ChevronRight, ShieldCheck } from 'lucide-react'
import { ChoiceGroup } from '../components/ChoiceGroup'
import type { Goal, Level, Track, UserProfile } from '../types/app'

const goals: Goal[] = ['Stay consistent', 'Build strength', 'Improve mobility']
const tracks: Track[] = [
  'Everyday Strength & Mobility',
  'Military Calisthenics',
  'Chair Tai Chi',
]
const levels: Level[] = ['Foundation', 'Building', 'Challenge']

export function OnboardingScreen({
  profile,
  completeOnboarding,
}: {
  profile: UserProfile
  completeOnboarding: (profile: UserProfile) => void
}) {
  const [draft, setDraft] = React.useState<UserProfile>(profile)

  const updateSupportNeed = (key: keyof UserProfile['supportNeeds']) => {
    setDraft({
      ...draft,
      supportNeeds: {
        ...draft.supportNeeds,
        [key]: !draft.supportNeeds[key],
      },
    })
  }

  return (
    <div className="screen onboarding-screen">
      <section className="onboarding-hero">
        <span className="pill soft">Personal setup</span>
        <h2>Let’s shape a plan your body can actually use.</h2>
        <p>
          A few choices help Evolve balance strength, calm mobility, and recovery
          from day one.
        </p>
      </section>

      <section className="onboarding-grid">
        <ChoiceGroup
          eyebrow="Goal"
          title="What matters most right now?"
          options={goals}
          value={draft.goal}
          onChange={(goal) => setDraft({ ...draft, goal })}
        />

        <ChoiceGroup
          eyebrow="Track"
          title="Which track should lead?"
          options={tracks}
          value={draft.preferredTrack}
          onChange={(preferredTrack) => setDraft({ ...draft, preferredTrack })}
        />

        <ChoiceGroup
          eyebrow="Level"
          title="Where should we start?"
          options={levels}
          value={draft.experience}
          onChange={(experience) => setDraft({ ...draft, experience })}
        />

        <section className="card">
          <p className="eyebrow">Schedule</p>
          <h3>How much time feels realistic?</h3>
          <div className="segmented">
            {([3, 4, 5] as const).map((days) => (
              <button
                className={draft.weeklyDays === days ? 'selected' : ''}
                key={days}
                onClick={() => setDraft({ ...draft, weeklyDays: days })}
              >
                {days} days
              </button>
            ))}
          </div>
          <div className="segmented">
            {(['20 min', '30 min', '40 min'] as const).map((time) => (
              <button
                className={draft.sessionTime === time ? 'selected' : ''}
                key={time}
                onClick={() => setDraft({ ...draft, sessionTime: time })}
              >
                {time}
              </button>
            ))}
          </div>
        </section>

        <section className="card">
          <p className="eyebrow">Support</p>
          <h3>Any support we should keep in mind?</h3>
          <div className="toggle-grid">
            <button
              className={`toggle-chip ${draft.supportNeeds.kneeCare ? 'active' : ''}`}
              onClick={() => updateSupportNeed('kneeCare')}
            >
              Knee-friendly
            </button>
            <button
              className={`toggle-chip ${draft.supportNeeds.wristCare ? 'active' : ''}`}
              onClick={() => updateSupportNeed('wristCare')}
            >
              Wrist-friendly
            </button>
            <button
              className={`toggle-chip ${draft.supportNeeds.backCare ? 'active' : ''}`}
              onClick={() => updateSupportNeed('backCare')}
            >
              Back-sensitive
            </button>
            <button
              className={`toggle-chip ${draft.supportNeeds.balanceSupport ? 'active' : ''}`}
              onClick={() => updateSupportNeed('balanceSupport')}
            >
              Balance support
            </button>
          </div>
        </section>
      </section>

      <section className="safety-note">
        <ShieldCheck size={20} />
        <p>
          This setup guides exercise difficulty and alternatives. It does not
          diagnose conditions or replace medical advice.
        </p>
      </section>

      <button className="primary-button full" onClick={() => completeOnboarding(draft)}>
        Build my first week <ChevronRight size={18} />
      </button>
    </div>
  )
}
