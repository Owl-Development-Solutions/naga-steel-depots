"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { AuditLogResult } from "@/lib/actions/audit.actions";
import {
  ActionBadge,
  StatusDot,
  EntityLabel,
  UserAvatar,
} from "./audit-trail-badges";
import { ChangeCountBadge } from "./audit-trail-diff";
import { formatDate } from "@/types";

interface AuditTableProps {
  logs: AuditLogResult[];
  isPending: boolean;
  onViewLog: (log: AuditLogResult) => void;
}

const COLUMN_HEADERS = [
  "Timestamp",
  "User",
  "Role",
  "Action",
  "Entity",
  "Record",
  "Changes",
  "Status",
  "",
];

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, i) => (
        <TableRow key={i} className="hover:bg-transparent">
          {COLUMN_HEADERS.map((_, j) => (
            <TableCell key={j} className="px-4 py-3">
              <Skeleton className="h-4 w-full rounded-md" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

function EmptyState() {
  return (
    <TableRow className="hover:bg-transparent">
      <TableCell colSpan={9} className="py-20 text-center">
        <div className="flex flex-col items-center gap-2 text-slate-400">
          <span className="text-4xl">🔍</span>
          <p className="font-semibold text-slate-500">No audit logs found</p>
          <p className="text-xs">Try adjusting your filters</p>
        </div>
      </TableCell>
    </TableRow>
  );
}

export function AuditTable({ logs, isPending, onViewLog }: AuditTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {isPending && <div className="h-0.5 bg-yellow-400 animate-pulse" />}

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50 border-slate-100">
              {COLUMN_HEADERS.map((h) => (
                <TableHead
                  key={h}
                  className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap"
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {isPending ? (
              <TableSkeleton />
            ) : logs.length === 0 ? (
              <EmptyState />
            ) : (
              logs.map((log) => {
                const changes = log.changes as Record<
                  string,
                  { old: unknown; new: unknown }
                > | null;
                const changeCount = changes ? Object.keys(changes).length : 0;

                return (
                  <TableRow
                    key={log.id}
                    className="group border-slate-50 hover:bg-indigo-50/20 transition-colors cursor-default"
                  >
                    {/* Timestamp */}
                    <TableCell className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs text-slate-500 font-mono">
                        {formatDate(log.createdAt)}
                      </span>
                    </TableCell>

                    {/* User */}
                    <TableCell className="px-4 py-3">
                      <UserAvatar name={log.userName} email={log.userEmail} />
                    </TableCell>

                    {/* Role */}
                    <TableCell className="px-4 py-3">
                      <span className="text-xs text-slate-500 capitalize bg-slate-100 px-2 py-0.5 rounded-full">
                        {log.userRole ?? "—"}
                      </span>
                    </TableCell>

                    {/* Action */}
                    <TableCell className="px-4 py-3 whitespace-nowrap">
                      <ActionBadge action={log.action} />
                    </TableCell>

                    {/* Entity */}
                    <TableCell className="px-4 py-3 whitespace-nowrap">
                      <EntityLabel entity={log.entity} />
                    </TableCell>

                    {/* Record */}
                    <TableCell className="px-4 py-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-700 truncate max-w-[160px]">
                          {log.entityName ?? "—"}
                        </p>
                        {log.entityId && (
                          <p className="text-[11px] text-slate-400 font-mono truncate max-w-[160px]">
                            {log.entityId}
                          </p>
                        )}
                      </div>
                    </TableCell>

                    {/* Changes count */}
                    <TableCell className="px-4 py-3 text-center">
                      <ChangeCountBadge count={changeCount} />
                    </TableCell>

                    {/* Status */}
                    <TableCell className="px-4 py-3 whitespace-nowrap">
                      <StatusDot status={log.status} />
                    </TableCell>

                    {/* View button */}
                    <TableCell className="px-4 py-3">
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => onViewLog(log)}
                        className=" h-7 px-3 text-xs "
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
