import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "../ui/skeleton";

export function TableSkeleton({
  cols,
  rows = 8,
}: {
  cols: number;
  rows?: number;
}) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRow key={i} className="hover:bg-transparent border-slate-50">
          {Array.from({ length: cols }).map((_, j) => (
            <TableCell key={j} className="px-4 py-3">
              <Skeleton className="h-4 rounded-md" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}
