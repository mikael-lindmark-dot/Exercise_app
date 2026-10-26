import { ChevronRight } from 'lucide-react'

export function ChoiceGroup<T extends string>({
  eyebrow,
  title,
  options,
  value,
  onChange,
}: {
  eyebrow: string
  title: string
  options: readonly T[]
  value: T
  onChange: (value: T) => void
}) {
  return (
    <section className="card">
      <p className="eyebrow">{eyebrow}</p>
      <h3>{title}</h3>
      <div className="choice-list">
        {options.map((option) => (
          <button
            className={`choice-card ${value === option ? 'selected' : ''}`}
            key={option}
            onClick={() => onChange(option)}
          >
            <span>{option}</span>
            <ChevronRight size={17} />
          </button>
        ))}
      </div>
    </section>
  )
}
