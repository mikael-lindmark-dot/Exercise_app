import { ArrowLeft, Trophy } from 'lucide-react'
import type { Screen, UserProfile } from '../types/app'

export function Header({
  screen,
  goTo,
  profile,
}: {
  screen: Screen
  goTo: (screen: Screen) => void
  profile: UserProfile
}) {
  return (
    <header className="app-header">
      <button
        className="icon-button"
        onClick={() => goTo(screen === 'today' ? 'progress' : 'today')}
        aria-label={screen === 'today' ? 'Open progress' : 'Back to today'}
      >
        {screen === 'today' ? <Trophy size={20} /> : <ArrowLeft size={20} />}
      </button>
      <div>
        <p className="eyebrow">Evolve</p>
        <h1>{screenTitle(screen)}</h1>
      </div>
      <button className="avatar-button" onClick={() => goTo('profile')} aria-label="Open profile settings">
        {profile.preferredTrack === 'Chair Tai Chi'
          ? 'ML'
          : profile.preferredTrack === 'Military Calisthenics'
            ? 'JR'
            : 'AK'}
      </button>
    </header>
  )
}

function screenTitle(screen: Screen) {
  const titles: Record<Screen, string> = {
    onboarding: 'Setup',
    today: 'Today',
    plan: 'Weekly plan',
    library: 'Library',
    profile: 'Profile',
    overview: 'Session',
    workout: 'Workout',
    checkin: 'Check-in',
    progress: 'Progress',
  }

  return titles[screen]
}
