import { LeadStatus } from "@prisma/client"
import { startOfDay, subDays } from "date-fns"

import { prisma } from "@/lib/db"
import { maskRecentEnquiryName } from "@/lib/lead-routing"

type EmailStatus = "PENDING" | "SENT" | "DELIVERED" | "FAILED" | "RETRYING"

type RawDashboardMetrics = {
  failedEmails: bigint
  pendingEmails: bigint
  retryQueue: bigint
  pendingFollowups: bigint
  unassignedLeads: bigint
  pendingContactRequests: bigint
}

type RawLeadSource = {
  source: string
  count: bigint
}

type RawServicePerformance = {
  service: string
  total: bigint
  won: bigint
}

type RawLeadDetail = {
  id: string
  requestId: string | null
  fullName: string
  mobile: string
  whatsapp: string | null
  email: string
  company: string | null
  city: string
  message: string | null
  submissionType: string
  source: string
  ctaType: string | null
  assignedMobile: string
  assignedEmail: string
  routingWhatsapp: string | null
  routingReason: string | null
  emailStatus: EmailStatus | null
  emailMessageId: string | null
  emailSentAt: Date | null
  emailLastAttemptAt: Date | null
  emailRetryCount: number | null
  emailRetryHistory: unknown
  emailLastError: string | null
  emailNextRetryAt: Date | null
  servicePayload: unknown
  campaignData: unknown
  createdAt: Date
  updatedAt: Date
  status: string
  serviceName: string
  serviceSlug: string
}

type RawLeadActivity = {
  id: string
  type: string
  message: string
  metadata: unknown
  createdAt: Date
}

type RawLeadAssignment = {
  id: string
  ownerName: string | null
  mobile: string
  email: string | null
  createdAt: Date
}

type RawLeadFollowup = {
  id: string
  type: string | null
  status: string | null
  priority: string | null
  dueAt: Date
  notes: string
  completed: boolean
  completedAt: Date | null
  ownerName: string | null
  assignedMobile: string | null
  assignedEmail: string | null
  createdAt: Date
}

type RawLeadNote = {
  id: string
  note: string
  createdAt: Date
}

function asCount(value: bigint | number) {
  return typeof value === "bigint" ? Number(value) : value
}

function recordFromUnknown(value: unknown) {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {}
}

export async function getRecentEnquiries(limit = 4) {
  const leads = await prisma.lead.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      fullName: true,
      city: true,
      createdAt: true,
      service: {
        select: {
          name: true,
        },
      },
    },
  })

  return leads.map((lead) => ({
    id: lead.id,
    name: maskRecentEnquiryName(lead.fullName),
    city: lead.city,
    service: lead.service.name,
    time: formatRelativeLeadTime(lead.createdAt),
  }))
}

export async function getDashboardMetrics() {
  const today = startOfDay(new Date())
  const [total, todayCount, newCount, qualified, won, lost, advanced] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { createdAt: { gte: today } } }),
    prisma.lead.count({ where: { status: LeadStatus.NEW } }),
    prisma.lead.count({ where: { status: LeadStatus.QUALIFIED } }),
    prisma.lead.count({ where: { status: LeadStatus.WON } }),
    prisma.lead.count({ where: { status: LeadStatus.LOST } }),
    prisma.$queryRaw<RawDashboardMetrics[]>`
      SELECT
        COUNT(*) FILTER (WHERE "emailStatus" = 'FAILED') AS "failedEmails",
        COUNT(*) FILTER (WHERE "emailStatus" IN ('PENDING', 'RETRYING')) AS "pendingEmails",
        COUNT(*) FILTER (WHERE "emailStatus" = 'RETRYING') AS "retryQueue",
        (SELECT COUNT(*) FROM "Followup" WHERE "completed" = FALSE) AS "pendingFollowups",
        COUNT(*) FILTER (WHERE COALESCE("assignedMobile", '') = '' OR COALESCE("assignedEmail", '') = '') AS "unassignedLeads",
        COUNT(*) FILTER (WHERE "status" = 'NEW' AND "createdAt" >= ${today}) AS "pendingContactRequests"
      FROM "Lead"
    `,
  ])

  const snapshot = advanced[0]

  return {
    total,
    today: todayCount,
    new: newCount,
    qualified,
    won,
    lost,
    failedEmails: snapshot ? asCount(snapshot.failedEmails) : 0,
    pendingEmails: snapshot ? asCount(snapshot.pendingEmails) : 0,
    retryQueue: snapshot ? asCount(snapshot.retryQueue) : 0,
    pendingFollowups: snapshot ? asCount(snapshot.pendingFollowups) : 0,
    unassignedLeads: snapshot ? asCount(snapshot.unassignedLeads) : 0,
    pendingContactRequests: snapshot ? asCount(snapshot.pendingContactRequests) : 0,
    conversionRate: total ? Math.round((won / total) * 1000) / 10 : 0,
  }
}

export async function getLeadRows(limit = 8) {
  const leads = await prisma.$queryRaw<
    Array<{
      id: string
      createdAt: Date
      fullName: string
      mobile: string
      city: string
      assignedMobile: string
      status: string
      source: string
      serviceName: string
      emailStatus: EmailStatus | null
      pendingFollowups: bigint
    }>
  >`
    SELECT
      l."id",
      l."createdAt",
      l."fullName",
      l."mobile",
      l."city",
      l."assignedMobile",
      l."status",
      l."source",
      l."emailStatus",
      s."name" AS "serviceName",
      (
        SELECT COUNT(*)
        FROM "Followup" f
        WHERE f."leadId" = l."id" AND f."completed" = FALSE
      ) AS "pendingFollowups"
    FROM "Lead" l
    JOIN "Service" s ON s."id" = l."serviceId"
    ORDER BY l."createdAt" DESC
    LIMIT ${limit}
  `

  return leads.map((lead) => ({
    id: lead.id,
    date: lead.createdAt.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
    name: lead.fullName,
    mobile: lead.mobile,
    service: lead.serviceName,
    city: lead.city,
    assignedTo: lead.assignedMobile,
    status: lead.status.replaceAll("_", " "),
    source: lead.source,
    emailStatus: lead.emailStatus ?? "PENDING",
    pendingFollowups: asCount(lead.pendingFollowups),
  }))
}

export async function getLeadSources(limit = 6) {
  const rows = await prisma.$queryRaw<RawLeadSource[]>`
    SELECT "source", COUNT(*) AS "count"
    FROM "Lead"
    GROUP BY "source"
    ORDER BY COUNT(*) DESC, "source" ASC
    LIMIT ${limit}
  `

  return rows.map((row) => ({
    source: row.source,
    count: asCount(row.count),
  }))
}

export async function getServicePerformance(limit = 6) {
  const rows = await prisma.$queryRaw<RawServicePerformance[]>`
    SELECT
      s."name" AS "service",
      COUNT(*) AS "total",
      COUNT(*) FILTER (WHERE l."status" = 'WON') AS "won"
    FROM "Lead" l
    JOIN "Service" s ON s."id" = l."serviceId"
    GROUP BY s."name"
    ORDER BY COUNT(*) DESC, s."name" ASC
    LIMIT ${limit}
  `

  return rows.map((row) => ({
    service: row.service,
    total: asCount(row.total),
    won: asCount(row.won),
    conversionRate: asCount(row.total) ? Math.round((asCount(row.won) / asCount(row.total)) * 1000) / 10 : 0,
  }))
}

export async function getCmsCounts() {
  const [blogs, news, gallery, testimonials, settings] = await Promise.all([
    prisma.blogPost.count(),
    prisma.newsPost.count(),
    prisma.galleryItem.count(),
    prisma.testimonial.count(),
    prisma.setting.count(),
  ])

  return { blogs, news, gallery, testimonials, settings }
}

export async function getLeadTrend() {
  const start = subDays(new Date(), 13)
  const leads = await prisma.lead.findMany({
    where: { createdAt: { gte: start } },
    select: { createdAt: true, status: true },
  })

  return Array.from({ length: 14 }, (_, index) => {
    const date = subDays(new Date(), 13 - index)
    const key = date.toISOString().slice(0, 10)
    const dayLeads = leads.filter((lead) => lead.createdAt.toISOString().slice(0, 10) === key)
    return {
      label: date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
      leads: dayLeads.length,
      qualified: dayLeads.filter((lead) => lead.status === LeadStatus.QUALIFIED).length,
    }
  })
}

export async function getRecentAuditLogs(limit = 8) {
  const logs = await prisma.auditLog.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
  })

  const actorIds = logs.map((log) => log.actorId).filter((id): id is string => Boolean(id))
  const actors = actorIds.length
    ? await prisma.user.findMany({
        where: { id: { in: actorIds } },
        select: { id: true, name: true, email: true },
      })
    : []
  const actorMap = new Map(actors.map((actor) => [actor.id, actor]))

  return logs.map((log) => ({
    id: log.id,
    actor: actorMap.get(log.actorId ?? "")?.name || actorMap.get(log.actorId ?? "")?.email || "System",
    action: log.action,
    entity: log.entity,
    createdAt: log.createdAt.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }),
  }))
}

export async function getLeadDetailById(id: string) {
  const [leadRows, activities, assignments, followups, notes] = await Promise.all([
    prisma.$queryRaw<RawLeadDetail[]>`
      SELECT
        l."id",
        l."requestId",
        l."fullName",
        l."mobile",
        l."whatsapp",
        l."email",
        l."company",
        l."city",
        l."message",
        l."submissionType",
        l."source",
        l."ctaType",
        l."assignedMobile",
        l."assignedEmail",
        l."routingWhatsapp",
        l."routingReason",
        l."emailStatus",
        l."emailMessageId",
        l."emailSentAt",
        l."emailLastAttemptAt",
        l."emailRetryCount",
        l."emailRetryHistory",
        l."emailLastError",
        l."emailNextRetryAt",
        l."servicePayload",
        l."campaignData",
        l."createdAt",
        l."updatedAt",
        l."status",
        s."name" AS "serviceName",
        s."slug" AS "serviceSlug"
      FROM "Lead" l
      JOIN "Service" s ON s."id" = l."serviceId"
      WHERE l."id" = ${id} OR l."requestId" = ${id}
      LIMIT 1
    `,
    prisma.$queryRaw<RawLeadActivity[]>`
      SELECT "id", "type", "message", "metadata", "createdAt"
      FROM "LeadActivity"
      WHERE "leadId" IN (SELECT "id" FROM "Lead" WHERE "id" = ${id} OR "requestId" = ${id})
      ORDER BY "createdAt" DESC
    `,
    prisma.$queryRaw<RawLeadAssignment[]>`
      SELECT "id", "ownerName", "mobile", "email", "createdAt"
      FROM "LeadAssignment"
      WHERE "leadId" IN (SELECT "id" FROM "Lead" WHERE "id" = ${id} OR "requestId" = ${id})
      ORDER BY "createdAt" DESC
    `,
    prisma.$queryRaw<RawLeadFollowup[]>`
      SELECT
        "id",
        "type",
        "status",
        "priority",
        "dueAt",
        "notes",
        "completed",
        "completedAt",
        "ownerName",
        "assignedMobile",
        "assignedEmail",
        "createdAt"
      FROM "Followup"
      WHERE "leadId" IN (SELECT "id" FROM "Lead" WHERE "id" = ${id} OR "requestId" = ${id})
      ORDER BY "dueAt" ASC, "createdAt" DESC
    `,
    prisma.$queryRaw<RawLeadNote[]>`
      SELECT "id", "note", "createdAt"
      FROM "LeadNote"
      WHERE "leadId" IN (SELECT "id" FROM "Lead" WHERE "id" = ${id} OR "requestId" = ${id})
      ORDER BY "createdAt" DESC
    `,
  ])

  const lead = leadRows[0]
  if (!lead) return null

  return {
    id: lead.id,
    requestId: lead.requestId,
    fullName: lead.fullName,
    mobile: lead.mobile,
    whatsapp: lead.whatsapp,
    email: lead.email,
    company: lead.company,
    city: lead.city,
    message: lead.message,
    submissionType: lead.submissionType,
    source: lead.source,
    ctaType: lead.ctaType,
    assignedMobile: lead.assignedMobile,
    assignedEmail: lead.assignedEmail,
    routingWhatsapp: lead.routingWhatsapp,
    routingReason: lead.routingReason,
    emailStatus: lead.emailStatus ?? "PENDING",
    emailMessageId: lead.emailMessageId,
    emailSentAt: lead.emailSentAt,
    emailLastAttemptAt: lead.emailLastAttemptAt,
    emailRetryCount: lead.emailRetryCount ?? 0,
    emailRetryHistory: Array.isArray(lead.emailRetryHistory) ? lead.emailRetryHistory : [],
    emailLastError: lead.emailLastError,
    emailNextRetryAt: lead.emailNextRetryAt,
    servicePayload: recordFromUnknown(lead.servicePayload),
    campaignData: recordFromUnknown(lead.campaignData),
    createdAt: lead.createdAt,
    updatedAt: lead.updatedAt,
    status: lead.status.replaceAll("_", " "),
    serviceName: lead.serviceName,
    serviceSlug: lead.serviceSlug,
    activities: activities.map((item) => ({
      ...item,
      metadata: recordFromUnknown(item.metadata),
    })),
    assignments,
    followups,
    notes,
  }
}

function formatRelativeLeadTime(date: Date) {
  const diffMinutes = Math.max(1, Math.round((Date.now() - date.getTime()) / 60000))
  if (diffMinutes < 60) return `${diffMinutes} mins ago`
  const diffHours = Math.round(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours} hrs ago`
  return `${Math.round(diffHours / 24)} days ago`
}
