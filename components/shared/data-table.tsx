"use client";

import { DataTableFilters, DataTableProps } from "@/types/table-types";
import { Search, X } from "lucide-react";
import { useCallback, useEffect, useState, useTransition } from "react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { cn } from "@/lib/utils";
import { SortIcon } from "./sort-icon";
import { TableSkeleton } from "./table-skeleton";
import { EmptyState } from "./empty-state";
import { DataPagination } from "./pagination";

export function DataTable<T>({
  Icon,
  title,
  description,
  columns,
  filters: filterConfigs = [],
  pageSizeOptions = [10, 20, 50],
  defaultPageSize = 20,
  fetchData,
  rowKey,
  emptyMessage,
  headerActions,
  onRowClick,
}: DataTableProps<T>) {
  const [rows, setRows] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [filterValues, setFilterValues] = useState<DataTableFilters>({});
  const [sort, setSort] = useState<string | undefined>();
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [isPending, startTransition] = useTransition();

  const hasActiveFilters = Object.values(filterValues).some(
    (v) => v !== undefined && v !== "" && v !== "all",
  );

  const load = useCallback(
    (f: DataTableFilters, p: number, ps: number) => {
      startTransition(async () => {
        const res = await fetchData(f, p, ps);
        setRows(res.data);
        setTotalPages(res.totalPages);
        setTotal(res.total ?? res.data.length);
      });
    },
    [fetchData],
  );

  useEffect(() => {
    load({ ...filterValues, sort, sortDir }, page, pageSize);
  }, [filterValues, page, pageSize, sort, sortDir, load]);

  function handleFilter(key: string, value: string) {
    setFilterValues((prev) => ({
      ...prev,
      [key]: value === "all" || value === "" ? undefined : value,
    }));
    setPage(1);
  }

  function handleSort(key: string) {
    if (sort === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSort(key);
      setSortDir("asc");
    }
    setPage(1);
  }

  function handleReset() {
    setFilterValues({});
    setPage(1);
    setSort(undefined);
    setSortDir("asc");
  }

  return (
    <div className="space-y-5">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#1F4F70] flex items-center justify-center shadow-sm">
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-none">
              {title}
            </h1>
            {description && (
              <p className="text-xs text-slate-500 mt-0.5">{description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {headerActions}
          <span className="px-3 py-1.5 bg-indigo-50 text-[#173c56] text-sm font-semibold rounded-full border border-indigo-100">
            {total.toLocaleString()} records
          </span>
        </div>
      </div>

      {/* ── Filters ── */}
      {filterConfigs.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
          <div className="flex flex-wrap items-end gap-3">
            {filterConfigs.map((fc) => (
              <div key={fc.key} className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 tracking-wide">
                  {fc.label}
                </label>

                {fc.type === "search" && (
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <Input
                      placeholder={fc.placeholder ?? `Search ${fc.label}…`}
                      value={filterValues[fc.key] ?? ""}
                      onChange={(e) => handleFilter(fc.key, e.target.value)}
                      className="h-9 pl-8 text-sm border-slate-200  w-48"
                    />
                  </div>
                )}

                {fc.type === "select" && (
                  <Select
                    value={filterValues[fc.key] ?? "all"}
                    onValueChange={(v) => handleFilter(fc.key, v)}
                  >
                    <SelectTrigger className="h-9 w-[150px] text-sm border-slate-200 ">
                      <SelectValue placeholder={`All ${fc.label}`} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All {fc.label}</SelectItem>
                      {fc.options?.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {fc.type === "date" && (
                  <Input
                    type="date"
                    value={filterValues[fc.key] ?? ""}
                    onChange={(e) => handleFilter(fc.key, e.target.value)}
                    className="h-9 text-sm border-slate-200  w-[145px]"
                  />
                )}
              </div>
            ))}

            {/* Page size */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 tracking-wide">
                Per page
              </label>
              <Select
                value={String(pageSize)}
                onValueChange={(v) => {
                  setPageSize(Number(v));
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-9  text-sm border-slate-200 ">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {pageSizeOptions.map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n} rows
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Reset */}
            {hasActiveFilters && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleReset}
                className="h-9 gap-1.5  self-end"
              >
                <X className="w-3.5 h-3.5" />
                Reset
              </Button>
            )}
          </div>
        </div>
      )}

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {isPending && <div className="h-0.5 bg-yellow-400 animate-pulse" />}

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50 border-slate-100">
                {columns.map((col) => (
                  <TableHead
                    key={col.key}
                    className={cn(
                      "px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap",
                      col.sortable &&
                        "cursor-pointer select-none hover:text-slate-700",
                      col.className,
                    )}
                    onClick={() => col.sortable && handleSort(col.key)}
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      {col.sortable && (
                        <SortIcon
                          column={col.key}
                          sort={sort}
                          sortDir={sortDir}
                        />
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {isPending ? (
                <TableSkeleton cols={columns.length} />
              ) : rows.length === 0 ? (
                <EmptyState cols={columns.length} message={emptyMessage} />
              ) : (
                rows.map((row) => (
                  <TableRow
                    key={rowKey(row)}
                    className={cn(
                      "border-slate-50 hover:bg-indigo-50/20 transition-colors",
                      onRowClick && "cursor-pointer",
                    )}
                    onClick={() => onRowClick?.(row)}
                  >
                    {columns.map((col) => (
                      <TableCell
                        key={col.key}
                        className={cn("px-4 py-3", col.className)}
                      >
                        {col.render(row)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <DataPagination
          page={page}
          totalPages={totalPages}
          total={total}
          pageSize={pageSize}
          onPage={setPage}
        />
      )}
    </div>
  );
}
