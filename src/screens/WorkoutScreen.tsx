import { Leaf, Pause, Play, RotateCcw, Timer } from 'lucide-react'
import { ExerciseMediaCard } from '../components/CoachMedia'
import { trainerInitialsForTrack } from '../data/trainers'
import type { Adaptations, Exercise, Screen } from '../types/app'

export function WorkoutScreen({
  goTo,
  currentExercise,
  exerciseIndex,
  totalExercises,
  isPlaying,
  setIsPlaying,
  setExerciseIndex,
  nextExercise,
  adaptations,
  progressPercent,
}: {
  goTo: (screen: Screen) => void
  currentExercise: Exercise
  exerciseIndex: number
  totalExercises: number
  isPlaying: boolean
  setIsPlaying: (playing: boolean) => void
  setExerciseIndex: (index: number) => void
  nextExercise: () => void
  adaptations: Adaptations
  progressPercent: number
}) {
  return (
    <div className="screen workout-screen">
      <section className="coach-stage">
        <div className="progress-track">
          <span style={{ width: `${progressPercent}%` }} />
        </div>
        <div className="coach-portrait">
          <div className="coach-glow" />
          <span>{trainerInitialsForTrack(currentExercise.track)}</span>
        </div>
        <p className="pill soft">{currentExercise.track}</p>
        <h2>{currentExercise.name}</h2>
        <p>{currentExercise.cue}</p>
      </section>

      <ExerciseMediaCard track={currentExercise.track} />

      <section className="workout-details">
        <div className="timer-card">
          <Timer size={22} />
          <strong>{currentExercise.duration}</strong>
          <span>Move {exerciseIndex + 1} of {totalExercises}</span>
        </div>
        <div className="caption-card">
          <p className="eyebrow">Captions</p>
          <p>{currentExercise.safety}</p>
        </div>
      </section>

      <section className="swap-card">
        <Leaf size={20} />
        <div>
          <strong>Easier option</strong>
          <p>
            {adaptations.wristCare || adaptations.kneeCare || adaptations.balanceSupport
              ? currentExercise.easier
              : `Available any time: ${currentExercise.easier}`}
          </p>
        </div>
      </section>

      <div className="workout-controls">
        <button
          className="icon-button large"
          onClick={() => setExerciseIndex(Math.max(0, exerciseIndex - 1))}
          aria-label="Previous exercise"
        >
          <RotateCcw size={22} />
        </button>
        <button className="play-button" onClick={() => setIsPlaying(!isPlaying)} aria-label={isPlaying ? 'Pause' : 'Play'}>
          {isPlaying ? <Pause size={28} /> : <Play size={28} />}
        </button>
        <button className="primary-button" onClick={nextExercise}>
          {exerciseIndex >= totalExercises - 1 ? 'Finish' : 'Next'}
        </button>
      </div>

      <button className="text-button" onClick={() => goTo('overview')}>
        Back to session overview
      </button>
    </div>
  )
}
