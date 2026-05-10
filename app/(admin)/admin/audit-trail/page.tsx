"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import { ShieldCheck } from "lucide-react";
import {
  getAuditLogs,
  type AuditLogFilters,
  type AuditLogResult,
} from "@/lib/actions/audit.actions";
import { AuditFilterBar } from "@/components/admin/audit-filter-bar";
import { AuditTable } from "@/components/admin/audit-table";
import { AuditPagination } from "@/components/admin/audit-pagination";
import { AuditDetailModal } from "@/components/admin/audit-modal";

const DEFAULT_FILTERS: AuditLogFilters = { page: 1, pageSize: 20 };

export default function AuditTrailPage() {
  const [filters, setFilters] = useState<AuditLogFilters>(DEFAULT_FILTERS);
  const [logs, setLogs] = useState<AuditLogResult[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedLog, setSelectedLog] = useState<AuditLogResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const fetchLogs = useCallback((f: AuditLogFilters) => {
    startTransition(async () => {
      const res = await getAuditLogs(f);
      setLogs(res.logs);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    });
  }, []);

  useEffect(() => {
    fetchLogs(filters);
  }, [filters, fetchLogs]);

  return (
    <div className="min-h-screen bg-slate-50/60 p-6">
      <div className="max-w-screen-xl mx-auto space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#1F4F70] flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-none">
                Audit Trail
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Complete record of all user actions across the system
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-sm font-semibold rounded-full border border-indigo-100">
              {total.toLocaleString()} records
            </span>
          </div>
        </div>

        <AuditFilterBar
          filters={filters}
          onChange={setFilters}
          onReset={() => setFilters(DEFAULT_FILTERS)}
        />

        <AuditTable
          logs={logs}
          isPending={isPending}
          onViewLog={setSelectedLog}
        />

        {totalPages > 1 && (
          <AuditPagination
            page={filters.page ?? 1}
            totalPages={totalPages}
            total={total}
            pageSize={filters.pageSize ?? 20}
            onPage={(p) => setFilters((f) => ({ ...f, page: p }))}
          />
        )}
      </div>

      <AuditDetailModal
        log={selectedLog}
        onClose={() => setSelectedLog(null)}
      />
    </div>
  );
}
