import { prisma } from "@/lib/db"
import { assignLeadOwnerSync, defaultLeadOwner, type LeadOwner } from "@/lib/routing-config"

type RoutingInput = {
  service: string
  city?: string
}

export async function assignLeadOwnerFromDatabase(input: RoutingInput): Promise<LeadOwner> {
  const city = input.city?.trim() ?? ""
  const serviceRecord = await prisma.service.findFirst({
    where: {
      OR: [{ slug: input.service }, { name: input.service }],
    },
    select: {
      id: true,
    },
  })
  const rules = await prisma.leadRoutingRule.findMany({
    where: {
      isActive: true,
      OR: [
        { serviceId: serviceRecord?.id ?? undefined, city: { equals: city, mode: "insensitive" } },
        { serviceId: serviceRecord?.id ?? undefined, city: null },
        { serviceId: null, city: null },
      ],
    },
    orderBy: { priority: "asc" },
  })

  const matched = rules[0]
  if (!matched) return assignLeadOwnerSync(input)

  return {
    mobile: matched.assignedMobile,
    whatsapp: matched.assignedWhatsapp ?? matched.assignedMobile,
    email: matched.assignedEmail ?? defaultLeadOwner.email,
    reason: matched.ownerName ?? "Database routing rule",
  }
}

export function maskRecentEnquiryName(name: string) {
  const trimmed = name.trim()
  if (!trimmed) return "Guest"
  return `${trimmed[0].toUpperCase()}****`
}
