import { describe, expect, it, vi } from 'vitest'
import type { CompletedSession, SessionCheckIn } from '../../src/types/app'
import {
  averageEffort,
  capabilityScores,
  currentStreakDays,
  sessionsThisWeek,
} from '../../src/logic/progress'
import { initialAdaptations } from '../../src/logic/recommendations'

const baseSession: CompletedSession = {
  id: 'session-1',
  title: 'Everyday Mobility Circuit',
  completedAt: '2026-07-20T10:00:00.000Z',
  durationMinutes: 30,
  exerciseCount: 6,
  tracks: ['Everyday Strength & Mobility'],
  adaptations: initialAdaptations,
  checkIn: {
    effort: 3,
    discomfort: 'None',
    mood: 'Calmer',
    note: '',
    completedAt: '2026-07-20T10:00:00.000Z',
  },
}

describe('progress metrics', () => {
  it('counts sessions in the current week', () => {
    vi.setSystemTime(new Date('2026-07-22T12:00:00.000Z'))

    const sessions = [
      baseSession,
      {
        ...baseSession,
        id: 'older',
        completedAt: '2026-07-12T10:00:00.000Z',
      },
    ]

    expect(sessionsThisWeek(sessions)).toHaveLength(1)

    vi.useRealTimers()
  })

  it('calculates current streak from consecutive completed days', () => {
    vi.setSystemTime(new Date('2026-07-22T12:00:00.000Z'))

    const sessions: CompletedSession[] = [
      { ...baseSession, id: 'today', completedAt: '2026-07-22T10:00:00.000Z' },
      { ...baseSession, id: 'yesterday', completedAt: '2026-07-21T10:00:00.000Z' },
      { ...baseSession, id: 'monday', completedAt: '2026-07-20T10:00:00.000Z' },
    ]

    expect(currentStreakDays(sessions)).toBe(3)

    vi.useRealTimers()
  })

  it('calculates average effort', () => {
    const sessions: CompletedSession[] = [
      baseSession,
      { ...baseSession, id: 'session-2', checkIn: { ...baseSession.checkIn as SessionCheckIn, effort: 5 } },
    ]

    expect(averageEffort(sessions)).toBe(4)
  })

  it('produces bounded capability scores', () => {
    const scores = capabilityScores([
      baseSession,
      {
        ...baseSession,
        id: 'tai-chi',
        tracks: ['Chair Tai Chi'],
        checkIn: { ...baseSession.checkIn as SessionCheckIn, mood: 'Energised' },
      },
    ])

    expect(scores.strength).toBeGreaterThan(0)
    expect(scores.balance).toBeGreaterThan(50)
    expect(scores.mobility).toBeGreaterThan(50)
    expect(scores.recovery).toBeGreaterThan(50)
  })

  it('counts workouts without feedback but excludes them from average effort', () => {
    const skipped = { ...baseSession, checkIn: null }
    expect(averageEffort([skipped])).toBeNull()
    expect(averageEffort([skipped, baseSession])).toBe(3)
    expect(capabilityScores([skipped]).strength).toBeGreaterThan(capabilityScores([]).strength)
  })

  it('groups streaks by local calendar dates across midnight in BST', () => {
    const originalTimezone = process.env.TZ
    process.env.TZ = 'Europe/London'
    vi.setSystemTime(new Date('2026-07-20T23:45:00+01:00'))
    try {
      const sessions = [
        { ...baseSession, completedAt: '2026-07-20T00:30:00+01:00' },
        { ...baseSession, completedAt: '2026-07-20T23:30:00+01:00' },
      ]
      expect(currentStreakDays(sessions)).toBe(1)
    } finally {
      if (originalTimezone === undefined) delete process.env.TZ
      else process.env.TZ = originalTimezone
      vi.useRealTimers()
    }
  })
})
