const STATUS_STYLES: Record<string, string> = {
  confirmed: "bg-white text-blue border-blue/40",
  scheduled: "bg-white text-orange border-orange/40",
  "planning stage": "bg-white text-gold border-gold/50",
  tentative: "bg-white text-gold border-gold/50",
  cancelled: "bg-white text-red border-red/40",
};

export function StatusPill({ status }: { status: string | null }) {
  if (!status) {
    return (
      <span className="inline-flex items-center rounded-full border border-line px-2 py-0.5 text-xs font-mono text-ink/50">
        no status
      </span>
    );
  }

  const key = status.trim().toLowerCase();
  const style = STATUS_STYLES[key] ?? "bg-white text-navy/70 border-line";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-mono ${style}`}
    >
      {status}
    </span>
  );
}
