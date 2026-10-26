import { Camera, Clapperboard } from 'lucide-react'
import { trainerForTrack } from '../data/trainers'
import type { Track, TrainerProfile } from '../types/app'

export function CoachAvatar({
  trainer,
  size = 'normal',
}: {
  trainer: TrainerProfile
  size?: 'normal' | 'large'
}) {
  return (
    <div className={`coach-avatar ${size} ${trackClass(trainer.track)}`}>
      <span>{trainer.initials}</span>
    </div>
  )
}

export function SessionCoachCard({ tracks }: { tracks: Track[] }) {
  const leadTrainer = trainerForTrack(tracks[0])
  const supporting = tracks.slice(1).map(trainerForTrack)

  return (
    <section className="coach-card">
      <div className="coach-card-header">
        <CoachAvatar trainer={leadTrainer} />
        <div>
          <p className="eyebrow">Lead coach</p>
          <h3>{leadTrainer.name}</h3>
          <span>{leadTrainer.role}</span>
        </div>
      </div>
      <p>{leadTrainer.coachingFocus}</p>
      <div className="media-spec">
        <Clapperboard size={17} />
        <span>{leadTrainer.mediaStyle}</span>
      </div>
      {supporting.length > 0 && (
        <div className="supporting-coaches" aria-label="Supporting coaches">
          {supporting.map((trainer) => (
            <span key={trainer.name}>{trainer.initials}</span>
          ))}
        </div>
      )}
    </section>
  )
}

export function ExerciseMediaCard({ track }: { track: Track }) {
  const trainer = trainerForTrack(track)

  return (
    <section className="exercise-media-card">
      <div className="media-frame">
        <div className="media-glow" />
        <CoachAvatar trainer={trainer} size="large" />
      </div>
      <div>
        <p className="eyebrow">Media placeholder</p>
        <h3>{trainer.name} demo</h3>
        <p>{trainer.representation}</p>
      </div>
      <div className="media-spec">
        <Camera size={17} />
        <span>Future slot for video, image sequence, captions, and audio cues.</span>
      </div>
    </section>
  )
}

function trackClass(track: Track) {
  if (track === 'Military Calisthenics') return 'military'
  if (track === 'Chair Tai Chi') return 'tai-chi'
  return 'mobility'
}
