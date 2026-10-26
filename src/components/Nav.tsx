import { BookOpen, CalendarDays, Leaf, Timer, Trophy } from 'lucide-react'
import type React from 'react'
import type { Screen } from '../types/app'

export function Nav({ screen, goTo }: { screen: Screen; goTo: (screen: Screen) => void }) {
  const items: { screen: Screen; label: string; icon: React.ReactNode }[] = [
    { screen: 'today', label: 'Today', icon: <Leaf size={19} /> },
    { screen: 'plan', label: 'Plan', icon: <CalendarDays size={19} /> },
    { screen: 'library', label: 'Library', icon: <BookOpen size={19} /> },
    { screen: 'overview', label: 'Session', icon: <Timer size={19} /> },
    { screen: 'progress', label: 'Progress', icon: <Trophy size={19} /> },
  ]

  return (
    <nav className="bottom-nav" aria-label="Primary navigation">
      {items.map((item) => (
        <button
          className={screen === item.screen ? 'active' : ''}
          key={item.screen}
          onClick={() => goTo(item.screen)}
        >
          {item.icon}
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  )
}
