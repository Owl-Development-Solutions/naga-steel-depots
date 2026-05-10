"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

import type { AuditLogResult } from "@/lib/actions/audit.actions";

import {
  ActionBadge,
  StatusDot,
  EntityLabel,
  UserAvatar,
} from "./audit-trail-badges";
import { ScrollArea } from "../ui/scroll-area";
import { formatDate } from "@/types";
import { ChangeDiff } from "./audit-trail-diff";

interface AuditDetailModalProps {
  log: AuditLogResult | null;
  onClose: () => void;
}

function InfoRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-0.5">
      <p className="text-xs text-slate-400 font-medium">{label}</p>
      <div className="text-sm text-slate-800">{children}</div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.12em] mb-3">
      {children}
    </p>
  );
}

export function AuditDetailModal({ log, onClose }: AuditDetailModalProps) {
  if (!log) return null;

  const changes = log.changes as Record<
    string,
    { old: unknown; new: unknown }
  > | null;
  const metadata = log.metadata as Record<string, unknown> | null;
  const hasChanges = changes && Object.keys(changes).length > 0;
  const hasMetadata = metadata && Object.keys(metadata).length > 0;

  return (
    <Dialog open={!!log} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg p-0 gap-0 rounded-2xl overflow-hidden border-slate-200">
        <DialogHeader className="px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <DialogTitle className="text-base font-bold text-slate-800 tracking-tight">
            Audit Log Detail
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[75vh]">
          <div className="px-6 py-5 space-y-6">
            <section>
              <SectionTitle>Actor</SectionTitle>
              <div className="bg-slate-50 rounded-xl p-3 mb-3">
                <UserAvatar name={log.userName} email={log.userEmail} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <InfoRow label="Role">
                  <span className="capitalize">{log.userRole ?? "—"}</span>
                </InfoRow>
                <InfoRow label="User ID">
                  <span className="font-mono text-xs text-slate-500 break-all">
                    {log.userId ?? "—"}
                  </span>
                </InfoRow>
              </div>
            </section>

            <Separator className="bg-slate-100" />

            <section>
              <SectionTitle>Action</SectionTitle>
              <div className="grid grid-cols-2 gap-3">
                <InfoRow label="Action">
                  <div className="mt-0.5">
                    <ActionBadge action={log.action} />
                  </div>
                </InfoRow>
                <InfoRow label="Status">
                  <div className="mt-1">
                    <StatusDot status={log.status} />
                  </div>
                </InfoRow>
                <InfoRow label="Entity">
                  <EntityLabel entity={log.entity} />
                </InfoRow>
                <InfoRow label="Timestamp">
                  <span className="text-xs text-slate-600 font-mono">
                    {formatDate(log.createdAt)}
                  </span>
                </InfoRow>
                <InfoRow label="Record Name">
                  <span className="font-medium">{log.entityName ?? "—"}</span>
                </InfoRow>
                <InfoRow label="Entity ID">
                  <span className="font-mono text-xs text-slate-500 break-all">
                    {log.entityId ?? "—"}
                  </span>
                </InfoRow>
              </div>
            </section>

            {hasChanges && (
              <>
                <Separator className="bg-slate-100" />
                <section>
                  <SectionTitle>
                    Field Changes ({Object.keys(changes).length})
                  </SectionTitle>
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <ChangeDiff changes={changes} />
                  </div>
                </section>
              </>
            )}

            {log.errorMsg && (
              <>
                <Separator className="bg-slate-100" />
                <section>
                  <SectionTitle>Error</SectionTitle>
                  <p className="text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2.5 border border-red-100">
                    {log.errorMsg}
                  </p>
                </section>
              </>
            )}

            {hasMetadata && (
              <>
                <Separator className="bg-slate-100" />
                <section>
                  <SectionTitle>Metadata</SectionTitle>
                  <pre className="text-xs bg-slate-50 rounded-xl p-3 overflow-x-auto text-slate-600 border border-slate-100 leading-relaxed">
                    {JSON.stringify(metadata, null, 2)}
                  </pre>
                </section>
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
