import type { CompletedSession, Track } from '../types/app'

export function sessionsThisWeek(history: CompletedSession[]) {
  const start = startOfWeek(new Date())
  return history.filter((session) => new Date(session.completedAt) >= start)
}

export function currentStreakDays(history: CompletedSession[]) {
  const days = new Set(history.map((session) => dayKey(new Date(session.completedAt))))
  let streak = 0
  const cursor = new Date()

  while (days.has(dayKey(cursor))) {
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }

  return streak
}

export function averageEffort(history: CompletedSession[]) {
  const ratings = history.flatMap((session) => session.checkIn ? [session.checkIn.effort] : [])
  if (ratings.length === 0) return null
  return Math.round((ratings.reduce((sum, effort) => sum + effort, 0) / ratings.length) * 10) / 10
}

export function capabilityScores(history: CompletedSession[]) {
  const completedCount = history.length
  const recent = history.slice(0, 6)
  const calmSessions = recent.filter((session) =>
    session.checkIn && ['Calmer', 'Energised'].includes(session.checkIn.mood),
  ).length
  const discomfortSessions = recent.filter((session) =>
    session.checkIn && ['Moderate', 'High'].includes(session.checkIn.discomfort),
  ).length

  return {
    strength: clampScore(52 + completedCount * 4),
    balance: clampScore(50 + countTrack(history, 'Chair Tai Chi') * 5),
    mobility: clampScore(54 + countTrack(history, 'Everyday Strength & Mobility') * 4),
    recovery: clampScore(58 + calmSessions * 5 - discomfortSessions * 6),
  }
}

function countTrack(history: CompletedSession[], track: Track) {
  return history.filter((session) => session.tracks.includes(track)).length
}

function startOfWeek(date: Date) {
  const copy = new Date(date)
  const day = copy.getDay()
  const diff = copy.getDate() - day + (day === 0 ? -6 : 1)
  copy.setDate(diff)
  copy.setHours(0, 0, 0, 0)
  return copy
}

function dayKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
}

function clampScore(value: number) {
  return Math.max(8, Math.min(96, value))
}
