/*
  Warnings:

  - You are about to drop the column `status` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "status";

-- CreateTable
CREATE TABLE "AuditTrail" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "userName" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "module" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "status" TEXT NOT NULL DEFAULT 'SUCCESS',
    "sessionId" TEXT,
    "additionalData" JSONB,
    "timestamp" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditTrail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AuditTrail_userId_idx" ON "AuditTrail"("userId");

-- CreateIndex
CREATE INDEX "AuditTrail_action_idx" ON "AuditTrail"("action");

-- CreateIndex
CREATE INDEX "AuditTrail_module_idx" ON "AuditTrail"("module");

-- CreateIndex
CREATE INDEX "AuditTrail_status_idx" ON "AuditTrail"("status");

-- CreateIndex
CREATE INDEX "AuditTrail_timestamp_idx" ON "AuditTrail"("timestamp");

-- CreateIndex
CREATE INDEX "AuditTrail_userId_timestamp_idx" ON "AuditTrail"("userId", "timestamp");

-- CreateIndex
CREATE INDEX "AuditTrail_action_timestamp_idx" ON "AuditTrail"("action", "timestamp");

-- CreateIndex
CREATE INDEX "AuditTrail_module_timestamp_idx" ON "AuditTrail"("module", "timestamp");
