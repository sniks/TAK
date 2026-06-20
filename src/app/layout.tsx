import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import "./globals.css"
import { CallbackProvider } from "@/components/marketing/callback-provider"
import { SiteDataProvider } from "@/components/marketing/site-data-provider"
import { Toaster } from "@/components/ui/sonner"
import { prisma } from "@/lib/db"
import { getSiteSettings, getPublicServices } from "@/lib/site-settings"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()

  return {
    metadataBase: new URL(settings.siteUrl),
    title: {
      default: settings.seo.title,
      template: `%s | ${settings.companyName}`,
    },
    description: settings.seo.description,
    openGraph: {
      title: settings.companyName,
      description: settings.seo.description,
      url: settings.siteUrl,
      siteName: settings.companyName,
      images: [{ url: settings.seo.ogImage, width: 1200, height: 1200 }],
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: settings.companyName,
      description: settings.seo.description,
      images: [settings.seo.ogImage],
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [routingRules, settings, services] = await Promise.all([
    prisma.leadRoutingRule.findMany({
      where: { isActive: true },
      select: {
        city: true,
        assignedMobile: true,
        assignedWhatsapp: true,
        assignedEmail: true,
        ownerName: true,
        priority: true,
        service: {
          select: {
            slug: true,
          },
        },
      },
      orderBy: { priority: "asc" },
    }),
    getSiteSettings(),
    getPublicServices(),
  ])

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full overflow-x-clip antialiased`}
    >
      <body className="min-h-full flex flex-col overflow-x-clip bg-background text-foreground">
        <SiteDataProvider settings={settings} services={services}>
          <CallbackProvider
            routingRules={routingRules.map((rule) => ({
              serviceSlug: rule.service?.slug ?? null,
              city: rule.city,
              mobile: rule.assignedMobile,
              whatsapp: rule.assignedWhatsapp,
              email: rule.assignedEmail,
              ownerName: rule.ownerName,
              priority: rule.priority,
            }))}
          >
            {children}
          </CallbackProvider>
        </SiteDataProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
