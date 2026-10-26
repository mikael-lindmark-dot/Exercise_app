import React from 'react'
import type { Adaptations, CompletedSession, Screen, SessionCheckIn, UserProfile } from '../types/app'
import { initialAdaptations, initialUserProfile } from './recommendations'
import { hasStorageFailure, readStored, writeStored } from './storage'

export function useStorageWarning() {
  const [failed, setFailed] = React.useState(hasStorageFailure)
  React.useEffect(() => {
    const warn = () => setFailed(true)
    window.addEventListener('evolve-storage-error', warn)
    return () => window.removeEventListener('evolve-storage-error', warn)
  }, [])
  return failed
}

const screens: Screen[] = [
  'onboarding',
  'today',
  'plan',
  'library',
  'profile',
  'overview',
  'workout',
  'checkin',
  'progress',
]

export function usePersistedScreen(): [Screen, (screen: Screen) => void] {
  const [value, setValue] = React.useState<Screen>(() => {
    const stored = readStored('evolve-screen')
    return screens.includes(stored as Screen) ? (stored as Screen) : 'onboarding'
  })

  const update = (screen: Screen) => {
    writeStored('evolve-screen', screen)
    setValue(screen)
  }

  return [value, update]
}

export function usePersistedAdaptations(): [Adaptations, (adaptations: Adaptations) => void] {
  const [value, setValue] = React.useState<Adaptations>(() => {
    const stored = readStored('evolve-adaptations')
    if (!stored) return initialAdaptations

    try {
      return { ...initialAdaptations, ...JSON.parse(stored) }
    } catch {
      return initialAdaptations
    }
  })

  const update = (adaptations: Adaptations) => {
    writeStored('evolve-adaptations', JSON.stringify(adaptations))
    setValue(adaptations)
  }

  return [value, update]
}

export function usePersistedProfile(): [UserProfile, (profile: UserProfile) => void] {
  const [value, setValue] = React.useState<UserProfile>(() => {
    const stored = readStored('evolve-profile')
    if (!stored) return initialUserProfile

    try {
      const parsed = JSON.parse(stored) as Partial<UserProfile>
      return {
        ...initialUserProfile,
        ...parsed,
        supportNeeds: {
          ...initialUserProfile.supportNeeds,
          ...parsed.supportNeeds,
        },
        accessibility: {
          ...initialUserProfile.accessibility,
          ...parsed.accessibility,
        },
      }
    } catch {
      return initialUserProfile
    }
  })

  const update = (profile: UserProfile) => {
    writeStored('evolve-profile', JSON.stringify(profile))
    setValue(profile)
  }

  return [value, update]
}

export function usePersistedNumber(key: string, fallback: number): [number, (value: number) => void] {
  const [value, setValue] = React.useState(() => {
    const parsed = Number(readStored(key) ?? fallback)
    return Number.isInteger(parsed) && parsed >= 0 ? parsed : fallback
  })
  const update = (next: number) => {
    writeStored(key, String(next))
    setValue(next)
  }
  return [value, update]
}

export function usePersistedBoolean(key: string, fallback: boolean): [boolean, (value: boolean) => void] {
  const [value, setValue] = React.useState(() => {
    const stored = readStored(key)
    return stored === null ? fallback : stored === 'true'
  })
  const update = (next: boolean) => {
    writeStored(key, String(next))
    setValue(next)
  }
  return [value, update]
}

export function usePersistedCheckIn(): [
  SessionCheckIn | null,
  (checkIn: SessionCheckIn | null) => void,
] {
  const [value, setValue] = React.useState<SessionCheckIn | null>(() => {
    const stored = readStored('evolve-latest-check-in')
    if (!stored) return null

    try {
      return JSON.parse(stored) as SessionCheckIn
    } catch {
      return null
    }
  })

  const update = (checkIn: SessionCheckIn | null) => {
    if (checkIn) {
      writeStored('evolve-latest-check-in', JSON.stringify(checkIn))
    } else {
      writeStored('evolve-latest-check-in', null)
    }
    setValue(checkIn)
  }

  return [value, update]
}

export function usePersistedSessionHistory(): [
  CompletedSession[],
  (sessions: CompletedSession[]) => void,
] {
  const [value, setValue] = React.useState<CompletedSession[]>(() => {
    const stored = readStored('evolve-session-history')
    if (!stored) return []

    try {
      const parsed = JSON.parse(stored) as CompletedSession[]
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  })

  const update = (sessions: CompletedSession[]) => {
    const bounded = sessions.slice(0, 50)
    writeStored('evolve-session-history', JSON.stringify(bounded))
    setValue(bounded)
  }

  return [value, update]
}
