import { z } from "zod"

import { serviceCategories } from "@/lib/site"

const serviceSlugs = serviceCategories.map((service) => service.slug) as [string, ...string[]]
const enquirySubmissionTypes = ["callback", "whatsapp", "email", "call"] as const

export const leadFormSchema = z.object({
  requestId: z.string().uuid().optional(),
  fullName: z.string().min(2, "Full name is required").max(120),
  mobile: z.string().min(8, "Mobile number is required").max(20),
  whatsapp: z.string().max(20).optional(),
  email: z.string().email("Valid email is required"),
  company: z.string().max(160).optional(),
  city: z.string().min(2, "City is required").max(120),
  service: z.enum(serviceSlugs),
  message: z
    .string()
    .min(5, "Message / requirement is required")
    .max(2000, "Requirement details exceed maximum allowed length."),
  submissionType: z.enum(enquirySubmissionTypes),
  source: z.string().min(2, "Lead source is required").max(120).default("Website"),
  ctaType: z.string().max(60).optional(),
  consentAccepted: z.literal("on", { message: "Consent is required" }),
  servicePayload: z.record(z.string(), z.string()).default({}),
  campaignData: z.record(z.string(), z.string()).default({}),
})

export const enquiryFormSchema = leadFormSchema

export type EnquiryFormInput = z.infer<typeof enquiryFormSchema>

export const contactSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  mobile: z.string().max(20).optional(),
  message: z.string().min(10).max(2000),
})
