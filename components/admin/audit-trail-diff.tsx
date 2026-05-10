import { cn } from "@/lib/utils";

interface ChangeDiffProps {
  changes: Record<string, { old: unknown; new: unknown }>;
  compact?: boolean;
}

export function ChangeDiff({ changes, compact = false }: ChangeDiffProps) {
  const entries = Object.entries(changes);

  if (entries.length === 0) return null;

  return (
    <div
      className={cn("space-y-1.5 font-mono text-xs", compact && "space-y-1")}
    >
      {entries.map(([field, { old: o, new: n }]) => (
        <div
          key={field}
          className="grid grid-cols-[100px_1fr_1fr] gap-2 items-start"
        >
          <span className="text-slate-500 truncate pt-0.5">{field}</span>

          <span
            className="bg-red-50 text-red-700 px-1.5 py-0.5 rounded border border-red-100 line-through truncate"
            title={String(o ?? "")}
          >
            {String(o ?? "—")}
          </span>

          <span
            className="bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-100 truncate"
            title={String(n ?? "")}
          >
            {String(n ?? "—")}
          </span>
        </div>
      ))}
    </div>
  );
}

export function ChangeCountBadge({ count }: { count: number }) {
  if (count === 0) return <span className="text-slate-300 text-sm">—</span>;
  return (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold ring-1 ring-blue-200">
      {count}
    </span>
  );
}
