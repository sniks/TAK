import { Resend } from "resend"

import { prisma } from "@/lib/db"

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export type LeadNotificationEmailInput = {
  to: string | string[]
  cc?: string | string[]
  replyTo?: string
  bcc?: string | string[]
  subject: string
  text: string
  html: string
}

type EmailConfiguration = {
  from: string
  replyTo?: string
  bcc: string[]
  cc: string[]
  enableBcc: boolean
}

function normalizeRecipients(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter(Boolean)
  }

  if (typeof value === "string") {
    return value
      .split(/[,\n;]/)
      .map((item) => item.trim())
      .filter(Boolean)
  }

  return []
}

function mergeRecipients(...groups: Array<string | string[] | undefined>) {
  return Array.from(new Set(groups.flatMap((group) => normalizeRecipients(group))))
}

export async function getEmailConfiguration(): Promise<EmailConfiguration> {
  const raw = await prisma.setting.findUnique({ where: { key: "email_settings" } })
  const value = (raw?.value ?? {}) as Record<string, unknown>

  const envBcc = normalizeRecipients(process.env.EMAIL_BCC)
  const envCc = normalizeRecipients(process.env.EMAIL_CC)

  return {
    from:
      (typeof value.from === "string" && value.from.trim()) ||
      process.env.EMAIL_FROM?.trim() ||
      process.env.RESEND_FROM_EMAIL?.trim() ||
      "Taakshvi Solution Hub <onboarding@resend.dev>",
    replyTo:
      (typeof value.replyTo === "string" && value.replyTo.trim()) ||
      process.env.EMAIL_REPLY_TO?.trim() ||
      undefined,
    bcc: normalizeRecipients(value.bcc).length ? normalizeRecipients(value.bcc) : envBcc,
    cc: normalizeRecipients(value.cc).length ? normalizeRecipients(value.cc) : envCc,
    enableBcc: typeof value.enableBcc === "boolean" ? value.enableBcc : true,
  }
}

export async function sendLeadNotificationEmail(input: LeadNotificationEmailInput) {
  const config = await getEmailConfiguration()

  if (!resend) {
    return {
      sent: false,
      skipped: true,
      message: "RESEND_API_KEY is not configured.",
      providerResponse: null,
    } as const
  }

  const cc = mergeRecipients(config.cc, input.cc)
  const bcc = config.enableBcc ? mergeRecipients(config.bcc, input.bcc) : []
  const replyTo = input.replyTo || config.replyTo

  const response = await resend.emails.send({
    from: config.from,
    to: input.to,
    cc: cc.length ? cc : undefined,
    replyTo,
    bcc: bcc.length ? bcc : undefined,
    subject: input.subject,
    text: input.text,
    html: input.html,
  })

  if (response.error) {
    return {
      sent: false,
      skipped: false,
      message: response.error.message || "Resend returned an error response.",
      providerResponse: response,
    } as const
  }

  return {
    sent: Boolean(response.data?.id),
    skipped: false,
    id: response.data?.id ?? null,
    message: response.data?.id ? "Email accepted by Resend." : "Resend did not return a message id.",
    providerResponse: response,
    cc,
    bcc,
    replyTo: replyTo ?? null,
    from: config.from,
  } as const
}
