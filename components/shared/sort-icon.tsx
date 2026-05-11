import { ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react";

export function SortIcon({
  column,
  sort,
  sortDir,
}: {
  column: string;
  sort?: string;
  sortDir?: string;
}) {
  if (sort !== column)
    return <ChevronsUpDown className="w-3 h-3 text-slate-300" />;
  return sortDir === "asc" ? (
    <ChevronUp className="w-3 h-3 text-indigo-500" />
  ) : (
    <ChevronDown className="w-3 h-3 text-indigo-500" />
  );
}
