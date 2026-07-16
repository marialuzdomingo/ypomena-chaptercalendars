const STATUS_STYLES: Record<string, string> = {
  confirmed: "bg-moss/10 text-moss border-moss/30",
  tentative: "bg-gold/10 text-gold border-gold/40",
  cancelled: "bg-clay/10 text-clay border-clay/30",
};

export function StatusPill({ status }: { status: string | null }) {
  if (!status) {
    return (
      <span className="inline-flex items-center rounded-full border border-line px-2 py-0.5 text-xs font-mono text-ink/40">
        no status
      </span>
    );
  }

  const key = status.trim().toLowerCase();
  const style = STATUS_STYLES[key] ?? "bg-ink/5 text-ink/60 border-ink/15";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-mono ${style}`}
    >
      {status}
    </span>
  );
}
