type RoutingInput = {
  service: string
  city?: string
}

export type LeadOwner = {
  mobile: string
  whatsapp: string
  email: string
  reason: string
}

export const defaultLeadOwner: LeadOwner = {
  mobile: "7977938960",
  whatsapp: "7977938960",
  email: "namaste@taakshvisolutionhub.com",
  reason: "Default lead routing",
}

export type PublicRoutingRule = {
  serviceSlug?: string | null
  city?: string | null
  mobile: string
  whatsapp?: string | null
  email?: string | null
  ownerName?: string | null
  priority?: number | null
}

export function assignLeadOwnerSync(input: RoutingInput): LeadOwner {
  const service = input.service.trim().toLowerCase()
  const city = input.city?.trim().toLowerCase() ?? ""

  if (service === "astrology") {
    return {
      ...defaultLeadOwner,
      mobile: "9833031572",
      whatsapp: "9833031572",
      reason: "Astrology routing",
    }
  }

  if (service === "finance") {
    return {
      ...defaultLeadOwner,
      mobile: "9326277096",
      whatsapp: "9326277096",
      reason: "Finance routing",
    }
  }

  if (service === "tours-travel" || service === "health-wellness") {
    return {
      ...defaultLeadOwner,
      mobile: "8460623469",
      whatsapp: "8460623469",
      reason: "Department routing",
    }
  }

  if (service === "real-estate" && city.includes("ahmedabad")) {
    return {
      ...defaultLeadOwner,
      mobile: "8460623469",
      whatsapp: "8460623469",
      reason: "Real Estate Ahmedabad routing",
    }
  }

  return defaultLeadOwner
}

export function resolveLeadOwner(input: RoutingInput, rules: PublicRoutingRule[] = []) {
  const service = input.service.trim().toLowerCase()
  const city = input.city?.trim().toLowerCase() ?? ""

  const matched = [...rules]
    .sort((a, b) => (a.priority ?? 100) - (b.priority ?? 100))
    .find((rule) => {
      const serviceMatches = !rule.serviceSlug || rule.serviceSlug.toLowerCase() === service
      const cityMatches = !rule.city || rule.city.toLowerCase() === city
      return serviceMatches && cityMatches
    })

  if (!matched) return assignLeadOwnerSync(input)

  return {
    mobile: matched.mobile,
    whatsapp: matched.whatsapp || matched.mobile,
    email: matched.email || defaultLeadOwner.email,
    reason: matched.ownerName || "Service owner",
  }
}

export function buildWhatsAppMessage(input: {
  name: string
  service: string
  mobile: string
  city: string
}) {
  return encodeURIComponent(`Hello Team,

I am interested in ${input.service}.

Name: ${input.name}
Mobile: ${input.mobile}
City: ${input.city}

Please contact me regarding my enquiry.

Thank you.`)
}

export function buildEmailBody(input: {
  name: string
  service: string
  city: string
  requirements?: string
}) {
  return encodeURIComponent(
    `Name: ${input.name}
Service: ${input.service}
City: ${input.city}
Requirements: ${input.requirements ?? ""}`
  )
}
