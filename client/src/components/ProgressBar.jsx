export default function ProgressBar({ value = 0, label = 'Progres belajar', showValue = true }) {
  const safeValue = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <div className="progress-wrap">
      <div className="progress-label"><span>{label}</span>{showValue && <strong>{safeValue}%</strong>}</div>
      <div className="progress-track" role="progressbar" aria-valuenow={safeValue} aria-valuemin="0" aria-valuemax="100" aria-label={label}>
        <div className="progress-fill" style={{ width: `${safeValue}%` }} />
      </div>
    </div>
  );
}
