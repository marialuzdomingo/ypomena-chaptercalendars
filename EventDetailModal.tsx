"use client";

import type { ChapterEvent } from "@/lib/events";
import { StatusPill } from "./StatusPill";
import { getLearningOfficer } from "@/lib/learning-officers";

function Detail({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-wide text-ink/40">{label}</p>
      <p className="mt-0.5 text-sm text-ink/80">{value}</p>
    </div>
  );
}

export function EventDetailModal({ event, onClose }: { event: ChapterEvent; onClose: () => void }) {
  const day = event.date
    ? new Date(event.date + "T00:00:00").toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "No date set";

  const learningOfficer = getLearningOfficer(event.chapterName);

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-ink/30 px-4" onClick={onClose}>
      <div
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-xl border border-line bg-paper p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-1 flex items-start justify-between gap-3">
          <h3 className="font-display text-xl font-semibold leading-snug">{event.name}</h3>
          <button onClick={onClose} className="shrink-0 font-mono text-xs text-ink/40 hover:text-ink">
            close
          </button>
        </div>
        <p className="mb-4 font-mono text-xs text-ink/40">{day}</p>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <StatusPill status={event.status} />
          <span className="font-medium text-orange/80 text-sm">{event.chapterName}</span>
        </div>

        {event.description && (
          <p className="mb-5 whitespace-pre-line text-sm leading-relaxed text-ink/80">{event.description}</p>
        )}

        <div className="grid grid-cols-2 gap-4 border-t border-line pt-4">
          <Detail label="Event type" value={event.eventType} />
          <Detail label="Location" value={event.location} />
          <Detail label="Open to region" value={event.openToRegion} />
          <Detail label="Topic category" value={event.topicCategory} />
          <Detail label="Target audience" value={event.targetAudience} />
          <Detail label="Lifelong learning" value={event.lifelongLearningCategories} />
          <Detail label="Speaker / resource" value={event.resource} />
          <Detail label="Resource status" value={event.resourceStatus} />
          {learningOfficer && (
            <div>
              <p className="font-mono text-[11px] uppercase tracking-wide text-ink/40">Learning officer</p>
              <a
                href={learningOfficer.profileUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-0.5 inline-block text-sm text-sky hover:underline"
              >
                {learningOfficer.name} →
              </a>
            </div>
          )}
        </div>

        {event.link && (
          <a
            href={event.link}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-block font-mono text-xs text-sky hover:underline"
          >
            open in Airtable →
          </a>
        )}
      </div>
    </div>
  );
}
