export function ProgressMarker({ label, value }: { label: string; value: number }) {
  return (
    <div className="progress-marker">
      <div>
        <strong>{label}</strong>
        <span>{value}%</span>
      </div>
      <div className="bar">
        <span style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}
