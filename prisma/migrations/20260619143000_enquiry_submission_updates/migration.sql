-- Add service contact fields
ALTER TABLE "Service"
ADD COLUMN "serviceEmail" TEXT,
ADD COLUMN "serviceWhatsappNumber" TEXT;

-- Add enquiry metadata
ALTER TABLE "Lead"
ADD COLUMN "requestId" TEXT,
ADD COLUMN "message" TEXT,
ADD COLUMN "submissionType" TEXT NOT NULL DEFAULT 'callback';

CREATE UNIQUE INDEX "Lead_requestId_key" ON "Lead"("requestId");

UPDATE "Service" SET "serviceEmail" = 'namaste@taakshvisolutionhub.com', "serviceWhatsappNumber" = '7977938960' WHERE "slug" = 'corporate-events';
UPDATE "Service" SET "serviceEmail" = 'namaste@taakshvisolutionhub.com', "serviceWhatsappNumber" = '8460623469' WHERE "slug" = 'tours-travel';
UPDATE "Service" SET "serviceEmail" = 'namaste@taakshvisolutionhub.com', "serviceWhatsappNumber" = '7977938960' WHERE "slug" = 'wellness-retreats';
UPDATE "Service" SET "serviceEmail" = 'namaste@taakshvisolutionhub.com', "serviceWhatsappNumber" = '7977938960' WHERE "slug" = 'branding-marketing';
UPDATE "Service" SET "serviceEmail" = 'namaste@taakshvisolutionhub.com', "serviceWhatsappNumber" = '7977938960' WHERE "slug" = 'photography-videography';
UPDATE "Service" SET "serviceEmail" = 'namaste@taakshvisolutionhub.com', "serviceWhatsappNumber" = '7977938960' WHERE "slug" = 'artist-management';
UPDATE "Service" SET "serviceEmail" = 'namaste@taakshvisolutionhub.com', "serviceWhatsappNumber" = '7977938960' WHERE "slug" = 'venue-sourcing';
UPDATE "Service" SET "serviceEmail" = 'namaste@taakshvisolutionhub.com', "serviceWhatsappNumber" = '7977938960' WHERE "slug" = 'team-building-activities';
UPDATE "Service" SET "serviceEmail" = 'namaste@taakshvisolutionhub.com', "serviceWhatsappNumber" = '8460623469' WHERE "slug" = 'real-estate';
UPDATE "Service" SET "serviceEmail" = 'namaste@taakshvisolutionhub.com', "serviceWhatsappNumber" = '9833031572' WHERE "slug" = 'astrology';
UPDATE "Service" SET "serviceEmail" = 'namaste@taakshvisolutionhub.com', "serviceWhatsappNumber" = '9326277096' WHERE "slug" = 'finance';
UPDATE "Service" SET "serviceEmail" = 'namaste@taakshvisolutionhub.com', "serviceWhatsappNumber" = '8460623469' WHERE "slug" = 'health-wellness';
UPDATE "Service" SET "serviceEmail" = 'namaste@taakshvisolutionhub.com', "serviceWhatsappNumber" = '7977938960' WHERE "slug" = 'other';
