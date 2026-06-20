"use server"

import { submitEnquiry, type EnquirySubmissionResult } from "@/server/enquiry-submission"

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
      payload.submissionType === "whatsapp" ||
      payload.submissionType === "callback" ||
      payload.submissionType === "email" ||
      payload.submissionType === "call"
        ? payload.submissionType
        : "callback",
    source: typeof payload.source === "string" ? payload.source : "Website",
    ctaType: typeof payload.ctaType === "string" ? payload.ctaType : undefined,
    consentAccepted: "on" as const,
    servicePayload,
    campaignData: {},
  })
}
