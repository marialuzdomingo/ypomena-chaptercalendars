"use client";

import { useState } from "react";
import type { ChapterEvent } from "@/lib/events";
import { StatusPill } from "./StatusPill";
import { EventDetailModal } from "./EventDetailModal";

export function EventsList({ events, monthLabels }: { events: ChapterEvent[]; monthLabels: Record<string, string> }) {
  const [selected, setSelected] = useState<ChapterEvent | null>(null);

  if (events.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="font-display text-lg text-ink/50">No events match these filters.</p>
        <p className="mt-1 font-mono text-xs text-ink/30">Try clearing a filter or two.</p>
      </div>
    );
  }

  // group by year-month, undated events go last under "Undated"
  const groups = new Map<string, ChapterEvent[]>();
  for (const ev of events) {
    const key = ev.date ? ev.date.slice(0, 7) : "undated";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(ev);
  }

  const sortedKeys = Array.from(groups.keys()).sort((a, b) => {
    if (a === "undated") return 1;
    if (b === "undated") return -1;
    return a.localeCompare(b);
  });

  return (
    <div className="divide-y divide-line">
      {sortedKeys.map((key) => {
        const groupEvents = groups.get(key)!.sort((a, b) => (a.date ?? "").localeCompare(b.date ?? ""));
        return (
          <div key={key} className="py-6">
            <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-wide text-ink/50">
              {key === "undated" ? "Undated" : monthLabels[key] ?? key}
              <span className="ml-2 font-mono text-xs font-normal text-ink/30">({groupEvents.length})</span>
            </h2>
            <div className="grid gap-2">
              {groupEvents.map((ev) => (
                <EventRow key={ev.id} event={ev} onClick={() => setSelected(ev)} />
              ))}
            </div>
          </div>
        );
      })}

      {selected && <EventDetailModal event={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function EventRow({ event, onClick }: { event: ChapterEvent; onClick: () => void }) {
  const fullDay = event.date
    ? new Date(event.date + "T00:00:00").toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
    : "No date";
  const shortDay = event.date
    ? new Date(event.date + "T00:00:00").toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      })
    : "—";

  return (
    <button
      onClick={onClick}
      className="grid grid-cols-[44px_1fr_auto] items-start gap-2 rounded-lg border border-transparent px-2 py-3 text-left transition-colors hover:border-line hover:bg-paper sm:grid-cols-[100px_1fr_auto] sm:items-center sm:gap-4 sm:px-3"
    >
      <span className="pt-0.5 font-mono text-[11px] leading-tight text-ink/50 sm:pt-0 sm:text-xs">
        <span className="sm:hidden">{shortDay}</span>
        <span className="hidden sm:inline">{fullDay}</span>
      </span>
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="font-medium text-ink sm:truncate">{event.name}</span>
          {event.eventType && (
            <span className="font-mono text-[11px] text-ink/40">{event.eventType}</span>
          )}
        </div>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-ink/50">
          <span className="font-medium text-orange/80">{event.chapterName}</span>
          {event.location && <span>· {event.location}</span>}
        </div>
      </div>
      <div className="pt-0.5 sm:pt-0">
        <StatusPill status={event.status} />
      </div>
    </button>
  );
}
