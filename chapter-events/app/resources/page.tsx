"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { ChapterEvent } from "@/lib/events";
import eventsData from "@/data/events.json";

const events = eventsData as ChapterEvent[];

const RESOURCE_STATUS_STYLES: Record<string, string> = {
  confirmed: "bg-moss/10 text-moss border-moss/30",
  "under negotiation": "bg-gold/10 text-gold border-gold/40",
  pending: "bg-gold/10 text-gold border-gold/40",
  wishlist: "bg-ink/5 text-ink/50 border-ink/15",
};

function ResourceStatusPill({ status }: { status: string | null }) {
  if (!status) {
    return (
      <span className="inline-flex items-center rounded-full border border-line px-2 py-0.5 text-xs font-mono text-ink/40">
        no status
      </span>
    );
  }
  const style = RESOURCE_STATUS_STYLES[status.trim().toLowerCase()] ?? "bg-ink/5 text-ink/60 border-ink/15";
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-mono ${style}`}>
      {status}
    </span>
  );
}

function uniqueSorted(values: (string | null)[]): string[] {
  return Array.from(new Set(values.filter((v): v is string => !!v))).sort();
}

export default function ResourcesPage() {
  const [chapter, setChapter] = useState("");
  const [resourceStatus, setResourceStatus] = useState("");
  const [topicCategory, setTopicCategory] = useState("");
  const [search, setSearch] = useState("");

  const rows = useMemo(
    () =>
      events
        .filter((e) => e.resource) // only rows with an actual speaker/resource named
        .map((e) => ({
          id: e.id,
          resource: e.resource as string,
          resourceStatus: e.resourceStatus,
          topicCategory: e.topicCategory,
          chapterName: e.chapterName,
          eventName: e.name,
        })),
    []
  );

  const chapters = useMemo(() => uniqueSorted(rows.map((r) => r.chapterName)), [rows]);
  const statuses = useMemo(() => uniqueSorted(rows.map((r) => r.resourceStatus)), [rows]);
  const topics = useMemo(
    () => uniqueSorted(rows.flatMap((r) => (r.topicCategory ?? "").split(",").map((s) => s.trim()))),
    [rows]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (chapter && r.chapterName !== chapter) return false;
      if (resourceStatus && r.resourceStatus !== resourceStatus) return false;
      if (
        topicCategory &&
        !(r.topicCategory ?? "").split(",").map((s) => s.trim()).includes(topicCategory)
      )
        return false;
      if (q && !r.resource.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [rows, chapter, resourceStatus, topicCategory, search]);

  const hasActiveFilters = chapter || resourceStatus || topicCategory || search;

  return (
    <main className="mx-auto max-w-5xl px-6 pb-24 pt-10">
      <header className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-moss">Chapter Events Registry</p>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight">Speakers &amp; resources.</h1>
        </div>
        <Link
          href="/"
          className="mt-1 rounded-full border border-line bg-white px-4 py-2 font-mono text-xs text-ink/60 hover:border-moss hover:text-moss transition-colors whitespace-nowrap"
        >
          ← back to events
        </Link>
      </header>

      <div className="mb-6 flex flex-wrap items-end gap-3">
        <Field label="Chapter">
          <select value={chapter} onChange={(e) => setChapter(e.target.value)} className="select">
            <option value="">All chapters</option>
            {chapters.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Resource status">
          <select value={resourceStatus} onChange={(e) => setResourceStatus(e.target.value)} className="select">
            <option value="">Any status</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Topic category">
          <select value={topicCategory} onChange={(e) => setTopicCategory(e.target.value)} className="select">
            <option value="">Any topic</option>
            {topics.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Search">
          <input
            type="text"
            placeholder="Speaker or resource name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="select min-w-[200px]"
          />
        </Field>

        {hasActiveFilters && (
          <button
            onClick={() => {
              setChapter("");
              setResourceStatus("");
              setTopicCategory("");
              setSearch("");
            }}
            className="mb-[1px] rounded-full border border-line px-3 py-2 text-xs font-mono text-ink/60 hover:border-clay hover:text-clay transition-colors"
          >
            clear filters
          </button>
        )}

        <div className="ml-auto mb-1 font-mono text-xs text-ink/40">
          {filtered.length} resource{filtered.length === 1 ? "" : "s"}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="py-16 text-center">
          <p className="font-display text-lg text-ink/50">No resources match these filters.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-line bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line bg-paper">
                <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-wide text-ink/40">
                  Speaker / resource
                </th>
                <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-wide text-ink/40">Status</th>
                <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-wide text-ink/40">
                  Topic category
                </th>
                <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-wide text-ink/40">Chapter</th>
                <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-wide text-ink/40">For event</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-paper/60">
                  <td className="px-4 py-3 font-medium text-ink">{r.resource}</td>
                  <td className="px-4 py-3">
                    <ResourceStatusPill status={r.resourceStatus} />
                  </td>
                  <td className="px-4 py-3 text-ink/70">{r.topicCategory ?? "—"}</td>
                  <td className="px-4 py-3 text-clay/80">{r.chapterName}</td>
                  <td className="px-4 py-3 text-ink/50">{r.eventName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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
    </main>
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
