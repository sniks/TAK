import { Prisma } from "@prisma/client"

import { sendLeadNotificationEmail } from "@/lib/email"
import { prisma } from "@/lib/db"
import { assignLeadOwnerFromDatabase } from "@/lib/lead-routing"
import { defaultLeadOwner } from "@/lib/routing-config"
import { getServiceBySlug } from "@/lib/site"
import { type EnquiryFormInput, enquiryFormSchema } from "@/lib/validations"

type SubmissionType = "callback" | "whatsapp" | "email" | "call"
type EmailStatus = "PENDING" | "SENT" | "DELIVERED" | "FAILED" | "RETRYING"

export type EnquirySubmissionResult = {
  ok: boolean
  message: string
  requestId?: string
  submissionType?: SubmissionType
  redirectUrl?: string
  warning?: string
}

type ServiceRecord = {
  id: string
  name: string
  slug: string
  description: string
  serviceEmail: string | null
  serviceWhatsappNumber: string | null
}

type LeadOwner = {
  mobile: string
  whatsapp: string
  email: string
  reason: string
}

type ContactTargets = {
  serviceEmail: string
  cc?: string | string[]
  whatsappNumber: string
  callNumber: string
}

type LeadContext = {
  leadId: string
  requestId: string
  service: ServiceRecord
  owner: LeadOwner
  duplicate?: boolean
  shouldAttemptEmail?: boolean
}

type EmailRetryHistoryEntry = {
  attempt: number
  status: "sent" | "failed" | "retrying"
  timestamp: string
  error?: string
}

type RetryLeadRow = {
  id: string
  requestId: string | null
  fullName: string
  mobile: string
  email: string
  city: string
  message: string | null
  submissionType: string
  source: string
  ctaType: string | null
  servicePayload: Prisma.JsonValue
  campaignData: Prisma.JsonValue | null
  assignedMobile: string
  assignedEmail: string
  routingWhatsapp: string | null
  routingReason: string | null
  emailRetryCount: number
  emailRetryHistory: Prisma.JsonValue | null
  serviceName: string
  serviceEmail: string | null
  serviceWhatsappNumber: string | null
}

const retryMinutes = [1, 5, 15] as const

function normalizeWhatsAppNumber(value: string) {
  const digits = value.replace(/\D/g, "")
  if (!digits) return ""
  if (digits.length === 10) return `91${digits}`
  return digits
}

function appendRetryHistory(currentValue: Prisma.JsonValue | null, entry: EmailRetryHistoryEntry): Prisma.InputJsonValue {
  const existing = Array.isArray(currentValue) ? currentValue : []
  return [...existing, entry] as Prisma.InputJsonValue
}

function jsonRecord(value: Prisma.JsonValue | null | undefined) {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, string>) : {}
}

function buildWhatsAppMessage(input: {
  requestId: string
  name: string
  phone: string
  service: string
  city: string
  message: string
  servicePayload: Record<string, string>
}) {
  const dynamicDetails = Object.entries(input.servicePayload)
    .filter(([, value]) => value.trim().length > 0)
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n")

  return encodeURIComponent(
    [
      "Hello Team,",
      "",
      `I am interested in ${input.service}.`,
      "",
      `Lead ID: ${input.requestId}`,
      `Name: ${input.name}`,
      `Mobile: ${input.phone}`,
      `City: ${input.city}`,
      "",
      "Requirements:",
      input.message,
      ...(dynamicDetails ? ["", dynamicDetails] : []),
      "",
      "Please contact me.",
      "",
      "Thank You.",
    ].join("\n")
  )
}

function buildWhatsAppUrl(number: string, message: string) {
  const normalized = normalizeWhatsAppNumber(number)
  if (!normalized) return null
  return `https://wa.me/${normalized}?text=${message}`
}

function buildEmailText(input: {
  requestId: string
  submissionType: SubmissionType
  source: string
  ctaType?: string
  name: string
  phone: string
  email: string
  service: string
  city: string
  message: string
  routingReason: string
  servicePayload: Record<string, string>
  campaignData: Record<string, string>
}) {
  const dynamicFields = Object.entries(input.servicePayload)
    .filter(([, value]) => value.trim().length > 0)
    .map(([label, value]) => `${label}: ${value}`)
  const campaignFields = Object.entries(input.campaignData)
    .filter(([, value]) => value.trim().length > 0)
    .map(([label, value]) => `${label}: ${value}`)

  return [
    "New Website Enquiry",
    "",
    `Request ID: ${input.requestId}`,
    `Submission Type: ${input.submissionType}`,
    `Source: ${input.source}`,
    `CTA Type: ${input.ctaType ?? "Website Form"}`,
    `Routing: ${input.routingReason}`,
    "",
    `Name: ${input.name}`,
    `Phone: ${input.phone}`,
    `Email: ${input.email}`,
    `City: ${input.city}`,
    "",
    `Service: ${input.service}`,
    "",
    "Message:",
    input.message,
    ...(dynamicFields.length ? ["", "Dynamic Service Details:", ...dynamicFields] : []),
    ...(campaignFields.length ? ["", "Campaign Data:", ...campaignFields] : []),
  ].join("\n")
}

function buildEmailHtml(input: {
  requestId: string
  submissionType: SubmissionType
  source: string
  ctaType?: string
  name: string
  phone: string
  email: string
  service: string
  city: string
  message: string
  routingReason: string
  servicePayload: Record<string, string>
  campaignData: Record<string, string>
}) {
  const dynamicFields = Object.entries(input.servicePayload).filter(([, value]) => value.trim().length > 0)
  const campaignFields = Object.entries(input.campaignData).filter(([, value]) => value.trim().length > 0)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://taakshvisolutionhub.com"
  const leadUrl = `${siteUrl}/admin/leads/${input.requestId}`
  const callHref = `tel:${input.phone}`
  const replyHref = `mailto:${input.email}?subject=${encodeURIComponent(`Re: ${input.service} enquiry`)}`

  return `
    <div style="background:#f8fafc;padding:24px;font-family:Arial,sans-serif;line-height:1.6;color:#0f172a">
      <div style="max-width:720px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:20px;overflow:hidden">
        <div style="padding:24px 28px;background:linear-gradient(135deg,#0a165c,#1b2f8a);color:#ffffff">
          <div style="font-size:14px;letter-spacing:0.08em;text-transform:uppercase;opacity:0.8">Taakshvi Solution Hub</div>
          <h2 style="margin:8px 0 4px;font-size:28px;line-height:1.2">New Website Enquiry</h2>
          <div style="font-size:14px;opacity:0.92">Lead ID ${input.requestId} | ${input.submissionType}</div>
        </div>
        <div style="padding:28px">
          <div style="margin:0 0 20px;padding:16px;border-radius:16px;background:#fff7fb;border:1px solid #fbcfe8">
            <div style="font-size:13px;font-weight:700;color:#db2777;text-transform:uppercase;letter-spacing:0.08em">Lead Information</div>
            <div style="margin-top:12px">
              <p style="margin:0 0 8px"><strong>Name:</strong> ${input.name}</p>
              <p style="margin:0 0 8px"><strong>Phone:</strong> ${input.phone}</p>
              <p style="margin:0 0 8px"><strong>Email:</strong> ${input.email}</p>
              <p style="margin:0 0 8px"><strong>City:</strong> ${input.city}</p>
              <p style="margin:0 0 8px"><strong>Service:</strong> ${input.service}</p>
              <p style="margin:0 0 8px"><strong>Source:</strong> ${input.source}</p>
              <p style="margin:0 0 8px"><strong>CTA Type:</strong> ${input.ctaType ?? "Website Form"}</p>
              <p style="margin:0"><strong>Routing:</strong> ${input.routingReason}</p>
            </div>
          </div>
          <div style="margin:0 0 20px;padding:16px;border-radius:16px;background:#f8fafc;border:1px solid #e2e8f0">
            <div style="font-size:13px;font-weight:700;color:#0f172a;text-transform:uppercase;letter-spacing:0.08em">Requirement Details</div>
            <div style="margin-top:12px;white-space:pre-wrap">${input.message}</div>
          </div>
          ${dynamicFields.length ? `
          <div style="margin:0 0 20px;padding:16px;border-radius:16px;background:#f0fdf4;border:1px solid #bbf7d0">
            <div style="font-size:13px;font-weight:700;color:#166534;text-transform:uppercase;letter-spacing:0.08em">Service Information</div>
            <div style="margin-top:12px">
              ${dynamicFields.map(([label, value]) => `<p style="margin:0 0 8px"><strong>${label}:</strong> ${value}</p>`).join("")}
            </div>
          </div>` : ""}
          ${campaignFields.length ? `
          <div style="margin:0 0 20px;padding:16px;border-radius:16px;background:#eff6ff;border:1px solid #bfdbfe">
            <div style="font-size:13px;font-weight:700;color:#1d4ed8;text-transform:uppercase;letter-spacing:0.08em">Campaign Data</div>
            <div style="margin-top:12px">
              ${campaignFields.map(([label, value]) => `<p style="margin:0 0 8px"><strong>${label}:</strong> ${value}</p>`).join("")}
            </div>
          </div>` : ""}
          <div style="display:flex;flex-wrap:wrap;gap:12px;margin-top:24px">
            <a href="${leadUrl}" style="display:inline-block;padding:12px 18px;border-radius:999px;background:#0a165c;color:#ffffff;text-decoration:none;font-weight:700">Open Lead</a>
            <a href="${callHref}" style="display:inline-block;padding:12px 18px;border-radius:999px;background:#16a34a;color:#ffffff;text-decoration:none;font-weight:700">Call Lead</a>
            <a href="${replyHref}" style="display:inline-block;padding:12px 18px;border-radius:999px;background:#db2777;color:#ffffff;text-decoration:none;font-weight:700">Reply</a>
          </div>
        </div>
      </div>
    </div>
  `
}

function buildEmailRedirect(input: {
  email: string
  serviceName: string
  requestId: string
  fullName: string
  mobile: string
  city: string
  message: string
}) {
  const subject = encodeURIComponent(`Service Enquiry - ${input.serviceName}`)
  const body = encodeURIComponent(
    [
      "Hello Team,",
      "",
      `Lead ID: ${input.requestId}`,
      `Name: ${input.fullName}`,
      `Mobile: ${input.mobile}`,
      `City: ${input.city}`,
      `Service: ${input.serviceName}`,
      "",
      "Requirement:",
      input.message,
    ].join("\n")
  )
  return `mailto:${input.email}?subject=${subject}&body=${body}`
}

function buildCallRedirect(number: string) {
  const normalized = number.replace(/[^\d+]/g, "")
  return normalized ? `tel:${normalized}` : null
}

function getRetrySchedule(retryCount: number) {
  return retryMinutes[retryCount - 1] ?? null
}

function isUniqueConstraintError(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002"
}

async function resolveService(slug: string) {
  const existing = await prisma.service.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      serviceEmail: true,
      serviceWhatsappNumber: true,
    },
  })

  if (existing) {
    return existing
  }

  const fallback = getServiceBySlug(slug)
  if (!fallback) {
    return null
  }

  try {
    return await prisma.service.create({
      data: {
        name: fallback.name,
        slug: fallback.slug,
        description: fallback.summary,
        serviceEmail: defaultLeadOwner.email,
        serviceWhatsappNumber: defaultLeadOwner.whatsapp,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        serviceEmail: true,
        serviceWhatsappNumber: true,
      },
    })
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return prisma.service.findUnique({
        where: { slug },
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          serviceEmail: true,
          serviceWhatsappNumber: true,
        },
      })
    }

    throw error
  }
}

function resolveContactTargets(service: ServiceRecord, owner: LeadOwner): ContactTargets {
  const serviceEmail = owner.email?.trim() || service.serviceEmail?.trim() || defaultLeadOwner.email
  const ownerCc =
    service.serviceEmail &&
    service.serviceEmail.trim() &&
    service.serviceEmail.trim().toLowerCase() !== serviceEmail.toLowerCase()
      ? service.serviceEmail.trim()
      : undefined

  return {
    serviceEmail,
    cc: ownerCc,
    whatsappNumber:
      owner.whatsapp?.trim() ||
      owner.mobile.trim() ||
      service.serviceWhatsappNumber?.trim() ||
      defaultLeadOwner.whatsapp,
    callNumber: owner.mobile?.trim() || defaultLeadOwner.mobile,
  }
}

async function syncLeadTrackingFields(leadId: string, input: EnquiryFormInput, owner: LeadOwner) {
  await prisma.lead.update({
    where: { id: leadId },
    data: {
      ctaType: input.ctaType ?? null,
      campaignData: input.campaignData as Prisma.InputJsonValue,
      routingWhatsapp: owner.whatsapp,
      routingReason: owner.reason,
      emailStatus: "PENDING",
      emailRetryCount: 0,
      emailRetryHistory: [] as Prisma.InputJsonValue,
      emailLastError: null,
      emailNextRetryAt: null,
    },
  })
}

async function createTrackedFollowup(leadId: string, owner: LeadOwner, source: string) {
  const followup = await prisma.followup.create({
    data: {
      leadId,
      dueAt: new Date(),
      notes: `Auto-created from ${source}`,
      completed: false,
    },
    select: { id: true },
  })

  await prisma.followup.update({
    where: { id: followup.id },
    data: {
      type: "Initial Contact",
      status: "Pending",
      priority: "High",
      ownerName: owner.reason,
      assignedMobile: owner.mobile,
      assignedEmail: owner.email,
      completedAt: null,
    },
  })
}

async function createStoredLead(input: EnquiryFormInput): Promise<LeadContext | null> {
  const service = await resolveService(input.service)
  if (!service) {
    return null
  }

  const owner = await assignLeadOwnerFromDatabase({ service: service.slug, city: input.city })
  const requestId = input.requestId ?? crypto.randomUUID()

  try {
    const createdLead = await prisma.lead.create({
      data: {
        requestId,
        fullName: input.fullName,
        mobile: input.mobile,
        whatsapp: input.whatsapp || input.mobile,
        email: input.email,
        company: input.company || null,
        city: input.city,
        message: input.message,
        submissionType: input.submissionType,
        servicePayload: input.servicePayload as Prisma.InputJsonValue,
        consentAccepted: true,
        source: input.source,
        assignedMobile: owner.mobile,
        assignedEmail: owner.email,
        service: { connect: { id: service.id } },
        assignments: {
          create: {
            mobile: owner.mobile,
            email: owner.email,
            ownerName: owner.reason,
          },
        },
        activities: {
          create: {
            type: "LEAD_CREATED",
            message: `Lead submitted as ${input.submissionType}`,
            metadata: {
              source: input.source,
              ctaType: input.ctaType ?? null,
              routingReason: owner.reason,
              campaignData: input.campaignData,
            } as Prisma.InputJsonValue,
          },
        },
      },
      select: { id: true, requestId: true },
    })

    await syncLeadTrackingFields(createdLead.id, input, owner)
    await createTrackedFollowup(createdLead.id, owner, input.source)
    await prisma.leadActivity.create({
      data: {
        leadId: createdLead.id,
        type: "FOLLOWUP_CREATED",
        message: "Automatic initial follow-up created",
        metadata: {
          type: "Initial Contact",
          status: "Pending",
          priority: "High",
        } as Prisma.InputJsonValue,
      },
    })

    return {
      leadId: createdLead.id,
      requestId: createdLead.requestId ?? requestId,
      service,
      owner,
    }
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      const existing = await prisma.lead.findUnique({
        where: { requestId },
        select: { id: true, requestId: true, emailStatus: true },
      })
      if (existing) {
        return {
          leadId: existing.id,
          requestId: existing.requestId ?? requestId,
          service,
          owner,
          duplicate: true,
          shouldAttemptEmail: existing.emailStatus !== "SENT" && existing.emailStatus !== "DELIVERED",
        }
      }
    }

    throw error
  }
}

async function getLeadRetryHistory(leadId: string) {
  const rows = await prisma.$queryRaw<Array<{ emailRetryHistory: Prisma.JsonValue | null }>>`
    SELECT "emailRetryHistory"
    FROM "Lead"
    WHERE "id" = ${leadId}
    LIMIT 1
  `
  return rows[0]?.emailRetryHistory ?? null
}

async function updateLeadEmailState(input: {
  leadId: string
  status: EmailStatus
  retryCount: number
  messageId?: string | null
  providerResponse?: unknown
  error?: string | null
  nextRetryAt?: Date | null
  retryHistory: Prisma.InputJsonValue
  activityType: string
  activityMessage: string
  activityMetadata: Prisma.InputJsonValue
}) {
  await prisma.lead.update({
    where: { id: input.leadId },
    data: {
      emailStatus: input.status,
      emailMessageId: input.messageId ?? null,
      emailProviderResponse: (input.providerResponse ?? null) as Prisma.InputJsonValue,
      emailSentAt: input.status === "SENT" ? new Date() : null,
      emailLastAttemptAt: new Date(),
      emailRetryCount: input.retryCount,
      emailRetryHistory: input.retryHistory,
      emailLastError: input.error ?? null,
      emailNextRetryAt: input.nextRetryAt ?? null,
    },
  })

  await prisma.leadActivity.create({
    data: {
      leadId: input.leadId,
      type: input.activityType,
      message: input.activityMessage,
      metadata: input.activityMetadata,
    },
  })
}

async function persistEmailSuccess(leadId: string, messageId: string | null | undefined, providerResponse: unknown, attempt: number) {
  const retryHistory = appendRetryHistory(await getLeadRetryHistory(leadId), {
    attempt,
    status: "sent",
    timestamp: new Date().toISOString(),
  })

  await updateLeadEmailState({
    leadId,
    status: "SENT",
    retryCount: Math.max(0, attempt - 1),
    messageId: messageId ?? null,
    providerResponse,
    retryHistory,
    activityType: "EMAIL_SENT",
    activityMessage: attempt > 1 ? "Queued email retry succeeded" : "Lead notification email sent via Resend",
    activityMetadata: {
      messageId: messageId ?? null,
      attempt,
    } as Prisma.InputJsonValue,
  })
}

async function persistEmailFailure(leadId: string, error: string, retryCount: number) {
  const nextRetryMinutes = getRetrySchedule(retryCount)
  const nextRetryAt = nextRetryMinutes ? new Date(Date.now() + nextRetryMinutes * 60_000) : null
  const status: EmailStatus = nextRetryAt ? "RETRYING" : "FAILED"
  const retryHistory = appendRetryHistory(await getLeadRetryHistory(leadId), {
    attempt: retryCount,
    status: nextRetryAt ? "retrying" : "failed",
    timestamp: new Date().toISOString(),
    error,
  })

  await updateLeadEmailState({
    leadId,
    status,
    retryCount,
    error,
    nextRetryAt,
    retryHistory,
    activityType: nextRetryAt ? "EMAIL_RETRY_SCHEDULED" : "EMAIL_FAILED",
    activityMessage: nextRetryAt ? `Email failed. Retry scheduled in ${nextRetryMinutes} minute(s).` : "Email failed after final retry.",
    activityMetadata: {
      error,
      retryCount,
      nextRetryAt: nextRetryAt?.toISOString() ?? null,
    } as Prisma.InputJsonValue,
  })
}

async function sendEnquiryEmail(input: {
  leadId: string
  requestId: string
  submissionType: SubmissionType
  source: string
  ctaType?: string
  service: ServiceRecord
  owner: LeadOwner
  targets: ContactTargets
  fullName: string
  mobile: string
  email: string
  city: string
  message: string
  servicePayload: Record<string, string>
  campaignData: Record<string, string>
  attempt: number
}) {
  const text = buildEmailText({
    requestId: input.requestId,
    submissionType: input.submissionType,
    source: input.source,
    ctaType: input.ctaType,
    name: input.fullName,
    phone: input.mobile,
    email: input.email,
    service: input.service.name,
    city: input.city,
    message: input.message,
    routingReason: input.owner.reason,
    servicePayload: input.servicePayload,
    campaignData: input.campaignData,
  })

  const html = buildEmailHtml({
    requestId: input.requestId,
    submissionType: input.submissionType,
    source: input.source,
    ctaType: input.ctaType,
    name: input.fullName,
    phone: input.mobile,
    email: input.email,
    service: input.service.name,
    city: input.city,
    message: input.message,
    routingReason: input.owner.reason,
    servicePayload: input.servicePayload,
    campaignData: input.campaignData,
  })

  try {
    const result = await sendLeadNotificationEmail({
      to: input.targets.serviceEmail,
      cc: input.targets.cc,
      replyTo: input.email,
      subject: `New Enquiry - ${input.service.name}`,
      text,
      html,
    })

    if (result.sent) {
      await persistEmailSuccess(input.leadId, result.id, result.providerResponse ?? null, input.attempt)
      return { sent: true, skipped: result.skipped }
    }

    await persistEmailFailure(input.leadId, "Resend email send returned unsuccessful response.", input.attempt)
    return { sent: false, skipped: false }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown email error"
    await persistEmailFailure(input.leadId, message, input.attempt)
    return { sent: false, skipped: false }
  }
}

function buildRedirectUrl(input: {
  submissionType: SubmissionType
  requestId: string
  service: ServiceRecord
  targets: ContactTargets
  fullName: string
  mobile: string
  city: string
  message: string
  servicePayload: Record<string, string>
}) {
  if (input.submissionType === "callback") return null
  if (input.submissionType === "whatsapp") {
    return buildWhatsAppUrl(
      input.targets.whatsappNumber,
      buildWhatsAppMessage({
        requestId: input.requestId,
        name: input.fullName,
        phone: input.mobile,
        service: input.service.name,
        city: input.city,
        message: input.message,
        servicePayload: input.servicePayload,
      })
    )
  }
  if (input.submissionType === "email") {
    return buildEmailRedirect({
      email: input.targets.serviceEmail,
      serviceName: input.service.name,
      requestId: input.requestId,
      fullName: input.fullName,
      mobile: input.mobile,
      city: input.city,
      message: input.message,
    })
  }
  return buildCallRedirect(input.targets.callNumber)
}

export async function submitEnquiry(input: EnquiryFormInput): Promise<EnquirySubmissionResult> {
  const parsed = enquiryFormSchema.safeParse(input)
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Please check the form details.",
    }
  }

  const stored = await createStoredLead(parsed.data)
  if (!stored) {
    return { ok: false, message: "Please select a valid service." }
  }

  const targets = resolveContactTargets(stored.service, stored.owner)
  const redirectUrl = buildRedirectUrl({
    submissionType: parsed.data.submissionType,
    requestId: stored.requestId,
    service: stored.service,
    targets,
    fullName: parsed.data.fullName,
    mobile: parsed.data.mobile,
    city: parsed.data.city,
    message: parsed.data.message,
    servicePayload: parsed.data.servicePayload,
  })

  if (parsed.data.submissionType !== "callback" && !redirectUrl) {
    return {
      ok: false,
      message:
        parsed.data.submissionType === "whatsapp"
          ? "WhatsApp number is not configured for this service yet."
          : parsed.data.submissionType === "call"
            ? "Call routing is not configured for this service yet."
            : "Email routing is not configured for this service yet.",
    }
  }

  let warning: string | undefined
  if (!stored.duplicate || stored.shouldAttemptEmail) {
    const emailResult = await sendEnquiryEmail({
      leadId: stored.leadId,
      requestId: stored.requestId,
      submissionType: parsed.data.submissionType,
      source: parsed.data.source,
      ctaType: parsed.data.ctaType,
      service: stored.service,
      owner: stored.owner,
      targets,
      fullName: parsed.data.fullName,
      mobile: parsed.data.mobile,
      email: parsed.data.email,
      city: parsed.data.city,
      message: parsed.data.message,
      servicePayload: parsed.data.servicePayload,
      campaignData: parsed.data.campaignData,
      attempt: 1,
    })

    if (!emailResult.sent) {
      warning = "We saved your enquiry, but the lead email is queued for retry."
    } else if (emailResult.skipped) {
      warning = "Lead email configuration is incomplete. The enquiry was still saved."
    }
  }

  return {
    ok: true,
    requestId: stored.requestId,
    submissionType: parsed.data.submissionType,
    redirectUrl: redirectUrl ?? undefined,
    message:
      parsed.data.submissionType === "callback"
        ? "Your enquiry has been received. Our team will contact you shortly."
        : stored.duplicate
          ? "Your enquiry has already been saved. Opening the selected contact path now."
          : "Your enquiry has been saved. Opening the selected contact path now.",
    warning,
  }
}

export async function processQueuedLeadEmailRetries(limit = 20) {
  const leads = await prisma.$queryRaw<RetryLeadRow[]>`
    SELECT
      l."id",
      l."requestId",
      l."fullName",
      l."mobile",
      l."email",
      l."city",
      l."message",
      l."submissionType",
      l."source",
      l."ctaType",
      l."servicePayload",
      l."campaignData",
      l."assignedMobile",
      l."assignedEmail",
      l."routingWhatsapp",
      l."routingReason",
      l."emailRetryCount",
      l."emailRetryHistory",
      s."name" AS "serviceName",
      s."serviceEmail" AS "serviceEmail",
      s."serviceWhatsappNumber" AS "serviceWhatsappNumber"
    FROM "Lead" l
    JOIN "Service" s ON s."id" = l."serviceId"
    WHERE l."emailStatus" = ${"RETRYING" as EmailStatus}
      AND l."emailNextRetryAt" <= ${new Date()}
    ORDER BY l."emailNextRetryAt" ASC
    LIMIT ${limit}
  `

  for (const lead of leads) {
    const owner: LeadOwner = {
      mobile: lead.assignedMobile,
      whatsapp: lead.routingWhatsapp || lead.assignedMobile,
      email: lead.assignedEmail,
      reason: lead.routingReason || "Retry routing",
    }
    const service: ServiceRecord = {
      id: "",
      name: lead.serviceName,
      slug: "",
      description: "",
      serviceEmail: lead.serviceEmail,
      serviceWhatsappNumber: lead.serviceWhatsappNumber,
    }

    await sendEnquiryEmail({
      leadId: lead.id,
      requestId: lead.requestId ?? lead.id,
      submissionType: lead.submissionType as SubmissionType,
      source: lead.source,
      ctaType: lead.ctaType ?? undefined,
      service,
      owner,
      targets: resolveContactTargets(service, owner),
      fullName: lead.fullName,
      mobile: lead.mobile,
      email: lead.email,
      city: lead.city,
      message: lead.message ?? "",
      servicePayload: jsonRecord(lead.servicePayload),
      campaignData: jsonRecord(lead.campaignData),
      attempt: lead.emailRetryCount + 1,
    })
  }

  return { processed: leads.length }
}
