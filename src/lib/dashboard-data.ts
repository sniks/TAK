import { LeadStatus } from "@prisma/client"
import { startOfDay, subDays } from "date-fns"

import { maskRecentEnquiryName } from "@/lib/lead-routing"
import { prisma } from "@/lib/db"

export async function getRecentEnquiries(limit = 4) {
  const leads = await prisma.lead.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
    include: { service: true },
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
  const [total, todayCount, newCount, qualified, won, lost] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { createdAt: { gte: today } } }),
    prisma.lead.count({ where: { status: LeadStatus.NEW } }),
    prisma.lead.count({ where: { status: LeadStatus.QUALIFIED } }),
    prisma.lead.count({ where: { status: LeadStatus.WON } }),
    prisma.lead.count({ where: { status: LeadStatus.LOST } }),
  ])

  return {
    total,
    today: todayCount,
    new: newCount,
    qualified,
    won,
    lost,
    conversionRate: total ? Math.round((won / total) * 1000) / 10 : 0,
  }
}

export async function getLeadRows(limit = 8) {
  const leads = await prisma.lead.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
    include: { service: true },
  })

  return leads.map((lead) => ({
    id: lead.id,
    date: lead.createdAt.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
    name: lead.fullName,
    mobile: lead.mobile,
    service: lead.service.name,
    city: lead.city,
    assignedTo: lead.assignedMobile,
    status: lead.status.replaceAll("_", " "),
    source: lead.source,
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

function formatRelativeLeadTime(date: Date) {
  const diffMinutes = Math.max(1, Math.round((Date.now() - date.getTime()) / 60000))
  if (diffMinutes < 60) return `${diffMinutes} mins ago`
  const diffHours = Math.round(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours} hrs ago`
  return `${Math.round(diffHours / 24)} days ago`
}
