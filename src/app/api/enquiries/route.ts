import { NextResponse } from "next/server"

import { submitEnquiry } from "@/server/enquiry-submission"

export async function POST(request: Request) {
  try {
    const payload = await request.json()
    const result = await submitEnquiry({
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
      consentAccepted: typeof payload.consentAccepted === "string" ? payload.consentAccepted : "off",
      servicePayload: (() => {
        if (!payload.servicePayload || typeof payload.servicePayload !== "object") {
          return {}
        }

        const entries = Object.entries(payload.servicePayload).filter(
          (entry): entry is [string, string] => typeof entry[1] === "string"
        )
        return Object.fromEntries(entries)
      })(),
    })

    return NextResponse.json(result, { status: result.ok ? 200 : 400 })
  } catch (error) {
    console.error("Failed to submit enquiry", error)
    return NextResponse.json(
      {
        ok: false,
        message: "We could not submit your enquiry right now. Please try again.",
      },
      { status: 500 }
    )
  }
}
