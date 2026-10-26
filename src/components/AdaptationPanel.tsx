import { adaptationCopy } from '../logic/recommendations'
import type { Adaptations } from '../types/app'

export function AdaptationPanel({
  adaptations,
  setAdaptations,
  compact = false,
}: {
  adaptations: Adaptations
  setAdaptations: (adaptations: Adaptations) => void
  compact?: boolean
}) {
  const update = <K extends keyof Adaptations>(key: K, value: Adaptations[K]) => {
    setAdaptations({ ...adaptations, [key]: value })
  }

  return (
    <div className={`adaptation-panel ${compact ? 'compact' : ''}`}>
      <div className="segmented" aria-label={adaptationCopy.time}>
        {(['20 min', '30 min', '40 min'] as const).map((time) => (
          <button
            className={adaptations.time === time ? 'selected' : ''}
            key={time}
            onClick={() => update('time', time)}
          >
            {time}
          </button>
        ))}
      </div>
      <div className="segmented" aria-label={adaptationCopy.intensity}>
        {(['Gentle', 'Steady', 'Strong'] as const).map((intensity) => (
          <button
            className={adaptations.intensity === intensity ? 'selected' : ''}
            key={intensity}
            onClick={() => update('intensity', intensity)}
          >
            {intensity}
          </button>
        ))}
      </div>
      <div className="toggle-grid">
        {(['kneeCare', 'wristCare', 'backCare', 'balanceSupport'] as const).map((key) => (
          <button
            className={`toggle-chip ${adaptations[key] ? 'active' : ''}`}
            key={key}
            onClick={() => update(key, !adaptations[key])}
          >
            {adaptationCopy[key]}
          </button>
        ))}
      </div>
    </div>
  )
}
