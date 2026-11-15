import type { Metric } from "@/lib/types";

export default function MetricList({
  metrics,
  max = 2,
}: {
  metrics?: Metric[];
  max?: number;
}) {
  if (!metrics || metrics.length === 0) return null;

  return (
    <ul className="m-0 flex list-none flex-wrap gap-x-[1.25rem] gap-y-[0.25rem] p-0">
      {metrics.slice(0, max).map((metric, i) => (
        <li
          key={`${metric.label}-${i}`}
          className="flex items-baseline gap-[0.375rem] text-[0.8125rem] leading-snug"
        >
          <strong className="font-bold text-[var(--accent-primary)]">
            {metric.value}
          </strong>
          <span className="text-[var(--text-secondary)]">{metric.label}</span>
        </li>
      ))}
    </ul>
  );
}
