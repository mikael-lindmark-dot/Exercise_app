export type Screen =
  | 'onboarding'
  | 'today'
  | 'plan'
  | 'library'
  | 'profile'
  | 'overview'
  | 'workout'
  | 'checkin'
  | 'progress'

export type Track =
  | 'Military Calisthenics'
  | 'Chair Tai Chi'
  | 'Everyday Strength & Mobility'

export type Level = 'Foundation' | 'Building' | 'Challenge'

export type Goal = 'Build strength' | 'Improve mobility' | 'Stay consistent'

export type Exercise = {
  id: string
  name: string
  track: Track
  level: Level
  duration: string
  focus: string
  equipment: string
  cue: string
  easier: string
  harder: string
  safety: string
}

export type TrainerProfile = {
  name: string
  role: string
  initials: string
  tone: string
  track: Track
  mediaStyle: string
  representation: string
  coachingFocus: string
}

export type Adaptations = {
  time: '20 min' | '30 min' | '40 min'
  intensity: 'Gentle' | 'Steady' | 'Strong'
  kneeCare: boolean
  wristCare: boolean
  backCare: boolean
  balanceSupport: boolean
}

export type UserProfile = {
  goal: Goal
  preferredTrack: Track
  experience: Level
  weeklyDays: 3 | 4 | 5
  sessionTime: Adaptations['time']
  supportNeeds: {
    kneeCare: boolean
    wristCare: boolean
    backCare: boolean
    balanceSupport: boolean
  }
  accessibility: {
    reducedMotion: boolean
    largeText: boolean
    highContrast: boolean
  }
  completedOnboarding: boolean
}

export type SessionCheckIn = {
  effort: 1 | 2 | 3 | 4 | 5
  discomfort: 'None' | 'Mild' | 'Moderate' | 'High'
  mood: 'Calmer' | 'Energised' | 'Tired' | 'Unsure'
  note: string
  completedAt: string
}

export type CompletedSession = {
  id: string
  title: string
  completedAt: string
  durationMinutes: number
  exerciseCount: number
  tracks: Track[]
  adaptations: Adaptations
  checkIn: SessionCheckIn | null
}

export type SessionPlan = {
  id: string
  title: string
  subtitle: string
  purpose: string
  rationale: string
  level: Level
  durationMinutes: number
  equipment: string
  exercises: Exercise[]
  tracks: Track[]
}

export type WeekSessionPlan = {
  day: string
  dateLabel: string
  isTrainingDay: boolean
  adaptations: Adaptations
  session: SessionPlan
}
