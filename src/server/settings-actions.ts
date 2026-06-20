"use server"

import { Prisma } from "@prisma/client"
import { revalidatePath } from "next/cache"

import { requirePermission } from "@/lib/admin"
import { prisma } from "@/lib/db"
import { recordAuditLog } from "@/server/audit-log"

function splitLines(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean)
}

async function upsertSetting(key: string, value: Record<string, unknown>) {
  await prisma.setting.upsert({
    where: { key },
    update: { value: value as Prisma.InputJsonValue },
    create: { key, value: value as Prisma.InputJsonValue },
  })
}

function revalidateSite() {
  revalidatePath("/admin/settings")
  revalidatePath("/", "layout")
  revalidatePath("/")
  revalidatePath("/about-us")
  revalidatePath("/contact-us")
  revalidatePath("/services")
}

export async function updateSettings(formData: FormData) {
  await requirePermission("settings.write")

  const companyName = String(formData.get("companyName") ?? "")
  const legalName = String(formData.get("legalName") ?? "")
  const siteUrl = String(formData.get("siteUrl") ?? "")
  const tagline = String(formData.get("tagline") ?? "")
  const description = String(formData.get("description") ?? "")
  const aboutHeadline = String(formData.get("aboutHeadline") ?? "")
  const aboutDescription = String(formData.get("aboutDescription") ?? "")
  const citiesLabel = String(formData.get("citiesLabel") ?? "")

  const phone = String(formData.get("phone") ?? "")
  const email = String(formData.get("email") ?? "")
  const address = String(formData.get("address") ?? "")
  const recentEnabled = formData.get("recentEnabled") === "on"
  const recentLiveBadge = formData.get("recentLiveBadge") === "on"
  const recentLimit = Number(formData.get("recentLimit") ?? 4)

  const seoTitle = String(formData.get("seoTitle") ?? "")
  const seoDescription = String(formData.get("seoDescription") ?? "")
  const seoOgImage = String(formData.get("seoOgImage") ?? "")
  const instagram = String(formData.get("instagram") ?? "")
  const facebook = String(formData.get("facebook") ?? "")
  const linkedin = String(formData.get("linkedin") ?? "")
  const whatsappChannel = String(formData.get("whatsappChannel") ?? "")
  const heroBadge = String(formData.get("heroBadge") ?? "")
  const heroHeadline = String(formData.get("heroHeadline") ?? "")
  const heroSubheadline = String(formData.get("heroSubheadline") ?? "")
  const primaryCtaLabel = String(formData.get("primaryCtaLabel") ?? "")
  const secondaryCtaLabel = String(formData.get("secondaryCtaLabel") ?? "")
  const servicesHeading = String(formData.get("servicesHeading") ?? "")
  const whyChooseHeading = String(formData.get("whyChooseHeading") ?? "")
  const whyChooseIntro = String(formData.get("whyChooseIntro") ?? "")
  const mediaHeading = String(formData.get("mediaHeading") ?? "")
  const mediaIntro = String(formData.get("mediaIntro") ?? "")
  const ctaTitle = String(formData.get("ctaTitle") ?? "")
  const ctaCopy = String(formData.get("ctaCopy") ?? "")
  const emailFrom = String(formData.get("emailFrom") ?? "")
  const emailReplyTo = String(formData.get("emailReplyTo") ?? "")
  const whatsappPrimary = String(formData.get("whatsappPrimary") ?? "")
  const footerTrustHeading = String(formData.get("footerTrustHeading") ?? "")
  const footerTrustPoints = splitLines(formData.get("footerTrustPoints"))
  const footerNewsletterLabel = String(formData.get("footerNewsletterLabel") ?? "")
  const footerCtaTitle = String(formData.get("footerCtaTitle") ?? "")
  const footerCtaCopy = String(formData.get("footerCtaCopy") ?? "")

  await Promise.all([
    upsertSetting("company_profile", {
      companyName,
      legalName,
      siteUrl,
      tagline,
      description,
      aboutHeadline,
      aboutDescription,
      citiesLabel,
    }),
    upsertSetting("site_contact", { phone, email, address }),
    upsertSetting("recent_enquiries_widget", {
      enabled: recentEnabled,
      limit: recentLimit,
      liveBadge: recentLiveBadge,
    }),
    upsertSetting("site_seo", {
      title: seoTitle,
      description: seoDescription,
      ogImage: seoOgImage,
    }),
    upsertSetting("site_social", {
      instagram,
      facebook,
      linkedin,
      whatsappChannel,
      links: [
        ...(instagram ? [{ label: "Instagram", href: instagram }] : []),
        ...(facebook ? [{ label: "Facebook", href: facebook }] : []),
        ...(linkedin ? [{ label: "LinkedIn", href: linkedin }] : []),
        ...(whatsappChannel ? [{ label: "WhatsApp Channel", href: whatsappChannel }] : []),
      ],
    }),
    upsertSetting("homepage_settings", {
      heroBadge,
      heroHeadline,
      heroSubheadline,
      primaryCtaLabel,
      secondaryCtaLabel,
      servicesHeading,
      whyChooseHeading,
      whyChooseIntro,
      mediaHeading,
      mediaIntro,
      ctaTitle,
      ctaCopy,
    }),
    upsertSetting("email_settings", { from: emailFrom, replyTo: emailReplyTo }),
    upsertSetting("whatsapp_settings", { primary: whatsappPrimary }),
    upsertSetting("footer_settings", {
      trustHeading: footerTrustHeading,
      trustPoints: footerTrustPoints,
      newsletterLabel: footerNewsletterLabel,
      ctaTitle: footerCtaTitle,
      ctaCopy: footerCtaCopy,
    }),
  ])

  const routingIds = formData.getAll("routingId").map(String)
  const routingServiceIds = formData.getAll("routingServiceId").map(String)
  const routingCities = formData.getAll("routingCity").map(String)
  const routingOwners = formData.getAll("routingOwnerName").map(String)
  const routingMobiles = formData.getAll("routingMobile").map(String)
  const routingWhatsapps = formData.getAll("routingWhatsapp").map(String)
  const routingEmails = formData.getAll("routingEmail").map(String)
  const routingPriorities = formData.getAll("routingPriority").map((value) => Number(value || 100))

  for (let index = 0; index < routingIds.length; index += 1) {
    const id = routingIds[index]
    if (!id) continue

    await prisma.leadRoutingRule.update({
      where: { id },
      data: {
        serviceId: routingServiceIds[index] || null,
        city: routingCities[index] || null,
        ownerName: routingOwners[index] || null,
        assignedMobile: routingMobiles[index] || "",
        assignedWhatsapp: routingWhatsapps[index] || routingMobiles[index] || "",
        assignedEmail: routingEmails[index] || null,
        priority: routingPriorities[index] || 100,
      },
    })
  }

  await recordAuditLog({
    action: "settings.updated",
    entity: "setting",
    metadata: {
      companyName,
      phone,
      email,
      homepage: { heroHeadline, primaryCtaLabel },
      seo: { seoTitle },
      routingRulesUpdated: routingIds.length,
    },
  })

  revalidateSite()
}

export async function createRoutingRule(formData: FormData) {
  await requirePermission("settings.write")

  const serviceId = String(formData.get("serviceId") ?? "")
  const city = String(formData.get("city") ?? "")
  const ownerName = String(formData.get("ownerName") ?? "")
  const mobile = String(formData.get("mobile") ?? "")
  const whatsapp = String(formData.get("whatsapp") ?? "")
  const email = String(formData.get("email") ?? "")
  const priority = Number(formData.get("priority") ?? 100)

  const rule = await prisma.leadRoutingRule.create({
    data: {
      serviceId: serviceId || null,
      city: city || null,
      ownerName: ownerName || null,
      assignedMobile: mobile,
      assignedWhatsapp: whatsapp || mobile,
      assignedEmail: email || null,
      priority,
    },
  })

  await recordAuditLog({
    action: "routing.created",
    entity: "lead_routing_rule",
    entityId: rule.id,
    metadata: { serviceId, city, ownerName },
  })

  revalidateSite()
}

export async function deleteRoutingRule(formData: FormData) {
  await requirePermission("settings.write")

  const id = String(formData.get("id") ?? "")
  if (!id) return

  await prisma.leadRoutingRule.delete({ where: { id } })
  await recordAuditLog({
    action: "routing.deleted",
    entity: "lead_routing_rule",
    entityId: id,
  })

  revalidateSite()
}

export async function createService(formData: FormData) {
  await requirePermission("settings.write")

  const name = String(formData.get("name") ?? "")
  const slug = String(formData.get("slug") ?? "")
  const description = String(formData.get("description") ?? "")

  const service = await prisma.service.create({
    data: {
      name,
      slug,
      description,
      isActive: true,
    },
  })

  await recordAuditLog({
    action: "service.created",
    entity: "service",
    entityId: service.id,
    metadata: { name, slug },
  })

  revalidateSite()
}

export async function updateServices(formData: FormData) {
  await requirePermission("settings.write")

  const ids = formData.getAll("serviceId").map(String)
  const names = formData.getAll("serviceName").map(String)
  const slugs = formData.getAll("serviceSlug").map(String)
  const descriptions = formData.getAll("serviceDescription").map(String)
  const activeIds = new Set(formData.getAll("serviceIsActive").map(String))

  for (let index = 0; index < ids.length; index += 1) {
    const id = ids[index]
    if (!id) continue

    await prisma.service.update({
      where: { id },
      data: {
        name: names[index] || "",
        slug: slugs[index] || "",
        description: descriptions[index] || "",
        isActive: activeIds.has(id),
      },
    })
  }

  await recordAuditLog({
    action: "service.updated",
    entity: "service",
    metadata: { count: ids.length },
  })

  revalidateSite()
}

export async function deleteService(formData: FormData) {
  await requirePermission("settings.write")

  const id = String(formData.get("id") ?? "")
  if (!id) return

  await prisma.service.delete({ where: { id } })
  await recordAuditLog({
    action: "service.deleted",
    entity: "service",
    entityId: id,
  })

  revalidateSite()
}
