import { TableCell, TableRow } from "../ui/table";

export function EmptyState({
  cols,
  message,
}: {
  cols: number;
  message?: string;
}) {
  return (
    <TableRow className="hover:bg-transparent">
      <TableCell colSpan={cols} className="py-20 text-center">
        <div className="flex flex-col items-center gap-2 text-slate-400">
          <span className="text-4xl">🔍</span>
          <p className="font-semibold text-slate-500">
            {message ?? "No records found"}
          </p>
          <p className="text-xs">Try adjusting your filters</p>
        </div>
      </TableCell>
    </TableRow>
  );
}
