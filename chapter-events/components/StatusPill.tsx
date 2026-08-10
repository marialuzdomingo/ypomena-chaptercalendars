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
      <span className="inline-flex max-w-[80px] items-center truncate rounded-full border border-line px-1.5 py-0.5 text-[10px] font-mono text-ink/50 sm:max-w-none sm:px-2 sm:text-xs">
        no status
      </span>
    );
  }

  const key = status.trim().toLowerCase();
  const style = STATUS_STYLES[key] ?? "bg-white text-navy/70 border-line";

  return (
    <span
      className={`inline-flex max-w-[80px] items-center truncate rounded-full border px-1.5 py-0.5 text-[10px] font-mono sm:max-w-none sm:px-2 sm:text-xs ${style}`}
    >
      {status}
    </span>
  );
}
