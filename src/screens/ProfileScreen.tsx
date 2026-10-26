import React from 'react'
import { CheckCircle2, RotateCcw, ShieldCheck } from 'lucide-react'
import { ChoiceGroup } from '../components/ChoiceGroup'
import { adaptationsFromProfile } from '../logic/recommendations'
import type { Adaptations, Goal, Level, Screen, Track, UserProfile } from '../types/app'

const goals: Goal[] = ['Stay consistent', 'Build strength', 'Improve mobility']
const tracks: Track[] = [
  'Everyday Strength & Mobility',
  'Military Calisthenics',
  'Chair Tai Chi',
]
const levels: Level[] = ['Foundation', 'Building', 'Challenge']

export function ProfileScreen({
  profile,
  saveProfile,
  resetSetup,
  goTo,
}: {
  profile: UserProfile
  saveProfile: (profile: UserProfile, adaptations: Adaptations) => void
  resetSetup: () => void
  goTo: (screen: Screen) => void
}) {
  const [draft, setDraft] = React.useState<UserProfile>(profile)
  const hasChanges = JSON.stringify(draft) !== JSON.stringify(profile)

  const updateSupportNeed = (key: keyof UserProfile['supportNeeds']) => {
    setDraft({
      ...draft,
      supportNeeds: {
        ...draft.supportNeeds,
        [key]: !draft.supportNeeds[key],
      },
    })
  }

  const updateAccessibilityPreference = (key: keyof UserProfile['accessibility']) => {
    setDraft({
      ...draft,
      accessibility: {
        ...draft.accessibility,
        [key]: !draft.accessibility[key],
      },
    })
  }

  const save = () => {
    const completedProfile = { ...draft, completedOnboarding: true }
    saveProfile(completedProfile, adaptationsFromProfile(completedProfile))
    goTo('today')
  }

  return (
    <div className="screen profile-screen">
      <section className="profile-hero">
        <span className="pill soft">Profile settings</span>
        <h2>Tune the plan as life changes.</h2>
        <p>
          Adjust goals, lead track, schedule, and support needs without starting
          over from scratch.
        </p>
      </section>

      <section className="profile-summary card">
        <p className="eyebrow">Current setup</p>
        <h3>{draft.goal}</h3>
        <div className="tag-cloud">
          <span>{draft.preferredTrack}</span>
          <span>{draft.experience}</span>
          <span>{draft.weeklyDays} days/week</span>
          <span>{draft.sessionTime}</span>
          {draft.accessibility.largeText && <span>Large text</span>}
          {draft.accessibility.highContrast && <span>Higher contrast</span>}
          {draft.accessibility.reducedMotion && <span>Reduced motion</span>}
        </div>
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
          <h3>What feels realistic now?</h3>
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
          <h3>What should Evolve protect?</h3>
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

        <section className="card">
          <p className="eyebrow">Accessibility</p>
          <h3>Make the interface easier to use.</h3>
          <div className="toggle-grid">
            <button
              className={`toggle-chip ${draft.accessibility.largeText ? 'active' : ''}`}
              aria-pressed={draft.accessibility.largeText}
              onClick={() => updateAccessibilityPreference('largeText')}
            >
              Larger text
            </button>
            <button
              className={`toggle-chip ${draft.accessibility.highContrast ? 'active' : ''}`}
              aria-pressed={draft.accessibility.highContrast}
              onClick={() => updateAccessibilityPreference('highContrast')}
            >
              Higher contrast
            </button>
            <button
              className={`toggle-chip ${draft.accessibility.reducedMotion ? 'active' : ''}`}
              aria-pressed={draft.accessibility.reducedMotion}
              onClick={() => updateAccessibilityPreference('reducedMotion')}
            >
              Reduce motion
            </button>
          </div>
          <p className="helper-copy">
            These preferences only change presentation. They do not change exercise difficulty.
          </p>
        </section>
      </section>

      <section className="safety-note">
        <ShieldCheck size={20} />
        <p>
          Profile edits update recommendations only. They are not medical advice
          and should not replace professional guidance.
        </p>
      </section>

      <div className="sticky-action">
        <button className="secondary-button" onClick={resetSetup}>
          <RotateCcw size={18} />
          Reset setup
        </button>
        <button className="primary-button" onClick={save} disabled={!hasChanges}>
          <CheckCircle2 size={18} />
          Save changes
        </button>
      </div>
    </div>
  )
}
