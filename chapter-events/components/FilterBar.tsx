"use client";

import { useState } from "react";

export type FilterValues = {
  chapter: string;
  status: string;
  eventType: string;
  month: string;
  search: string;
  openToRegion: string;
  lifelongLearningCategory: string;
  topicCategory: string;
  targetAudience: string;
};

type FilterBarProps = {
  chapters: string[];
  statuses: string[];
  eventTypes: string[];
  months: string[]; // "2026-01" style keys
  monthLabels: Record<string, string>;
  openToRegions: string[];
  lifelongLearningCategories: string[];
  topicCategories: string[];
  targetAudiences: string[];
  values: FilterValues;
  onChange: (patch: Partial<FilterValues>) => void;
  onReset: () => void;
  resultCount: number;
};

export function FilterBar({
  chapters,
  statuses,
  eventTypes,
  months,
  monthLabels,
  openToRegions,
  lifelongLearningCategories,
  topicCategories,
  targetAudiences,
  values,
  onChange,
  onReset,
  resultCount,
}: FilterBarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeCount = Object.values(values).filter((v) => v !== "").length;
  const hasActiveFilters = activeCount > 0;

  return (
    <div className="sticky top-0 z-10 -mx-6 border-b border-line bg-paper/95 px-6 py-3 backdrop-blur sm:py-4">
      {/* Compact toggle row — mobile only */}
      <div className="flex items-center justify-between sm:hidden">
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="flex items-center gap-2 rounded-full border border-line px-4 py-2 font-mono text-xs text-ink/70"
        >
          Filters
          {activeCount > 0 && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] font-semibold text-navy">
              {activeCount}
            </span>
          )}
          <span className="text-ink/40">{mobileOpen ? "▲" : "▼"}</span>
        </button>
        <div className="font-mono text-xs text-ink/40">
          {resultCount} event{resultCount === 1 ? "" : "s"}
        </div>
      </div>

      {/* Filter fields — hidden by default on mobile until toggled, always shown on sm+ */}
      <div className={`${mobileOpen ? "mt-3 flex" : "hidden"} flex-col gap-3 sm:mt-0 sm:flex sm:flex-row sm:flex-wrap sm:items-end`}>
        <Field label="Chapter">
          <select value={values.chapter} onChange={(e) => onChange({ chapter: e.target.value })} className="select">
            <option value="">All chapters</option>
            {chapters.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Status">
          <select value={values.status} onChange={(e) => onChange({ status: e.target.value })} className="select">
            <option value="">Any status</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Event type">
          <select value={values.eventType} onChange={(e) => onChange({ eventType: e.target.value })} className="select">
            <option value="">Any type</option>
            {eventTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Month">
          <select value={values.month} onChange={(e) => onChange({ month: e.target.value })} className="select">
            <option value="">Any month</option>
            {months.map((m) => (
              <option key={m} value={m}>
                {monthLabels[m] ?? m}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Open to region">
          <select
            value={values.openToRegion}
            onChange={(e) => onChange({ openToRegion: e.target.value })}
            className="select"
          >
            <option value="">Any</option>
            {openToRegions.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Lifelong learning">
          <select
            value={values.lifelongLearningCategory}
            onChange={(e) => onChange({ lifelongLearningCategory: e.target.value })}
            className="select"
          >
            <option value="">Any category</option>
            {lifelongLearningCategories.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Topic category">
          <select
            value={values.topicCategory}
            onChange={(e) => onChange({ topicCategory: e.target.value })}
            className="select"
          >
            <option value="">Any topic</option>
            {topicCategories.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Target audience">
          <select
            value={values.targetAudience}
            onChange={(e) => onChange({ targetAudience: e.target.value })}
            className="select"
          >
            <option value="">Anyone</option>
            {targetAudiences.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Search">
          <input
            type="text"
            placeholder="Event name, location…"
            value={values.search}
            onChange={(e) => onChange({ search: e.target.value })}
            className="select min-w-[200px]"
          />
        </Field>

        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="mb-[1px] rounded-full border border-line px-3 py-2 text-xs font-mono text-ink/60 hover:border-orange hover:text-orange transition-colors"
          >
            clear filters
          </button>
        )}

        {/* Result count — desktop only, mobile shows it in the compact toggle row instead */}
        <div className="hidden font-mono text-xs text-ink/40 sm:ml-auto sm:mb-1 sm:block">
          {resultCount} event{resultCount === 1 ? "" : "s"}
        </div>
      </div>

      <style jsx global>{`
        .select {
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: #0b2a52;
          border-radius: 0.5rem;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          color: #f2f5f9;
          min-width: 140px;
        }
        .select::placeholder {
          color: rgba(242, 245, 249, 0.4);
        }
        .select:focus {
          outline: 2px solid #d69d23;
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
