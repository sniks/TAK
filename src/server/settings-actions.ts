"use server"

import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/db"

export async function updateSettings(formData: FormData) {
  const phone = String(formData.get("phone") ?? "")
  const email = String(formData.get("email") ?? "")
  const recentEnabled = formData.get("recentEnabled") === "on"
  const recentLimit = Number(formData.get("recentLimit") ?? 4)

  const seoTitle = String(formData.get("seoTitle") ?? "")
  const seoDescription = String(formData.get("seoDescription") ?? "")
  const instagram = String(formData.get("instagram") ?? "")
  const facebook = String(formData.get("facebook") ?? "")
  const linkedin = String(formData.get("linkedin") ?? "")
  const heroHeadline = String(formData.get("heroHeadline") ?? "")
  const heroSubheadline = String(formData.get("heroSubheadline") ?? "")
  const emailFrom = String(formData.get("emailFrom") ?? "")
  const emailReplyTo = String(formData.get("emailReplyTo") ?? "")
  const whatsappPrimary = String(formData.get("whatsappPrimary") ?? "")
  const footerTrustHeading = String(formData.get("footerTrustHeading") ?? "")
  const mediaSectionHeading = String(formData.get("mediaSectionHeading") ?? "")

  await prisma.setting.upsert({
    where: { key: "site_contact" },
    update: { value: { phone, email } },
    create: { key: "site_contact", value: { phone, email } },
  })

  await prisma.setting.upsert({
    where: { key: "recent_enquiries_widget" },
    update: { value: { enabled: recentEnabled, limit: recentLimit, liveBadge: true } },
    create: { key: "recent_enquiries_widget", value: { enabled: recentEnabled, limit: recentLimit, liveBadge: true } },
  })

  await prisma.setting.upsert({
    where: { key: "site_seo" },
    update: { value: { title: seoTitle, description: seoDescription } },
    create: { key: "site_seo", value: { title: seoTitle, description: seoDescription } },
  })

  await prisma.setting.upsert({
    where: { key: "site_social" },
    update: { value: { instagram, facebook, linkedin } },
    create: { key: "site_social", value: { instagram, facebook, linkedin } },
  })

  await prisma.setting.upsert({
    where: { key: "homepage_settings" },
    update: { value: { heroHeadline, heroSubheadline } },
    create: { key: "homepage_settings", value: { heroHeadline, heroSubheadline } },
  })

  await prisma.setting.upsert({
    where: { key: "email_settings" },
    update: { value: { from: emailFrom, replyTo: emailReplyTo } },
    create: { key: "email_settings", value: { from: emailFrom, replyTo: emailReplyTo } },
  })

  await prisma.setting.upsert({
    where: { key: "whatsapp_settings" },
    update: { value: { primary: whatsappPrimary } },
    create: { key: "whatsapp_settings", value: { primary: whatsappPrimary } },
  })

  await prisma.setting.upsert({
    where: { key: "footer_settings" },
    update: { value: { trustHeading: footerTrustHeading } },
    create: { key: "footer_settings", value: { trustHeading: footerTrustHeading } },
  })

  await prisma.setting.upsert({
    where: { key: "media_settings" },
    update: { value: { sectionHeading: mediaSectionHeading } },
    create: { key: "media_settings", value: { sectionHeading: mediaSectionHeading } },
  })

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

  revalidatePath("/admin/settings")
  revalidatePath("/", "layout")
}

export async function createRoutingRule(formData: FormData) {
  const serviceId = String(formData.get("serviceId") ?? "")
  const city = String(formData.get("city") ?? "")
  const ownerName = String(formData.get("ownerName") ?? "")
  const mobile = String(formData.get("mobile") ?? "")
  const whatsapp = String(formData.get("whatsapp") ?? "")
  const email = String(formData.get("email") ?? "")
  const priority = Number(formData.get("priority") ?? 100)

  await prisma.leadRoutingRule.create({
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

  revalidatePath("/admin/settings")
  revalidatePath("/", "layout")
}

export async function deleteRoutingRule(formData: FormData) {
  const id = String(formData.get("id") ?? "")
  if (!id) return

  await prisma.leadRoutingRule.delete({ where: { id } })

  revalidatePath("/admin/settings")
  revalidatePath("/", "layout")
}
