"use client";

import type { ChapterEvent } from "@/lib/events";
import { StatusPill } from "./StatusPill";

export function EventsList({ events, monthLabels }: { events: ChapterEvent[]; monthLabels: Record<string, string> }) {
  if (events.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="font-display text-lg text-ink/50">No events match these filters.</p>
        <p className="mt-1 font-mono text-xs text-ink/30">Try clearing a filter or two.</p>
      </div>
    );
  }

  // group by year-month, undated events go last under "Undated"
  const groups = new Map<string, NormalizedEvent[]>();
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
                <EventRow key={ev.id} event={ev} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function EventRow({ event }: { event: ChapterEvent }) {
  const day = event.date
    ? new Date(event.date + "T00:00:00").toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
    : "No date";

  const content = (
    <div className="grid grid-cols-[100px_1fr_auto] items-center gap-4 rounded-lg border border-transparent px-3 py-3 transition-colors hover:border-line hover:bg-white">
      <span className="font-mono text-xs text-ink/50">{day}</span>
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="truncate font-medium text-ink">{event.name}</span>
          {event.eventType && (
            <span className="font-mono text-[11px] text-ink/40">{event.eventType}</span>
          )}
        </div>
        <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-ink/50">
          <span className="font-medium text-clay/80">{event.chapterName}</span>
          {event.location && <span>· {event.location}</span>}
        </div>
      </div>
      <StatusPill status={event.status} />
    </div>
  );

  if (event.link) {
    return (
      <a href={event.link} target="_blank" rel="noreferrer" className="block">
        {content}
      </a>
    );
  }

  return content;
}
