import { describe, expect, it } from 'vitest'
import type { Adaptations, SessionCheckIn, UserProfile } from '../../src/types/app'
import {
  adaptationsFromCheckIn,
  adaptationsFromProfile,
  buildSessionPlan,
  buildWeekPlan,
  initialUserProfile,
} from '../../src/logic/recommendations'

const baseProfile: UserProfile = {
  ...initialUserProfile,
  completedOnboarding: true,
}

const baseAdaptations: Adaptations = adaptationsFromProfile(baseProfile)

describe('recommendations', () => {
  it('starts with accessibility preferences disabled by default', () => {
    expect(initialUserProfile.accessibility).toEqual({
      reducedMotion: false,
      largeText: false,
      highContrast: false,
    })
  })

  it('builds a named session plan with metadata and exercises', () => {
    const session = buildSessionPlan(baseAdaptations, baseProfile)

    expect(session.title).toBe('Everyday Mobility Circuit')
    expect(session.durationMinutes).toBe(30)
    expect(session.equipment.length).toBeGreaterThan(0)
    expect(session.exercises.length).toBeGreaterThan(0)
    expect(session.tracks).toContain('Everyday Strength & Mobility')
    expect(session.rationale).toContain('everyday strength & mobility')
  })

  it('filters wrist-sensitive push exercises out of a session', () => {
    const session = buildSessionPlan(
      { ...baseAdaptations, wristCare: true },
      { ...baseProfile, preferredTrack: 'Military Calisthenics' },
    )

    expect(session.exercises.every((exercise) => !exercise.name.toLowerCase().includes('push'))).toBe(true)
  })

  it('generates a full week with the requested number of training days', () => {
    const week = buildWeekPlan(baseAdaptations, { ...baseProfile, weeklyDays: 3 })

    expect(week).toHaveLength(7)
    expect(week.filter((day) => day.isTrainingDay)).toHaveLength(3)
    expect(
      week
        .filter((day) => !day.isTrainingDay)
        .every(
          (day) =>
            day.session.title.includes('Reset') ||
            day.session.title.includes('Recovery') ||
            day.session.title.includes('Check-in'),
        ),
    ).toBe(true)
  })

  it('uses feedback to reduce intensity and add support after discomfort', () => {
    const checkIn: SessionCheckIn = {
      effort: 4,
      discomfort: 'Moderate',
      mood: 'Tired',
      note: '',
      completedAt: '2026-07-20T10:00:00.000Z',
    }

    const next = adaptationsFromCheckIn({ ...baseAdaptations, intensity: 'Strong' }, checkIn)

    expect(next.intensity).toBe('Gentle')
    expect(next.kneeCare).toBe(true)
    expect(next.backCare).toBe(true)
    expect(next.balanceSupport).toBe(true)
  })

  it('retains the effective adaptations of each selected day', () => {
    const week = buildWeekPlan({ ...baseAdaptations, intensity: 'Strong', time: '20 min' }, baseProfile)
    expect(week[2].adaptations.intensity).toBe('Steady')
    expect(week[4].adaptations.time).toBe('30 min')
    for (const day of week) {
      expect(day.session.durationMinutes).toBe(Number.parseInt(day.adaptations.time, 10))
    }
  })

  it('can progress intensity when effort was low and user felt energised', () => {
    const checkIn: SessionCheckIn = {
      effort: 2,
      discomfort: 'None',
      mood: 'Energised',
      note: '',
      completedAt: '2026-07-20T10:00:00.000Z',
    }

    const next = adaptationsFromCheckIn({ ...baseAdaptations, intensity: 'Gentle' }, checkIn)

    expect(next.intensity).toBe('Steady')
  })
})
