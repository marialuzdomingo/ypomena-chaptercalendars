"use client";

import { useMemo, useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import type { ChapterEvent } from "@/lib/events";
import { StatusPill } from "./StatusPill";

const STATUS_DOT: Record<string, string> = {
  confirmed: "bg-moss",
  tentative: "bg-gold",
  cancelled: "bg-clay",
};

function dotColor(status: string | null) {
  if (!status) return "bg-ink/25";
  return STATUS_DOT[status.trim().toLowerCase()] ?? "bg-ink/40";
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MAX_VISIBLE_PER_DAY = 3;

export function CalendarView({ events }: { events: ChapterEvent[] }) {
  const [cursor, setCursor] = useState(() => startOfMonth(new Date()));
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, ChapterEvent[]>();
    for (const ev of events) {
      if (!ev.date) continue;
      const key = ev.date.slice(0, 10);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(ev);
    }
    for (const list of map.values()) {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }
    return map;
  }, [events]);

  const undatedCount = useMemo(() => events.filter((e) => !e.date).length, [events]);

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(cursor));
    const end = endOfWeek(endOfMonth(cursor));
    return eachDayOfInterval({ start, end });
  }, [cursor]);

  const selectedKey = selectedDay ? format(selectedDay, "yyyy-MM-dd") : null;
  const selectedEvents = selectedKey ? eventsByDay.get(selectedKey) ?? [] : [];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCursor((c) => subMonths(c, 1))}
            className="rounded-full border border-line px-3 py-1.5 text-sm text-ink/60 hover:border-moss hover:text-moss transition-colors"
            aria-label="Previous month"
          >
            ←
          </button>
          <h2 className="min-w-[160px] text-center font-display text-lg font-semibold">
            {format(cursor, "MMMM yyyy")}
          </h2>
          <button
            onClick={() => setCursor((c) => addMonths(c, 1))}
            className="rounded-full border border-line px-3 py-1.5 text-sm text-ink/60 hover:border-moss hover:text-moss transition-colors"
            aria-label="Next month"
          >
            →
          </button>
        </div>
        <button
          onClick={() => setCursor(startOfMonth(new Date()))}
          className="rounded-full border border-line px-3 py-1.5 font-mono text-xs text-ink/50 hover:border-moss hover:text-moss transition-colors"
        >
          today
        </button>
      </div>

      <div className="grid grid-cols-7 gap-px overflow-hidden rounded-lg border border-line bg-line">
        {WEEKDAYS.map((d) => (
          <div key={d} className="bg-white px-2 py-2 text-center font-mono text-[11px] uppercase tracking-wide text-ink/40">
            {d}
          </div>
        ))}

        {days.map((day) => {
          const key = format(day, "yyyy-MM-dd");
          const dayEvents = eventsByDay.get(key) ?? [];
          const inMonth = isSameMonth(day, cursor);
          const isToday = isSameDay(day, new Date());
          const visible = dayEvents.slice(0, MAX_VISIBLE_PER_DAY);
          const overflow = dayEvents.length - visible.length;

          return (
            <button
              key={key}
              onClick={() => dayEvents.length > 0 && setSelectedDay(day)}
              className={`min-h-[104px] bg-white p-2 text-left align-top transition-colors ${
                inMonth ? "" : "bg-paper/60"
              } ${dayEvents.length > 0 ? "cursor-pointer hover:bg-gold/5" : "cursor-default"}`}
            >
              <span
                className={`inline-flex h-6 w-6 items-center justify-center rounded-full font-mono text-xs ${
                  isToday ? "bg-moss text-white" : inMonth ? "text-ink/70" : "text-ink/30"
                }`}
              >
                {format(day, "d")}
              </span>
              <div className="mt-1.5 space-y-1">
                {visible.map((ev) => (
                  <div key={ev.id} className="flex items-center gap-1.5 truncate">
                    <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${dotColor(ev.status)}`} />
                    <span className="truncate text-[11px] text-ink/70">{ev.name}</span>
                  </div>
                ))}
                {overflow > 0 && (
                  <div className="font-mono text-[10px] text-ink/40">+{overflow} more</div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {undatedCount > 0 && (
        <p className="mt-3 font-mono text-xs text-ink/40">
          {undatedCount} filtered event{undatedCount === 1 ? "" : "s"} have no date and aren't shown on the calendar.
        </p>
      )}

      {selectedDay && (
        <DayPanel day={selectedDay} events={selectedEvents} onClose={() => setSelectedDay(null)} />
      )}
    </div>
  );
}

function DayPanel({ day, events, onClose }: { day: Date; events: ChapterEvent[]; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-ink/30 px-4" onClick={onClose}>
      <div
        className="max-h-[80vh] w-full max-w-md overflow-y-auto rounded-xl border border-line bg-white p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold">{format(day, "EEEE, MMMM d")}</h3>
          <button onClick={onClose} className="font-mono text-xs text-ink/40 hover:text-ink">
            close
          </button>
        </div>
        <div className="space-y-3">
          {events.map((ev) => (
            <div key={ev.id} className="rounded-lg border border-line p-3">
              <div className="flex items-start justify-between gap-2">
                <span className="font-medium text-ink">{ev.name}</span>
                <StatusPill status={ev.status} />
              </div>
              <div className="mt-1 text-xs text-ink/50">
                <span className="font-medium text-clay/80">{ev.chapterName}</span>
                {ev.eventType && <span> · {ev.eventType}</span>}
                {ev.location && <span> · {ev.location}</span>}
              </div>
              {ev.description && <p className="mt-2 text-sm text-ink/70">{ev.description}</p>}
              {ev.link && (
                <a
                  href={ev.link}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-block font-mono text-xs text-moss hover:underline"
                >
                  open in Airtable →
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
