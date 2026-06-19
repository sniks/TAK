import { Resend } from "resend"

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export type LeadNotificationEmailInput = {
  to: string
  replyTo?: string
  bcc?: string | string[]
  subject: string
  text: string
  html: string
}

export async function sendLeadNotificationEmail(input: LeadNotificationEmailInput) {
  if (!resend) {
    return {
      sent: false,
      skipped: true,
      message: "RESEND_API_KEY is not configured.",
    } as const
  }

  const from = process.env.RESEND_FROM_EMAIL?.trim() || "Taakshvi Solution Hub <onboarding@resend.dev>"

  const response = await resend.emails.send({
    from,
    to: input.to,
    replyTo: input.replyTo,
    bcc: input.bcc,
    subject: input.subject,
    text: input.text,
    html: input.html,
  })

  return {
    sent: true,
    skipped: false,
    id: response.data?.id ?? null,
    response,
  } as const
}
