import { exercises } from '../data/exercises'
import type {
  Adaptations,
  Exercise,
  Level,
  SessionCheckIn,
  SessionPlan,
  Track,
  UserProfile,
  WeekSessionPlan,
} from '../types/app'

export const initialAdaptations: Adaptations = {
  time: '30 min',
  intensity: 'Steady',
  kneeCare: false,
  wristCare: false,
  backCare: false,
  balanceSupport: true,
}

export const initialUserProfile: UserProfile = {
  goal: 'Stay consistent',
  preferredTrack: 'Everyday Strength & Mobility',
  experience: 'Foundation',
  weeklyDays: 4,
  sessionTime: '30 min',
  supportNeeds: {
    kneeCare: false,
    wristCare: false,
    backCare: false,
    balanceSupport: true,
  },
  accessibility: {
    reducedMotion: false,
    largeText: false,
    highContrast: false,
  },
  completedOnboarding: false,
}

export const adaptationCopy: Record<keyof Adaptations, string> = {
  time: 'Available time',
  intensity: 'Today’s intensity',
  kneeCare: 'Knee-friendly swaps',
  wristCare: 'Wrist-friendly swaps',
  backCare: 'Back-sensitive cues',
  balanceSupport: 'Balance support',
}

export function adaptationsFromProfile(profile: UserProfile): Adaptations {
  const intensity: Adaptations['intensity'] =
    profile.experience === 'Foundation'
      ? 'Gentle'
      : profile.experience === 'Challenge'
        ? 'Strong'
        : 'Steady'

  return {
    time: profile.sessionTime,
    intensity,
    ...profile.supportNeeds,
  }
}

export function buildSession(adaptations: Adaptations, profile: UserProfile) {
  return buildSessionExercises(adaptations, profile)
}

export function buildSessionPlan(adaptations: Adaptations, profile: UserProfile): SessionPlan {
  const sessionExercises = buildSessionExercises(adaptations, profile)
  const level = levelFromIntensity(adaptations.intensity)
  const tracks = [...new Set(sessionExercises.map((exercise) => exercise.track))]
  const durationMinutes = Number.parseInt(adaptations.time, 10)

  return {
    id: `${slug(profile.preferredTrack)}-${slug(adaptations.intensity)}-${durationMinutes}`,
    title: sessionTitle(profile.preferredTrack, adaptations),
    subtitle: sessionSubtitle(profile, adaptations),
    purpose: sessionPurpose(profile, adaptations),
    rationale: sessionRationale(profile, adaptations, tracks),
    level,
    durationMinutes,
    equipment: equipmentSummary(sessionExercises),
    exercises: sessionExercises,
    tracks,
  }
}

export function buildWeekPlan(adaptations: Adaptations, profile: UserProfile): WeekSessionPlan[] {
  const today = new Date()
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const start = startOfWeek(today)
  const trainingIndexes = trainingDayIndexes(profile.weeklyDays)

  return dayNames.map((day, index) => {
    const date = new Date(start)
    date.setDate(start.getDate() + index)
    const isTrainingDay = trainingIndexes.includes(index)
    const dayAdaptations = adaptationsForWeekday(adaptations, index, isTrainingDay)
    const dayProfile = profileForWeekday(profile, index, isTrainingDay)
    const session = buildSessionPlan(dayAdaptations, dayProfile)

    return {
      day,
      dateLabel: new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(date),
      isTrainingDay,
      adaptations: dayAdaptations,
      session: isTrainingDay
        ? session
        : {
            ...session,
            title: recoveryTitle(index),
            subtitle: `${dayAdaptations.time} · Recovery · ${profile.goal}`,
            purpose: 'A lighter day to keep the habit alive without adding load.',
            rationale: 'Recovery days preserve momentum, mobility, and confidence between training sessions.',
          },
    }
  })
}

function buildSessionExercises(adaptations: Adaptations, profile: UserProfile) {
  const level = levelFromIntensity(adaptations.intensity)
  const targetCount = adaptations.time === '20 min' ? 5 : adaptations.time === '40 min' ? 8 : 6

  const preferred = safeExercises(exercises, adaptations, level, true)
    .filter((exercise) => exercise.track === profile.preferredTrack)
    .slice(0, adaptations.intensity === 'Strong' ? 4 : 3)

  const supporting = orderTracks(profile.preferredTrack).flatMap((track) =>
    safeExercises(exercises, adaptations, level, false)
      .filter((exercise) => exercise.track === track)
      .slice(0, 2),
  )

  const session = uniqueExercises([...preferred, ...supporting])

  if (adaptations.balanceSupport && !session.some((exercise) => exercise.id === 'tc-4')) {
    const balanceExercise = exercises.find((exercise) => exercise.id === 'tc-4')
    if (balanceExercise) session.splice(Math.min(2, session.length), 0, balanceExercise)
  }

  return session.slice(0, targetCount)
}

function adaptationsForWeekday(
  adaptations: Adaptations,
  index: number,
  isTrainingDay: boolean,
): Adaptations {
  if (!isTrainingDay) {
    return {
      ...adaptations,
      time: '20 min',
      intensity: 'Gentle',
      balanceSupport: true,
    }
  }

  if (index === 4 && adaptations.intensity !== 'Gentle') {
    return {
      ...adaptations,
      intensity: adaptations.intensity === 'Strong' ? 'Strong' : 'Steady',
      time: adaptations.time === '20 min' ? '30 min' : adaptations.time,
    }
  }

  if (index === 2) {
    return {
      ...adaptations,
      intensity: adaptations.intensity === 'Strong' ? 'Steady' : adaptations.intensity,
    }
  }

  return adaptations
}

function profileForWeekday(
  profile: UserProfile,
  index: number,
  isTrainingDay: boolean,
): UserProfile {
  const rotatingTracks = orderTracks(profile.preferredTrack)

  return {
    ...profile,
    preferredTrack: isTrainingDay ? rotatingTracks[index % rotatingTracks.length] : 'Chair Tai Chi',
  }
}

function safeExercises(
  sourceExercises: Exercise[],
  adaptations: Adaptations,
  level: Level,
  allowExactChallenge: boolean,
) {
  return sourceExercises.filter((exercise) => {
    if (adaptations.wristCare && exercise.name.toLowerCase().includes('push')) return false
    if (adaptations.kneeCare && ['Reverse Lunge', 'Full Burpee', 'Jump Squat', 'Lateral Lunge'].includes(exercise.name)) return false
    if (adaptations.backCare && ['Full Burpee', 'Loaded Carry', 'Goblet Squat'].includes(exercise.name)) return false
    if (exercise.level === 'Foundation') return true
    if (allowExactChallenge) return exercise.level === level
    return exercise.level === level && level !== 'Challenge'
  })
}

function uniqueExercises(sourceExercises: Exercise[]) {
  const seen = new Set<string>()
  return sourceExercises.filter((exercise) => {
    if (seen.has(exercise.id)) return false
    seen.add(exercise.id)
    return true
  })
}

function levelFromIntensity(intensity: Adaptations['intensity']): Level {
  if (intensity === 'Gentle') return 'Foundation'
  if (intensity === 'Strong') return 'Challenge'
  return 'Building'
}

function sessionTitle(preferredTrack: Track, adaptations: Adaptations) {
  if (preferredTrack === 'Military Calisthenics') {
    return adaptations.intensity === 'Strong' ? 'Calisthenics Builder' : 'Military Foundation'
  }

  if (preferredTrack === 'Chair Tai Chi') {
    return adaptations.intensity === 'Strong' ? 'Supported Balance Flow' : 'Chair Tai Chi Reset'
  }

  return adaptations.intensity === 'Strong' ? 'Everyday Strength Builder' : 'Everyday Mobility Circuit'
}

function sessionSubtitle(profile: UserProfile, adaptations: Adaptations) {
  return `${adaptations.time} · ${adaptations.intensity} · ${profile.goal}`
}

function sessionPurpose(profile: UserProfile, adaptations: Adaptations) {
  if (adaptations.intensity === 'Gentle') {
    return `A lower-pressure session to build consistency while respecting support needs.`
  }

  if (profile.goal === 'Build strength') {
    return `Strength-focused work with enough mobility to keep the next session approachable.`
  }

  if (profile.goal === 'Improve mobility') {
    return `Mobility-led training with practical strength so daily movement feels easier.`
  }

  return `A balanced session designed to preserve momentum without making tomorrow harder.`
}

function sessionRationale(profile: UserProfile, adaptations: Adaptations, tracks: Track[]) {
  const supports = activeAdaptations(adaptations).join(', ')
  return `Built around ${profile.preferredTrack.toLowerCase()} with support from ${tracks.length} tracks and adjusted for ${supports}.`
}

function trainingDayIndexes(weeklyDays: UserProfile['weeklyDays']) {
  if (weeklyDays === 3) return [0, 2, 4]
  if (weeklyDays === 4) return [0, 2, 4, 5]
  return [0, 1, 2, 4, 5]
}

function startOfWeek(date: Date) {
  const copy = new Date(date)
  const day = copy.getDay()
  const diff = copy.getDate() - day + (day === 0 ? -6 : 1)
  copy.setDate(diff)
  copy.setHours(0, 0, 0, 0)
  return copy
}

function recoveryTitle(index: number) {
  if (index === 1) return 'Seated Flow Reset'
  if (index === 3) return 'Balance Recovery'
  if (index === 6) return 'Quiet Mobility Check-in'
  return 'Recovery Flow'
}

function equipmentSummary(sessionExercises: Exercise[]) {
  const equipment = [...new Set(sessionExercises.map((exercise) => exercise.equipment))]
    .filter((item) => item !== 'None')

  if (equipment.length === 0) return 'None'
  if (equipment.length > 3) return `${equipment.slice(0, 3).join(', ')} + more`
  return equipment.join(', ')
}

function slug(value: string | number) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export function activeAdaptations(adaptations: Adaptations) {
  const active: string[] = [adaptations.intensity.toLowerCase(), adaptations.time]
  if (adaptations.kneeCare) active.push('knee-friendly swaps')
  if (adaptations.wristCare) active.push('wrist-friendly swaps')
  if (adaptations.backCare) active.push('back-sensitive cues')
  if (adaptations.balanceSupport) active.push('balance support')
  return active
}

export function adaptationsFromCheckIn(
  adaptations: Adaptations,
  checkIn: SessionCheckIn,
): Adaptations {
  if (checkIn.discomfort === 'High' || checkIn.discomfort === 'Moderate') {
    return {
      ...adaptations,
      intensity: 'Gentle',
      kneeCare: true,
      backCare: true,
      balanceSupport: true,
    }
  }

  if (checkIn.effort >= 5 || checkIn.mood === 'Tired') {
    return {
      ...adaptations,
      intensity: adaptations.intensity === 'Strong' ? 'Steady' : 'Gentle',
    }
  }

  if (checkIn.effort <= 2 && checkIn.mood === 'Energised' && adaptations.intensity !== 'Strong') {
    return {
      ...adaptations,
      intensity: adaptations.intensity === 'Gentle' ? 'Steady' : 'Strong',
    }
  }

  return adaptations
}

export function checkInInsight(checkIn: SessionCheckIn | null) {
  if (!checkIn) {
    return 'Complete a session check-in to tune tomorrow’s recommendation.'
  }

  if (checkIn.discomfort === 'High' || checkIn.discomfort === 'Moderate') {
    return 'Your next plan will bias toward gentler work and extra support.'
  }

  if (checkIn.effort >= 5 || checkIn.mood === 'Tired') {
    return 'Your next plan will protect recovery and reduce intensity.'
  }

  if (checkIn.effort <= 2 && checkIn.mood === 'Energised') {
    return 'You had capacity left, so tomorrow can progress slightly if you want.'
  }

  return 'Your next plan will keep a steady rhythm and preserve momentum.'
}

function orderTracks(preferredTrack: Track): Track[] {
  const tracks: Track[] = [
    'Military Calisthenics',
    'Chair Tai Chi',
    'Everyday Strength & Mobility',
  ]

  return [preferredTrack, ...tracks.filter((track) => track !== preferredTrack)]
}
