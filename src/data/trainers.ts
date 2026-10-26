import type { TrainerProfile } from '../types/app'

export const trainerProfiles: TrainerProfile[] = [
  {
    name: 'Amara',
    role: 'Mobility coach',
    initials: 'AK',
    tone: 'Grounded, precise, reassuring',
    track: 'Everyday Strength & Mobility',
    mediaStyle: 'Warm studio, chair and light resistance nearby',
    representation: 'Black woman, mid-40s, calm athletic presence',
    coachingFocus: 'Functional strength, posture, and practical daily movement',
  },
  {
    name: 'Jonas',
    role: 'Calisthenics coach',
    initials: 'JR',
    tone: 'Disciplined without drill-sergeant theatrics',
    track: 'Military Calisthenics',
    mediaStyle: 'Soft natural light, mat-based bodyweight demonstrations',
    representation: 'Latino man, early-30s, approachable military-fitness coach',
    coachingFocus: 'Bodyweight strength, pacing, and form under fatigue',
  },
  {
    name: 'Mei',
    role: 'Tai Chi guide',
    initials: 'ML',
    tone: 'Soft-spoken, spacious, steady',
    track: 'Chair Tai Chi',
    mediaStyle: 'Quiet bright room, stable chair, slow close-up guidance',
    representation: 'East Asian woman, late-60s, gentle senior movement guide',
    coachingFocus: 'Breath, balance confidence, seated flow, and calm transitions',
  },
]

export function trainerForTrack(track: TrainerProfile['track']) {
  return trainerProfiles.find((trainer) => trainer.track === track) ?? trainerProfiles[0]
}

export function trainerInitialsForTrack(track: TrainerProfile['track']) {
  return trainerForTrack(track).initials
}
