import { z } from "zod"

import { serviceCategories } from "@/lib/site"

export const serviceSlugs = serviceCategories.map((service) => service.slug) as [
  string,
  ...string[],
]

export const leadFormSchema = z.object({
  fullName: z.string().min(2, "Full name is required").max(120),
  mobile: z.string().min(8, "Mobile number is required").max(20),
  whatsapp: z.string().max(20).optional(),
  email: z.string().email("Valid email is required"),
  company: z.string().max(160).optional(),
  city: z.string().min(2, "City is required").max(120),
  service: z.enum(serviceSlugs),
  consentAccepted: z.literal("on", { message: "Consent is required" }),
  servicePayload: z.record(z.string(), z.string()).default({}),
})

export type LeadFormInput = z.infer<typeof leadFormSchema>

export const contactSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  mobile: z.string().max(20).optional(),
  message: z.string().min(10).max(2000),
})
