"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { ChapterEvent } from "@/lib/events";
import { EventDetailModal } from "@/components/EventDetailModal";
import eventsData from "@/data/events.json";

const events = eventsData as ChapterEvent[];

const RESOURCE_STATUS_STYLES: Record<string, string> = {
  confirmed: "bg-white text-sky border-sky/40",
  "under negotiation": "bg-white text-gold border-gold/50",
  pending: "bg-white text-gold border-gold/50",
  wishlist: "bg-white text-navy/60 border-line",
};

function ResourceStatusPill({ status }: { status: string | null }) {
  if (!status) {
    return (
      <span className="inline-flex items-center rounded-full border border-line px-2 py-0.5 text-xs font-mono text-ink/50">
        no status
      </span>
    );
  }
  const style = RESOURCE_STATUS_STYLES[status.trim().toLowerCase()] ?? "bg-white text-navy/70 border-line";
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
  const [selected, setSelected] = useState<ChapterEvent | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Keep full events (not a stripped-down projection) so a click can open the full detail modal.
  const rows = useMemo(() => events.filter((e) => e.resource), []);

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
      if (q && !(r.resource ?? "").toLowerCase().includes(q)) return false;
      return true;
    });
  }, [rows, chapter, resourceStatus, topicCategory, search]);

  const hasActiveFilters = chapter || resourceStatus || topicCategory || search;

  return (
    <main className="mx-auto max-w-5xl px-6 pb-24 pt-10">
      <header className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-gold">Chapter Events Registry</p>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-ink">Speakers &amp; resources.</h1>
        </div>
        <Link
          href="/"
          className="mt-1 rounded-full border border-line bg-paper px-4 py-2 font-mono text-xs text-ink/60 hover:border-gold hover:text-gold transition-colors whitespace-nowrap"
        >
          ← back to events
        </Link>
      </header>

      <div className="mb-6">
        <div className="flex items-center justify-between sm:hidden">
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="flex items-center gap-2 rounded-full border border-line px-4 py-2 font-mono text-xs text-ink/70"
          >
            Filters
            {!!hasActiveFilters && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] font-semibold text-navy">
                •
              </span>
            )}
            <span className="text-ink/40">{mobileOpen ? "▲" : "▼"}</span>
          </button>
          <div className="font-mono text-xs text-ink/40">
            {filtered.length} resource{filtered.length === 1 ? "" : "s"}
          </div>
        </div>

        <div
          className={`${mobileOpen ? "mt-3 flex" : "hidden"} flex-col gap-3 sm:mt-0 sm:flex sm:flex-row sm:flex-wrap sm:items-end`}
        >
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
              className="mb-[1px] rounded-full border border-line px-3 py-2 text-xs font-mono text-ink/60 hover:border-orange hover:text-orange transition-colors"
            >
              clear filters
            </button>
          )}

          <button
            onClick={() => setMobileOpen(false)}
            className="mb-[1px] rounded-full bg-gold px-4 py-2 text-xs font-mono font-semibold text-navy sm:hidden"
          >
            Show {filtered.length} result{filtered.length === 1 ? "" : "s"}
          </button>

          <div className="hidden font-mono text-xs text-ink/40 sm:ml-auto sm:mb-1 sm:block">
            {filtered.length} resource{filtered.length === 1 ? "" : "s"}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="py-16 text-center">
          <p className="font-display text-lg text-ink/50">No resources match these filters.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-line bg-paper">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-line">
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
                  <tr
                    key={r.id}
                    onClick={() => setSelected(r)}
                    className="cursor-pointer transition-colors hover:bg-navy/40"
                  >
                    <td className="px-4 py-3 font-medium text-ink">{r.resource}</td>
                    <td className="px-4 py-3">
                      <ResourceStatusPill status={r.resourceStatus} />
                    </td>
                    <td className="px-4 py-3 text-ink/70">{r.topicCategory ?? "—"}</td>
                    <td className="px-4 py-3 text-orange/80">{r.chapterName}</td>
                    <td className="px-4 py-3 text-ink/50">{r.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selected && <EventDetailModal event={selected} onClose={() => setSelected(null)} />}

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
