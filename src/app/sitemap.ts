import type { MetadataRoute } from "next"

import { serviceCategories, siteConfig } from "@/lib/site"

export default function sitemap(): MetadataRoute.Sitemap {
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
      url: `${siteConfig.url}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.7,
    })),
    ...serviceCategories.map((service) => ({
      url: `${siteConfig.url}/services/${service.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ]
}
