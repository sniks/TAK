import type { MetadataRoute } from "next"

import { getPublicServices, getSiteSettings } from "@/lib/site-settings"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, settings] = await Promise.all([getPublicServices(), getSiteSettings()])
  const staticRoutes = [
    "",
    "/about-us",
    "/services",
    "/gallery",
    "/testimonials",
    "/blogs",
    "/news",
    "/case-studies",
    "/success-stories",
    "/contact-us",
    "/privacy-policy",
    "/terms-conditions",
  ]

  return [
    ...staticRoutes.map((route) => ({
      url: `${settings.siteUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.7,
    })),
    ...services.map((service) => ({
      url: `${settings.siteUrl}/services/${service.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ]
}
