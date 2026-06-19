/**
 * Small summary pill used across the web workspace for counts and status.
 */
type MetricPillProps = {
  label: string;
  value: string;
};

export function MetricPill({ label, value }: MetricPillProps) {
  return (
    <div className="metric-pill">
      <span className="metric-label">{label}</span>
      <strong className="metric-value">{value}</strong>
    </div>
  );
}
