"use client";

import { useMemo, useState } from "react";
import type { ChapterEvent } from "@/lib/events";
import { FilterBar } from "@/components/FilterBar";
import { EventsList } from "@/components/EventsList";
import { CalendarView } from "@/components/CalendarView";
import eventsData from "@/data/events.json";

const events = eventsData as ChapterEvent[];

const MONTH_FORMATTER = new Intl.DateTimeFormat(undefined, { month: "long", year: "numeric" });

export default function HomePage() {
  const [chapter, setChapter] = useState("");
  const [status, setStatus] = useState("");
  const [eventType, setEventType] = useState("");
  const [month, setMonth] = useState("");
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"list" | "calendar">("list");

  const chapters = useMemo(
    () => Array.from(new Set(events.map((e) => e.chapterName))).sort(),
    []
  );
  const statuses = useMemo(
    () => Array.from(new Set(events.map((e) => e.status).filter((s): s is string => !!s))).sort(),
    []
  );
  const eventTypes = useMemo(
    () => Array.from(new Set(events.map((e) => e.eventType).filter((t): t is string => !!t))).sort(),
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
    const q = search.trim().toLowerCase();
    return events.filter((e) => {
      if (chapter && e.chapterName !== chapter) return false;
      if (status && e.status !== status) return false;
      if (eventType && e.eventType !== eventType) return false;
      if (month && (!e.date || !e.date.startsWith(month))) return false;
      if (q) {
        const haystack = `${e.name} ${e.location ?? ""} ${e.description ?? ""}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [chapter, status, eventType, month, search]);

  return (
    <main className="mx-auto max-w-5xl px-6 pb-24 pt-10">
      <header className="mb-8">
        <p className="font-mono text-xs uppercase tracking-widest text-moss">Chapter Events Registry</p>
        <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight">
          Every chapter, one calendar.
        </h1>
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
        chapter={chapter}
        status={status}
        eventType={eventType}
        month={month}
        search={search}
        resultCount={filtered.length}
        onChange={(patch) => {
          if (patch.chapter !== undefined) setChapter(patch.chapter);
          if (patch.status !== undefined) setStatus(patch.status);
          if (patch.eventType !== undefined) setEventType(patch.eventType);
          if (patch.month !== undefined) setMonth(patch.month);
          if (patch.search !== undefined) setSearch(patch.search);
        }}
        onReset={() => {
          setChapter("");
          setStatus("");
          setEventType("");
          setMonth("");
          setSearch("");
        }}
      />

      <div className="mb-4 mt-5 flex justify-end">
        <div className="inline-flex rounded-full border border-line bg-white p-0.5">
          {(["list", "calendar"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`rounded-full px-3 py-1.5 font-mono text-xs capitalize transition-colors ${
                view === v ? "bg-moss text-white" : "text-ink/50 hover:text-ink"
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
