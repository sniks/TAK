"use server"

import { submitEnquiry, type EnquirySubmissionResult } from "@/server/enquiry-submission"
import { leadFormSchema } from "@/lib/validations"
import { assignLeadOwnerFromDatabase } from "@/lib/lead-routing"
import { prisma } from "@/lib/db"
import { defaultLeadOwner } from "@/lib/routing-config"

export type LeadActionState = EnquirySubmissionResult

export async function createLead(
  _previousState: LeadActionState,
  formData: FormData
): Promise<LeadActionState> {
  const payload = Object.fromEntries(formData.entries())
  const servicePayload: Record<string, string> = {}

  for (const [key, value] of formData.entries()) {
    if (key.startsWith("question:") && typeof value === "string") {
      servicePayload[key.replace("question:", "")] = value
    }
  }

  return submitEnquiry({
    requestId: typeof payload.requestId === "string" ? payload.requestId : undefined,
    fullName: typeof payload.fullName === "string" ? payload.fullName : "",
    mobile: typeof payload.mobile === "string" ? payload.mobile : "",
    whatsapp: typeof payload.whatsapp === "string" ? payload.whatsapp : undefined,
    email: typeof payload.email === "string" ? payload.email : "",
    company: typeof payload.company === "string" ? payload.company : undefined,
    city: typeof payload.city === "string" ? payload.city : "",
    service: typeof payload.service === "string" ? payload.service : "",
    message: typeof payload.message === "string" ? payload.message : "",
    submissionType:
      payload.submissionType === "whatsapp" || payload.submissionType === "callback"
        ? payload.submissionType
        : "callback",
    consentAccepted: "on" as const,
    servicePayload,
  })

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Please check the form details.",
    }
  }

  if (!process.env.DATABASE_URL) {
    return {
      ok: true,
      message: `Your enquiry is ready to route to ${defaultLeadOwner.mobile}. Configure DATABASE_URL to persist submissions.`,
    }
  }

  const owner = await assignLeadOwnerFromDatabase({
    service: parsed.data.service,
    city: parsed.data.city,
  })

  const service = await prisma.service.findUnique({ where: { slug: parsed.data.service } })

  if (!service) {
    return {
      ok: false,
      message: "Please select a valid service.",
    }
  }

  await prisma.lead.create({
    data: {
      fullName: parsed.data.fullName,
      mobile: parsed.data.mobile,
      whatsapp: parsed.data.whatsapp || null,
      email: parsed.data.email,
      company: parsed.data.company || null,
      city: parsed.data.city,
      servicePayload: parsed.data.servicePayload,
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
          message: `Lead routed through ${owner.reason}`,
          metadata: owner,
        },
      },
    },
  })

  return {
    ok: true,
    message: "Your enquiry has been received. Our team will contact you shortly.",
  }
}
