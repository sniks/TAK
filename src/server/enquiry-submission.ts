import { Prisma } from "@prisma/client"

import { sendLeadNotificationEmail } from "@/lib/email"
import { prisma } from "@/lib/db"
import { assignLeadOwnerFromDatabase } from "@/lib/lead-routing"
import { defaultLeadOwner } from "@/lib/routing-config"
import { type EnquiryFormInput, enquiryFormSchema } from "@/lib/validations"

export type EnquirySubmissionResult = {
  ok: boolean
  message: string
  requestId?: string
  submissionType?: "callback" | "whatsapp"
  redirectUrl?: string
  warning?: string
}

type StoredEnquiry =
  | {
      ok: true
      service: {
        name: string
        slug: string
        description: string
        serviceEmail: string | null
        serviceWhatsappNumber: string | null
      }
      owner: {
        mobile: string
        whatsapp: string
        email: string
        reason: string
      }
      requestId: string
      duplicate?: boolean
    }
  | {
      ok: false
      message: string
    }

function normalizeWhatsAppNumber(value: string) {
  const digits = value.replace(/\D/g, "")
  if (!digits) return ""
  if (digits.length === 10) return `91${digits}`
  return digits
}

function buildWhatsAppMessage(input: {
  name: string
  phone: string
  email: string
  service: string
  message: string
}) {
  return encodeURIComponent(
    `New Website Enquiry\n\nName: ${input.name}\nPhone: ${input.phone}\nEmail: ${input.email}\n\nService: ${input.service}\n\nMessage:\n${input.message}`
  )
}

function buildWhatsAppUrl(number: string, message: string) {
  const normalized = normalizeWhatsAppNumber(number)
  if (!normalized) return null
  return `https://wa.me/${normalized}?text=${message}`
}

function buildEmailText(input: {
  requestId: string
  submissionType: string
  name: string
  phone: string
  email: string
  service: string
  city: string
  message: string
}) {
  return [
    "New Website Enquiry",
    "",
    `Request ID: ${input.requestId}`,
    `Submission Type: ${input.submissionType}`,
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
  ].join("\n")
}

function buildEmailHtml(input: {
  requestId: string
  submissionType: string
  name: string
  phone: string
  email: string
  service: string
  city: string
  message: string
}) {
  return `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a">
      <h2 style="margin:0 0 16px">New Website Enquiry</h2>
      <p style="margin:0 0 8px"><strong>Request ID:</strong> ${input.requestId}</p>
      <p style="margin:0 0 8px"><strong>Submission Type:</strong> ${input.submissionType}</p>
      <p style="margin:0 0 8px"><strong>Name:</strong> ${input.name}</p>
      <p style="margin:0 0 8px"><strong>Phone:</strong> ${input.phone}</p>
      <p style="margin:0 0 8px"><strong>Email:</strong> ${input.email}</p>
      <p style="margin:0 0 8px"><strong>City:</strong> ${input.city}</p>
      <p style="margin:16px 0 8px"><strong>Service:</strong> ${input.service}</p>
      <p style="margin:16px 0 8px"><strong>Message:</strong></p>
      <div style="white-space:pre-wrap;background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px">${input.message}</div>
    </div>
  `
}

function isUniqueConstraintError(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002"
}

async function createStoredLead(input: EnquiryFormInput): Promise<StoredEnquiry> {
  const service = await prisma.service.findUnique({ where: { slug: input.service } })
  if (!service) {
    return { ok: false as const, message: "Please select a valid service." }
  }

  const owner = await assignLeadOwnerFromDatabase({ service: service.slug, city: input.city })
  const requestId = input.requestId ?? crypto.randomUUID()

  console.info("[enquiry] selected service", {
    slug: service.slug,
    name: service.name,
    serviceEmail: service.serviceEmail,
    serviceWhatsappNumber: service.serviceWhatsappNumber,
    submissionType: input.submissionType,
    requestId,
  })

  const leadPayload = {
    requestId,
    fullName: input.fullName,
    mobile: input.mobile,
    whatsapp: input.whatsapp || input.mobile,
    email: input.email,
    company: input.company || null,
    city: input.city,
    message: input.message,
    submissionType: input.submissionType,
    servicePayload: input.servicePayload,
    consentAccepted: true,
    assignedMobile: owner.mobile,
    assignedEmail: owner.email,
    service: {
      connectOrCreate: {
        where: { slug: service.slug },
        create: {
          name: service.name,
          slug: service.slug,
          description: service.description,
          serviceEmail: service.serviceEmail,
          serviceWhatsappNumber: service.serviceWhatsappNumber,
        },
      },
    },
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
        metadata: owner,
      },
    },
  } as const

  try {
    const createdLead = await prisma.lead.create({ data: leadPayload })
    console.info("[enquiry] database save response", {
      leadId: createdLead.id,
      requestId: createdLead.requestId,
      submissionType: createdLead.submissionType,
    })
    return { ok: true, service, owner, requestId }
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      const existing = await prisma.lead.findUnique({ where: { requestId } })
      if (existing) {
        return {
          ok: true,
          service,
          owner,
          requestId,
          duplicate: true,
        }
      }
    }

    throw error
  }
}

async function sendEnquiryEmail(input: {
  serviceName: string
  serviceEmail: string
  requestId: string
  submissionType: "callback" | "whatsapp"
  fullName: string
  mobile: string
  email: string
  city: string
  message: string
}) {
  const emailText = buildEmailText({
    requestId: input.requestId,
    submissionType: input.submissionType,
    name: input.fullName,
    phone: input.mobile,
    email: input.email,
    service: input.serviceName,
    city: input.city,
    message: input.message,
  })

  const emailHtml = buildEmailHtml({
    requestId: input.requestId,
    submissionType: input.submissionType,
    name: input.fullName,
    phone: input.mobile,
    email: input.email,
    service: input.serviceName,
    city: input.city,
    message: input.message,
  })

  const emailResult = await sendLeadNotificationEmail({
    to: input.serviceEmail,
    replyTo: input.email,
    bcc: "shloksharmax@gmail.com",
    subject: `New Enquiry - ${input.serviceName}`,
    text: emailText,
    html: emailHtml,
  })

  console.info("[enquiry] email send response", {
    requestId: input.requestId,
    submissionType: input.submissionType,
    sent: emailResult.sent,
    skipped: emailResult.skipped,
    id: emailResult.id ?? null,
    to: input.serviceEmail,
    bcc: "shloksharmax@gmail.com",
  })

  return emailResult
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

  if (!stored.ok) {
    return {
      ok: false,
      message: stored.message,
    }
  }

  if (stored.duplicate) {
    if (parsed.data.submissionType === "whatsapp") {
      const whatsappNumber =
        stored.service.serviceWhatsappNumber?.trim() ||
        stored.owner.whatsapp?.trim() ||
        stored.owner.mobile.trim()

      const redirectUrl = buildWhatsAppUrl(
        whatsappNumber,
        buildWhatsAppMessage({
          name: parsed.data.fullName,
          phone: parsed.data.mobile,
          email: parsed.data.email,
          service: stored.service.name,
          message: parsed.data.message,
        })
      )

      if (!redirectUrl) {
        return {
          ok: false,
          message: "WhatsApp number is not configured for this service yet.",
        }
      }

      console.info("[enquiry] whatsapp redirect url", {
        requestId: stored.requestId,
        whatsappNumber,
        redirectUrl,
      })

      return {
        ok: true,
        requestId: stored.requestId,
        submissionType: "whatsapp",
        redirectUrl,
        message: "Your enquiry has already been saved. Opening WhatsApp now.",
      }
    }

    return {
      ok: true,
      requestId: stored.requestId,
      submissionType: "callback",
      message: "Your enquiry has already been received. Our team will contact you shortly.",
    }
  }

  const serviceEmail =
    stored.service.serviceEmail?.trim() ||
    process.env.LEAD_NOTIFICATION_EMAIL?.trim() ||
    defaultLeadOwner.email

  console.info("[enquiry] email target resolved", {
    requestId: stored.requestId,
    serviceEmail,
    hasResendKey: Boolean(process.env.RESEND_API_KEY),
  })

  let emailResult: Awaited<ReturnType<typeof sendEnquiryEmail>> | null = null
  try {
    emailResult = await sendEnquiryEmail({
      serviceName: stored.service.name,
      serviceEmail,
      requestId: stored.requestId,
      submissionType: parsed.data.submissionType,
      fullName: parsed.data.fullName,
      mobile: parsed.data.mobile,
      email: parsed.data.email,
      city: parsed.data.city,
      message: parsed.data.message,
    })
  } catch (error) {
    console.error("[enquiry] email send failed", {
      requestId: stored.requestId,
      submissionType: parsed.data.submissionType,
      error,
    })
  }

  if (parsed.data.submissionType === "callback") {
    return {
      ok: true,
      requestId: stored.requestId,
      submissionType: "callback",
      message: "Your enquiry has been received. Our team will contact you shortly.",
      warning: emailResult?.skipped
        ? "Email notification is not configured yet."
        : emailResult
          ? undefined
          : "We saved your enquiry, but the email notification could not be sent right now.",
    }
  }

  const whatsappNumber =
    stored.service.serviceWhatsappNumber?.trim() ||
    stored.owner.whatsapp?.trim() ||
    stored.owner.mobile.trim()

  const redirectUrl = buildWhatsAppUrl(
    whatsappNumber,
    buildWhatsAppMessage({
      name: parsed.data.fullName,
      phone: parsed.data.mobile,
      email: parsed.data.email,
      service: stored.service.name,
      message: parsed.data.message,
    })
  )

  if (!redirectUrl) {
    return {
      ok: false,
      message: "WhatsApp number is not configured for this service yet.",
    }
  }

  console.info("[enquiry] whatsapp redirect url", {
    requestId: stored.requestId,
    whatsappNumber,
    redirectUrl,
  })

  return {
    ok: true,
    requestId: stored.requestId,
    submissionType: "whatsapp",
    redirectUrl,
    message: "Your enquiry has been saved. Opening WhatsApp now.",
    warning: emailResult?.skipped
      ? "Email notification is not configured yet."
      : emailResult
        ? undefined
        : "We saved your enquiry, but the email notification could not be sent right now.",
  }
}
