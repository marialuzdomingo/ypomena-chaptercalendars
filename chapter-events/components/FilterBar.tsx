"use client";

type FilterBarProps = {
  chapters: string[];
  statuses: string[];
  eventTypes: string[];
  months: string[]; // "2026-01" style keys
  monthLabels: Record<string, string>;
  chapter: string;
  status: string;
  eventType: string;
  month: string;
  search: string;
  onChange: (patch: Partial<{ chapter: string; status: string; eventType: string; month: string; search: string }>) => void;
  onReset: () => void;
  resultCount: number;
};

export function FilterBar({
  chapters,
  statuses,
  eventTypes,
  months,
  monthLabels,
  chapter,
  status,
  eventType,
  month,
  search,
  onChange,
  onReset,
  resultCount,
}: FilterBarProps) {
  const hasActiveFilters = chapter || status || eventType || month || search;

  return (
    <div className="sticky top-0 z-10 -mx-6 border-b border-line bg-paper/95 px-6 py-4 backdrop-blur">
      <div className="flex flex-wrap items-end gap-3">
        <Field label="Chapter">
          <select
            value={chapter}
            onChange={(e) => onChange({ chapter: e.target.value })}
            className="select"
          >
            <option value="">All chapters</option>
            {chapters.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Status">
          <select value={status} onChange={(e) => onChange({ status: e.target.value })} className="select">
            <option value="">Any status</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Event type">
          <select
            value={eventType}
            onChange={(e) => onChange({ eventType: e.target.value })}
            className="select"
          >
            <option value="">Any type</option>
            {eventTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Month">
          <select value={month} onChange={(e) => onChange({ month: e.target.value })} className="select">
            <option value="">Any month</option>
            {months.map((m) => (
              <option key={m} value={m}>
                {monthLabels[m] ?? m}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Search">
          <input
            type="text"
            placeholder="Event name, location…"
            value={search}
            onChange={(e) => onChange({ search: e.target.value })}
            className="select min-w-[200px]"
          />
        </Field>

        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="mb-[1px] rounded-full border border-line px-3 py-2 text-xs font-mono text-ink/60 hover:border-clay hover:text-clay transition-colors"
          >
            clear filters
          </button>
        )}

        <div className="ml-auto mb-1 font-mono text-xs text-ink/40">
          {resultCount} event{resultCount === 1 ? "" : "s"}
        </div>
      </div>

      <style jsx global>{`
        .select {
          border: 1px solid #e4e1da;
          background: #fff;
          border-radius: 0.5rem;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          color: #1c1b1a;
          min-width: 140px;
        }
        .select:focus {
          outline: 2px solid #c9973b;
          outline-offset: 1px;
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="font-mono text-[11px] uppercase tracking-wide text-ink/40">{label}</span>
      {children}
    </label>
  );
}
