"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { ChapterEvent } from "@/lib/events";
import { FilterBar, type FilterValues } from "@/components/FilterBar";
import { EventsList } from "@/components/EventsList";
import { CalendarView } from "@/components/CalendarView";
import eventsData from "@/data/events.json";

const events = eventsData as ChapterEvent[];

const MONTH_FORMATTER = new Intl.DateTimeFormat(undefined, { month: "long", year: "numeric" });

const EMPTY_FILTERS: FilterValues = {
  chapter: "",
  status: "",
  eventType: "",
  month: "",
  search: "",
  openToRegion: "",
  lifelongLearningCategory: "",
  topicCategory: "",
  targetAudience: "",
};

function uniqueSorted(values: (string | null)[]): string[] {
  return Array.from(new Set(values.filter((v): v is string => !!v))).sort();
}

function splitValues(value: string | null): string[] {
  return (value ?? "").split(",").map((s) => s.trim()).filter(Boolean);
}

export default function HomePage() {
  const [filters, setFilters] = useState<FilterValues>(EMPTY_FILTERS);
  const [view, setView] = useState<"list" | "calendar">("list");

  const chapters = useMemo(() => uniqueSorted(events.map((e) => e.chapterName)), []);
  const statuses = useMemo(() => uniqueSorted(events.map((e) => e.status)), []);
  const eventTypes = useMemo(() => uniqueSorted(events.map((e) => e.eventType)), []);
  const openToRegions = useMemo(() => uniqueSorted(events.map((e) => e.openToRegion)), []);
  const lifelongLearningCategories = useMemo(
    () => uniqueSorted(events.flatMap((e) => splitValues(e.lifelongLearningCategories))),
    []
  );
  const topicCategories = useMemo(
    () => uniqueSorted(events.flatMap((e) => splitValues(e.topicCategory))),
    []
  );
  const targetAudiences = useMemo(
    () => uniqueSorted(events.flatMap((e) => splitValues(e.targetAudience))),
    []
  );

  const months = useMemo(() => {
    const keys = new Set(events.filter((e) => e.date).map((e) => e.date!.slice(0, 7)));
    return Array.from(keys).sort();
  }, []);
  const monthLabels = useMemo(() => {
    const labels: Record<string, string> = {};
    for (const key of months) {
      labels[key] = MONTH_FORMATTER.format(new Date(`${key}-01T00:00:00`));
    }
    return labels;
  }, [months]);

  const filtered = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    return events.filter((e) => {
      if (filters.chapter && e.chapterName !== filters.chapter) return false;
      if (filters.status && e.status !== filters.status) return false;
      if (filters.eventType && e.eventType !== filters.eventType) return false;
      if (filters.month && (!e.date || !e.date.startsWith(filters.month))) return false;
      if (filters.openToRegion && e.openToRegion !== filters.openToRegion) return false;
      if (filters.lifelongLearningCategory && !splitValues(e.lifelongLearningCategories).includes(filters.lifelongLearningCategory))
        return false;
      if (filters.topicCategory && !splitValues(e.topicCategory).includes(filters.topicCategory)) return false;
      if (filters.targetAudience && !splitValues(e.targetAudience).includes(filters.targetAudience)) return false;
      if (q) {
        const haystack = `${e.name} ${e.location ?? ""} ${e.description ?? ""}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [filters]);

  return (
    <main className="mx-auto max-w-5xl px-6 pb-24 pt-10">
      <header className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-gold">Chapter Events Registry</p>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-navy">
            Every chapter, one calendar.
          </h1>
        </div>
        <Link
          href="/resources"
          className="mt-1 rounded-full border border-line bg-white px-4 py-2 font-mono text-xs text-ink/60 hover:border-navy hover:text-navy transition-colors whitespace-nowrap"
        >
          view resources →
        </Link>
      </header>

      {events.length === 0 && (
        <div className="rounded-lg border border-line bg-white px-4 py-3 text-sm text-ink/60">
          No events loaded yet. Add rows to <code className="font-mono text-xs">data/events.csv</code>,
          run <code className="font-mono text-xs">npm run build:data</code>, and redeploy.
        </div>
      )}

      <FilterBar
        chapters={chapters}
        statuses={statuses}
        eventTypes={eventTypes}
        months={months}
        monthLabels={monthLabels}
        openToRegions={openToRegions}
        lifelongLearningCategories={lifelongLearningCategories}
        topicCategories={topicCategories}
        targetAudiences={targetAudiences}
        values={filters}
        resultCount={filtered.length}
        onChange={(patch) => setFilters((prev) => ({ ...prev, ...patch }))}
        onReset={() => setFilters(EMPTY_FILTERS)}
      />

      <div className="mb-4 mt-5 flex justify-end">
        <div className="inline-flex rounded-full border border-line bg-white p-0.5">
          {(["list", "calendar"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`rounded-full px-3 py-1.5 font-mono text-xs capitalize transition-colors ${
                view === v ? "bg-navy text-white" : "text-ink/50 hover:text-ink"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {view === "calendar" ? (
        <CalendarView events={filtered} />
      ) : (
        <EventsList events={filtered} monthLabels={monthLabels} />
      )}
    </main>
  );
}
