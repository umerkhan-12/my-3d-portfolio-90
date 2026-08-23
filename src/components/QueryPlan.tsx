/**
 * Renders a project's hard numbers as an EXPLAIN-style readout: dimmed labels,
 * bright values, aligned on a left rule.
 */
export default function QueryPlan({
  rows,
}: {
  rows: { label: string; value: string }[];
}) {
  return (
    <dl className="query-plan mt-4 space-y-1.5 border-l border-primary/30 pl-4">
      {rows.map((row) => (
        <div
          key={row.label}
          className="flex items-baseline justify-between gap-4 font-mono text-xs"
        >
          <dt className="text-muted-foreground">{row.label}</dt>
          <dd className="text-primary tabular-nums">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
