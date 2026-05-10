"use server";

import { auth } from "@/auth";
import { Prisma } from "../generated/prisma/client";
import { prisma } from "@/db/prisma";

export type AuditAction =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "VIEW"
  | "LOGIN"
  | "LOGOUT"
  | "EXPORT"
  | "STATUS_CHANGE"
  | "APPROVE"
  | "REJECT";

export type AuditEntity =
  | "Product"
  | "Order"
  | "User"
  | "Review"
  | "Category"
  | "ReturnRequest"
  | "Cart"
  | "Notification";

export interface CreateAuditLogParams {
  action: AuditAction;
  entity: AuditEntity;
  entityId?: string;
  entityName?: string;
  changes?: Record<string, { old: unknown; new: unknown }>;
  metadata?: Record<string, unknown>;
  status?: "success" | "failure";
  errorMsg?: string;
}

export interface AuditLogFilters {
  userName?: string;
  entity?: AuditEntity;
  action?: AuditAction;
  status?: "success" | "failure";
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  pageSize?: number;
}

export interface AuditLogResult {
  id: string;
  userId: string | null;
  userName: string | null;
  userEmail: string | null;
  userRole: string | null;
  action: string;
  entity: string;
  entityId: string | null;
  entityName: string | null;
  changes: Prisma.JsonValue;
  metadata: Prisma.JsonValue;
  status: string;
  errorMsg: string | null;
  createdAt: Date;
}

export interface GetAuditLogsResponse {
  logs: AuditLogResult[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export async function createAuditLog(params: CreateAuditLogParams) {
  try {
    const session = await auth();
    const user = session?.user;

    await prisma.auditLog.create({
      data: {
        userId: user?.id ?? null,
        userName: user?.name ?? null,
        userEmail: user?.email ?? null,
        userRole: (user as { role?: string })?.role ?? null,
        action: params.action,
        entity: params.entity,
        entityId: params.entityId ?? null,
        entityName: params.entityName ?? null,
        changes: params.changes
          ? (params.changes as Prisma.InputJsonValue)
          : Prisma.JsonNull,
        metadata: params.metadata
          ? (params.metadata as Prisma.InputJsonValue)
          : Prisma.JsonNull,
        status: params.status ?? "success",
        errorMsg: params.errorMsg ?? null,
      },
    });
  } catch (err) {
    console.error("[AuditLog] Failed to write audit log:", err);
  }
}

export async function getAuditLogs(
  filters: AuditLogFilters = {},
): Promise<GetAuditLogsResponse> {
  const {
    userName,
    entity,
    action,
    status,
    dateFrom,
    dateTo,
    page = 1,
    pageSize = 20,
  } = filters;

  const where: Prisma.AuditLogWhereInput = {};

  if (userName && userName.trim() !== "") {
    where.OR = [
      { userName: { contains: userName, mode: "insensitive" } },
      { userEmail: { contains: userName, mode: "insensitive" } },
    ];
  }

  if (entity) where.entity = entity;
  if (action) where.action = action;
  if (status) where.status = status;

  if (dateFrom || dateTo) {
    where.createdAt = {};
    if (dateFrom) where.createdAt.gte = new Date(dateFrom);
    if (dateTo) {
      const end = new Date(dateTo);
      end.setHours(23, 59, 59, 999);
      where.createdAt.lte = end;
    }
  }

  const skip = (page - 1) * pageSize;

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.auditLog.count({ where }),
  ]);

  return {
    logs: logs as AuditLogResult[],
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getAuditLogById(
  id: string,
): Promise<AuditLogResult | null> {
  const log = await prisma.auditLog.findUnique({ where: { id } });
  return log as AuditLogResult | null;
}

export async function purgeOldAuditLogs(olderThanDays = 90) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - olderThanDays);

  const { count } = await prisma.auditLog.deleteMany({
    where: { createdAt: { lt: cutoff } },
  });

  return { deleted: count };
}
