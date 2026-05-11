"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCheckIcon, Download, X, XIcon } from "lucide-react";
import type { AuditLogFilters } from "@/lib/actions/audit.actions";
import { ACTIONS, ENTITIES } from "@/types";

interface AuditFilterBarProps {
  filters: AuditLogFilters;
  onChange: (f: AuditLogFilters) => void;
  onReset: () => void;
  onExport: () => void;
}

export function AuditFilterBar({
  filters,
  onChange,
  onReset,
  onExport,
}: AuditFilterBarProps) {
  const set = (patch: Partial<AuditLogFilters>) =>
    onChange({ ...filters, ...patch, page: 1 });

  const hasActiveFilters =
    filters.userName ||
    filters.entity ||
    filters.action ||
    filters.status ||
    filters.dateFrom ||
    filters.dateTo;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
      <div className="flex flex-wrap items-end gap-3">
        {/* User search */}
        <div className="flex flex-col gap-1.5 min-w-[180px]">
          <label className="text-xs font-semibold text-slate-500 tracking-wide">
            User name / email
          </label>
          <Input
            placeholder="Search user…"
            value={filters.userName ?? ""}
            onChange={(e) => set({ userName: e.target.value || undefined })}
            className="h-9 text-sm border-slate-200"
          />
        </div>

        {/* Entity */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500 tracking-wide">
            Entity
          </label>
          <Select
            value={filters.entity ?? "all"}
            onValueChange={(v) =>
              set({
                entity: v === "all" ? undefined : (v as typeof filters.entity),
              })
            }
          >
            <SelectTrigger className="h-9 w-[160px] text-sm border-slate-200 focus:ring-indigo-400">
              <SelectValue placeholder="All entities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All entities</SelectItem>
              {ENTITIES.map((e) => (
                <SelectItem key={e} value={e}>
                  {e}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Action */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500 tracking-wide">
            Action
          </label>
          <Select
            value={filters.action ?? "all"}
            onValueChange={(v) =>
              set({
                action: v === "all" ? undefined : (v as typeof filters.action),
              })
            }
          >
            <SelectTrigger className="h-9 w-[160px] text-sm border-slate-200 focus:ring-indigo-400">
              <SelectValue placeholder="All actions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All actions</SelectItem>
              {ACTIONS.map((a) => (
                <SelectItem key={a} value={a}>
                  {a.replace("_", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500 tracking-wide">
            Status
          </label>
          <Select
            value={filters.status ?? "all"}
            onValueChange={(v) =>
              set({
                status: v === "all" ? undefined : (v as "success" | "failure"),
              })
            }
          >
            <SelectTrigger className="h-9 w-[130px] text-sm border-slate-200 focus:ring-indigo-400">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="success">
                <span className="flex items-center">
                  <CheckCheckIcon />
                  Success
                </span>
              </SelectItem>
              <SelectItem value="failure">
                <span className="flex items-center">
                  <XIcon />
                  Failure
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500 tracking-wide">
            Date from
          </label>
          <Input
            type="date"
            value={filters.dateFrom ?? ""}
            onChange={(e) => set({ dateFrom: e.target.value || undefined })}
            className="h-9 text-sm border-slate-200 focus-visible:ring-indigo-400 w-[145px]"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500 tracking-wide">
            Date to
          </label>
          <Input
            type="date"
            value={filters.dateTo ?? ""}
            onChange={(e) => set({ dateTo: e.target.value || undefined })}
            className="h-9 text-sm border-slate-200 focus-visible:ring-indigo-400 w-[145px]"
          />
        </div>

        <div className="flex flex-col gap-1.5 items-center justify-center">
          <div className="h-4"></div>
          <Button
            onClick={onExport}
            className="bg-[#1F4F70] hover:bg-[#173c56] text-white shadow-sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>

              </div>
    </div>
  );
}
