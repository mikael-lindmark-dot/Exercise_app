import React from 'react'
import { Dumbbell, Filter, ShieldCheck, Sparkles } from 'lucide-react'
import { exercises } from '../data/exercises'
import type { Level, Track } from '../types/app'

type TrackFilter = Track | 'All tracks'
type LevelFilter = Level | 'All levels'

const trackFilters: TrackFilter[] = [
  'All tracks',
  'Military Calisthenics',
  'Chair Tai Chi',
  'Everyday Strength & Mobility',
]

const levelFilters: LevelFilter[] = ['All levels', 'Foundation', 'Building', 'Challenge']

export function LibraryScreen() {
  const [trackFilter, setTrackFilter] = React.useState<TrackFilter>('All tracks')
  const [levelFilter, setLevelFilter] = React.useState<LevelFilter>('All levels')
  const [expandedExerciseId, setExpandedExerciseId] = React.useState<string | null>(null)

  const filteredExercises = exercises.filter((exercise) => {
    const trackMatches = trackFilter === 'All tracks' || exercise.track === trackFilter
    const levelMatches = levelFilter === 'All levels' || exercise.level === levelFilter
    return trackMatches && levelMatches
  })

  return (
    <div className="screen library-screen">
      <section className="library-hero">
        <span className="pill soft">Exercise library</span>
        <h2>Explore the movement system.</h2>
        <p>
          Browse the current starter library by track and level. Each movement
          includes cues, swaps, equipment, and safety notes.
        </p>
      </section>

      <section className="card library-filters">
        <div>
          <p className="eyebrow">Filters</p>
          <h3>Find the right movement</h3>
        </div>
        <div className="filter-group" aria-label="Track filters">
          {trackFilters.map((track) => (
            <button
              className={trackFilter === track ? 'active' : ''}
              key={track}
              onClick={() => setTrackFilter(track)}
            >
              {track}
            </button>
          ))}
        </div>
        <div className="segmented" aria-label="Level filters">
          {levelFilters.map((level) => (
            <button
              className={levelFilter === level ? 'selected' : ''}
              key={level}
              onClick={() => setLevelFilter(level)}
            >
              {level.replace('All ', 'All')}
            </button>
          ))}
        </div>
      </section>

      <div className="metric-grid library-metrics">
        <article className="metric">
          <Filter size={18} />
          <span>Showing</span>
          <strong>{filteredExercises.length} moves</strong>
        </article>
        <article className="metric">
          <Sparkles size={18} />
          <span>Levels</span>
          <strong>3</strong>
        </article>
        <article className="metric">
          <Dumbbell size={18} />
          <span>Tracks</span>
          <strong>3</strong>
        </article>
      </div>

      <section className="library-list">
        {filteredExercises.map((exercise) => {
          const expanded = expandedExerciseId === exercise.id

          return (
            <article className={`library-card ${expanded ? 'expanded' : ''}`} key={exercise.id}>
              <button
                className="library-card-main"
                onClick={() => setExpandedExerciseId(expanded ? null : exercise.id)}
                aria-expanded={expanded}
              >
                <span className={`level-badge ${exercise.level.toLowerCase()}`}>
                  {exercise.level}
                </span>
                <div>
                  <h3>{exercise.name}</h3>
                  <p>{exercise.track} · {exercise.duration}</p>
                </div>
              </button>

              {expanded && (
                <div className="library-card-detail">
                  <p>{exercise.cue}</p>
                  <dl>
                    <div>
                      <dt>Focus</dt>
                      <dd>{exercise.focus}</dd>
                    </div>
                    <div>
                      <dt>Equipment</dt>
                      <dd>{exercise.equipment}</dd>
                    </div>
                    <div>
                      <dt>Easier</dt>
                      <dd>{exercise.easier}</dd>
                    </div>
                    <div>
                      <dt>Harder</dt>
                      <dd>{exercise.harder}</dd>
                    </div>
                  </dl>
                  <div className="mini-safety">
                    <ShieldCheck size={17} />
                    <span>{exercise.safety}</span>
                  </div>
                </div>
              )}
            </article>
          )
        })}
      </section>
    </div>
  )
}
