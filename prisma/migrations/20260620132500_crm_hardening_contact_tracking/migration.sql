-- CreateEnum
CREATE TYPE "EmailDeliveryStatus" AS ENUM ('PENDING', 'SENT', 'DELIVERED', 'FAILED', 'RETRYING');

-- AlterTable
ALTER TABLE "Lead"
ADD COLUMN "ctaType" TEXT,
ADD COLUMN "campaignData" JSONB,
ADD COLUMN "routingWhatsapp" TEXT,
ADD COLUMN "routingReason" TEXT,
ADD COLUMN "emailStatus" "EmailDeliveryStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN "emailMessageId" TEXT,
ADD COLUMN "emailProviderResponse" JSONB,
ADD COLUMN "emailSentAt" TIMESTAMP(3),
ADD COLUMN "emailLastAttemptAt" TIMESTAMP(3),
ADD COLUMN "emailRetryCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "emailRetryHistory" JSONB,
ADD COLUMN "emailLastError" TEXT,
ADD COLUMN "emailNextRetryAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Followup"
ADD COLUMN "type" TEXT NOT NULL DEFAULT 'Initial Contact',
ADD COLUMN "status" TEXT NOT NULL DEFAULT 'Pending',
ADD COLUMN "priority" TEXT NOT NULL DEFAULT 'High',
ADD COLUMN "ownerName" TEXT,
ADD COLUMN "assignedMobile" TEXT,
ADD COLUMN "assignedEmail" TEXT,
ADD COLUMN "completedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Lead_emailStatus_emailNextRetryAt_idx" ON "Lead"("emailStatus", "emailNextRetryAt");

-- CreateIndex
CREATE INDEX "Lead_source_createdAt_idx" ON "Lead"("source", "createdAt");

-- CreateIndex
CREATE INDEX "Followup_status_priority_dueAt_idx" ON "Followup"("status", "priority", "dueAt");
