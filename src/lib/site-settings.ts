import { cache } from "react"

import { prisma } from "@/lib/db"
import { serviceCategories, siteConfig } from "@/lib/site"

export type PublicService = {
  id?: string
  name: string
  slug: string
  summary: string
  questions: string[]
  isActive: boolean
}

export type SiteSettings = {
  companyName: string
  legalName: string
  siteUrl: string
  tagline: string
  description: string
  primaryPhone: string
  primaryEmail: string
  primaryWhatsapp: string
  address: string
  citiesLabel: string
  aboutHeadline: string
  aboutDescription: string
  nav: Array<{ label: string; href: string }>
  footerQuickLinks: Array<{ label: string; href: string }>
  legalLinks: Array<{ label: string; href: string }>
  socialLinks: Array<{ label: string; href: string }>
  seo: {
    title: string
    description: string
    ogImage: string
  }
  homepage: {
    heroBadge: string
    heroHeadline: string
    heroSubheadline: string
    primaryCtaLabel: string
    secondaryCtaLabel: string
    servicesHeading: string
    whyChooseHeading: string
    whyChooseIntro: string
    mediaHeading: string
    mediaIntro: string
    ctaTitle: string
    ctaCopy: string
  }
  footer: {
    trustHeading: string
    trustPoints: string[]
    newsletterLabel: string
    ctaTitle: string
    ctaCopy: string
  }
  recentEnquiries: {
    enabled: boolean
    limit: number
    liveBadge: boolean
    autoHideSeconds: number
    inactivityReappearSeconds: number
    rotationSeconds: number
    displayStyle: "toast" | "popup" | "floating-card"
  }
}

const defaultSettings: SiteSettings = {
  companyName: siteConfig.name,
  legalName: siteConfig.legalName,
  siteUrl: siteConfig.url,
  tagline: siteConfig.tagline,
  description: siteConfig.description,
  primaryPhone: "7977938960",
  primaryEmail: "namaste@taakshvisolutionhub.com",
  primaryWhatsapp: "7977938960",
  address: "Mumbai, Maharashtra, India",
  citiesLabel: "Mumbai • Ahmedabad • Nasik • Lucknow",
  aboutHeadline: "A premium solution hub built around trust, speed, and thoughtful coordination.",
  aboutDescription:
    "Taakshvi helps clients move from uncertainty to confident action with one trusted brand that brings together experiences, destinations, wellness, property, branding, and consultation-led services.",
  nav: siteConfig.nav,
  footerQuickLinks: siteConfig.footerQuickLinks,
  legalLinks: siteConfig.legalLinks,
  socialLinks: siteConfig.socialLinks,
  seo: {
    title: `${siteConfig.name} | Events, Travel, Branding, Wellness & More`,
    description: siteConfig.description,
    ogImage: "/brand/taakshvi-logo.jpeg",
  },
  homepage: {
    heroBadge: "Events. Travel. Branding. Wellness. Real Estate & More.",
    heroHeadline: "Your Trusted Partner for Experiences that Inspire & Deliver",
    heroSubheadline:
      "Corporate events, luxury travel, wellness retreats, real estate, branding, finance, and more, brought together through one trusted premium service hub.",
    primaryCtaLabel: "Request Callback",
    secondaryCtaLabel: "WhatsApp Now",
    servicesHeading: "Choose the service flow that fits your requirement",
    whyChooseHeading: "A more dependable way to discover and coordinate premium services.",
    whyChooseIntro:
      "The public experience should build trust immediately. These are the reasons clients feel confident reaching out.",
    mediaHeading: "Media coverage and public references",
    mediaIntro:
      "Credible public references help visitors understand that the brand is active, visible, and professionally managed.",
    ctaTitle: "Share your requirement and let our team take it forward.",
    ctaCopy:
      "Whether you are planning a corporate event, retreat, travel requirement, property need, or consultation-led service, we begin with a clear understanding of what matters to you.",
  },
  footer: {
    trustHeading: "Why Clients Trust Us",
    trustPoints: [
      "Dedicated Service Coordination",
      "Fast Response",
      "Personalized Support",
      "Trusted Partners",
      "Multi-City Network",
      "Professional Consultation",
    ],
    newsletterLabel: "Newsletter Signup",
    ctaTitle: "Stay connected with Taakshvi updates",
    ctaCopy: "Receive service updates, event highlights, and new coverage announcements.",
  },
  recentEnquiries: {
    enabled: true,
    limit: 4,
    liveBadge: true,
    autoHideSeconds: 10,
    inactivityReappearSeconds: 45,
    rotationSeconds: 18,
    displayStyle: "floating-card",
  },
}

function asStringArray(value: unknown, fallback: string[]) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string" && item.length > 0) : fallback
}

function asLinkArray(
  value: unknown,
  fallback: Array<{ label: string; href: string }>
) {
  if (!Array.isArray(value)) return fallback

  const normalized = value
    .map((item) => {
      if (!item || typeof item !== "object") return null
      const label = typeof item.label === "string" ? item.label : ""
      const href = typeof item.href === "string" ? item.href : ""
      return label && href ? { label, href } : null
    })
    .filter((item): item is { label: string; href: string } => Boolean(item))

  return normalized.length ? normalized : fallback
}

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const settings = await prisma.setting.findMany({
    where: {
      key: {
        in: [
          "site_contact",
          "site_social",
          "site_seo",
          "homepage_settings",
          "footer_settings",
          "recent_enquiries_widget",
          "whatsapp_settings",
          "company_profile",
          "site_navigation",
        ],
      },
    },
  })

  const map = new Map(settings.map((setting) => [setting.key, setting.value as Record<string, unknown>]))
  const contact = map.get("site_contact") ?? {}
  const social = map.get("site_social") ?? {}
  const seo = map.get("site_seo") ?? {}
  const homepage = map.get("homepage_settings") ?? {}
  const footer = map.get("footer_settings") ?? {}
  const recent = map.get("recent_enquiries_widget") ?? {}
  const whatsapp = map.get("whatsapp_settings") ?? {}
  const company = map.get("company_profile") ?? {}
  const navigation = map.get("site_navigation") ?? {}

  return {
    companyName: typeof company.companyName === "string" && company.companyName ? company.companyName : defaultSettings.companyName,
    legalName: typeof company.legalName === "string" && company.legalName ? company.legalName : defaultSettings.legalName,
    siteUrl: typeof company.siteUrl === "string" && company.siteUrl ? company.siteUrl : defaultSettings.siteUrl,
    tagline: typeof company.tagline === "string" && company.tagline ? company.tagline : defaultSettings.tagline,
    description: typeof company.description === "string" && company.description ? company.description : defaultSettings.description,
    primaryPhone: typeof contact.phone === "string" && contact.phone ? contact.phone : defaultSettings.primaryPhone,
    primaryEmail: typeof contact.email === "string" && contact.email ? contact.email : defaultSettings.primaryEmail,
    primaryWhatsapp:
      typeof whatsapp.primary === "string" && whatsapp.primary
        ? whatsapp.primary
        : typeof contact.phone === "string" && contact.phone
          ? contact.phone
          : defaultSettings.primaryWhatsapp,
    address: typeof contact.address === "string" && contact.address ? contact.address : defaultSettings.address,
    citiesLabel: typeof company.citiesLabel === "string" && company.citiesLabel ? company.citiesLabel : defaultSettings.citiesLabel,
    aboutHeadline:
      typeof company.aboutHeadline === "string" && company.aboutHeadline ? company.aboutHeadline : defaultSettings.aboutHeadline,
    aboutDescription:
      typeof company.aboutDescription === "string" && company.aboutDescription
        ? company.aboutDescription
        : defaultSettings.aboutDescription,
    nav: asLinkArray(navigation.nav, defaultSettings.nav),
    footerQuickLinks: asLinkArray(navigation.footerQuickLinks, defaultSettings.footerQuickLinks),
    legalLinks: asLinkArray(navigation.legalLinks, defaultSettings.legalLinks),
    socialLinks: asLinkArray(
      social.links,
      [
        ...(typeof social.instagram === "string" && social.instagram ? [{ label: "Instagram", href: social.instagram }] : []),
        ...(typeof social.facebook === "string" && social.facebook ? [{ label: "Facebook", href: social.facebook }] : []),
        ...(typeof social.linkedin === "string" && social.linkedin ? [{ label: "LinkedIn", href: social.linkedin }] : []),
        ...(typeof social.whatsappChannel === "string" && social.whatsappChannel
          ? [{ label: "WhatsApp Channel", href: social.whatsappChannel }]
          : []),
      ].length
        ? ([
            ...(typeof social.instagram === "string" && social.instagram ? [{ label: "Instagram", href: social.instagram }] : []),
            ...(typeof social.facebook === "string" && social.facebook ? [{ label: "Facebook", href: social.facebook }] : []),
            ...(typeof social.linkedin === "string" && social.linkedin ? [{ label: "LinkedIn", href: social.linkedin }] : []),
            ...(typeof social.whatsappChannel === "string" && social.whatsappChannel
              ? [{ label: "WhatsApp Channel", href: social.whatsappChannel }]
              : []),
          ] satisfies Array<{ label: string; href: string }>)
        : defaultSettings.socialLinks
    ),
    seo: {
      title: typeof seo.title === "string" && seo.title ? seo.title : defaultSettings.seo.title,
      description:
        typeof seo.description === "string" && seo.description ? seo.description : defaultSettings.seo.description,
      ogImage: typeof seo.ogImage === "string" && seo.ogImage ? seo.ogImage : defaultSettings.seo.ogImage,
    },
    homepage: {
      heroBadge:
        typeof homepage.heroBadge === "string" && homepage.heroBadge ? homepage.heroBadge : defaultSettings.homepage.heroBadge,
      heroHeadline:
        typeof homepage.heroHeadline === "string" && homepage.heroHeadline
          ? homepage.heroHeadline
          : defaultSettings.homepage.heroHeadline,
      heroSubheadline:
        typeof homepage.heroSubheadline === "string" && homepage.heroSubheadline
          ? homepage.heroSubheadline
          : defaultSettings.homepage.heroSubheadline,
      primaryCtaLabel:
        typeof homepage.primaryCtaLabel === "string" && homepage.primaryCtaLabel
          ? homepage.primaryCtaLabel
          : defaultSettings.homepage.primaryCtaLabel,
      secondaryCtaLabel:
        typeof homepage.secondaryCtaLabel === "string" && homepage.secondaryCtaLabel
          ? homepage.secondaryCtaLabel
          : defaultSettings.homepage.secondaryCtaLabel,
      servicesHeading:
        typeof homepage.servicesHeading === "string" && homepage.servicesHeading
          ? homepage.servicesHeading
          : defaultSettings.homepage.servicesHeading,
      whyChooseHeading:
        typeof homepage.whyChooseHeading === "string" && homepage.whyChooseHeading
          ? homepage.whyChooseHeading
          : defaultSettings.homepage.whyChooseHeading,
      whyChooseIntro:
        typeof homepage.whyChooseIntro === "string" && homepage.whyChooseIntro
          ? homepage.whyChooseIntro
          : defaultSettings.homepage.whyChooseIntro,
      mediaHeading:
        typeof homepage.mediaHeading === "string" && homepage.mediaHeading
          ? homepage.mediaHeading
          : defaultSettings.homepage.mediaHeading,
      mediaIntro:
        typeof homepage.mediaIntro === "string" && homepage.mediaIntro
          ? homepage.mediaIntro
          : defaultSettings.homepage.mediaIntro,
      ctaTitle:
        typeof homepage.ctaTitle === "string" && homepage.ctaTitle ? homepage.ctaTitle : defaultSettings.homepage.ctaTitle,
      ctaCopy:
        typeof homepage.ctaCopy === "string" && homepage.ctaCopy ? homepage.ctaCopy : defaultSettings.homepage.ctaCopy,
    },
    footer: {
      trustHeading:
        typeof footer.trustHeading === "string" && footer.trustHeading
          ? footer.trustHeading
          : defaultSettings.footer.trustHeading,
      trustPoints: asStringArray(footer.trustPoints, defaultSettings.footer.trustPoints),
      newsletterLabel:
        typeof footer.newsletterLabel === "string" && footer.newsletterLabel
          ? footer.newsletterLabel
          : defaultSettings.footer.newsletterLabel,
      ctaTitle:
        typeof footer.ctaTitle === "string" && footer.ctaTitle ? footer.ctaTitle : defaultSettings.footer.ctaTitle,
      ctaCopy:
        typeof footer.ctaCopy === "string" && footer.ctaCopy ? footer.ctaCopy : defaultSettings.footer.ctaCopy,
    },
    recentEnquiries: {
      enabled: typeof recent.enabled === "boolean" ? recent.enabled : defaultSettings.recentEnquiries.enabled,
      limit:
        typeof recent.limit === "number" && Number.isFinite(recent.limit) ? recent.limit : defaultSettings.recentEnquiries.limit,
      liveBadge:
        typeof recent.liveBadge === "boolean" ? recent.liveBadge : defaultSettings.recentEnquiries.liveBadge,
      autoHideSeconds:
        typeof recent.autoHideSeconds === "number" && Number.isFinite(recent.autoHideSeconds)
          ? recent.autoHideSeconds
          : defaultSettings.recentEnquiries.autoHideSeconds,
      inactivityReappearSeconds:
        typeof recent.inactivityReappearSeconds === "number" && Number.isFinite(recent.inactivityReappearSeconds)
          ? recent.inactivityReappearSeconds
          : defaultSettings.recentEnquiries.inactivityReappearSeconds,
      rotationSeconds:
        typeof recent.rotationSeconds === "number" && Number.isFinite(recent.rotationSeconds)
          ? recent.rotationSeconds
          : defaultSettings.recentEnquiries.rotationSeconds,
      displayStyle:
        recent.displayStyle === "toast" || recent.displayStyle === "popup" || recent.displayStyle === "floating-card"
          ? recent.displayStyle
          : defaultSettings.recentEnquiries.displayStyle,
    },
  }
})

export const getPublicServices = cache(async (): Promise<PublicService[]> => {
  const databaseServices = await prisma.service.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      isActive: true,
    },
    orderBy: [{ name: "asc" }],
  })

  if (!databaseServices.length) {
    return serviceCategories.map((service) => ({
      name: service.name,
      slug: service.slug,
      summary: service.summary,
      questions: Array.from(service.questions),
      isActive: true,
    }))
  }

  const mergedServices = new Map<string, PublicService>()
  for (const service of databaseServices) {
    const fallback = serviceCategories.find((item) => item.slug === service.slug)

    mergedServices.set(service.slug, {
      id: service.id,
      name: service.name,
      slug: service.slug,
      summary: service.description || fallback?.summary || service.name,
      questions: fallback ? Array.from(fallback.questions) : ["Requirement Details"],
      isActive: service.isActive,
    })
  }

  for (const service of serviceCategories) {
    if (mergedServices.has(service.slug)) continue

    mergedServices.set(service.slug, {
      name: service.name,
      slug: service.slug,
      summary: service.summary,
      questions: Array.from(service.questions),
      isActive: true,
    })
  }

  return [...mergedServices.values()]
    .filter((service) => service.isActive)
    .sort((a, b) => a.name.localeCompare(b.name))
})

export async function getSiteData() {
  const [settings, services] = await Promise.all([getSiteSettings(), getPublicServices()])

  return { settings, services }
}
