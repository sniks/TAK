import type { Metadata } from "next"

import { Breadcrumbs } from "@/components/marketing/breadcrumbs"
import { CallbackButton } from "@/components/marketing/callback-button"
import { GalleryClient } from "@/components/marketing/gallery-client"
import { Header } from "@/components/marketing/header"
import { SiteFooter } from "@/components/marketing/site-footer"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { prisma } from "@/lib/db"

export const metadata: Metadata = {
  title: "Gallery",
  description: "Filterable Taakshvi gallery across events, travel, wellness, real estate, and visual storytelling.",
}

export default async function GalleryPage() {
  const items = await prisma.galleryItem.findMany({ orderBy: { createdAt: "desc" } })

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="border-b border-border bg-[linear-gradient(135deg,rgba(239,63,134,0.08),rgba(4,99,153,0.02)_50%,rgba(79,181,84,0.08))]">
          <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8 lg:py-20">
            <div>
              <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Gallery" }]} />
              <h1 className="text-4xl font-semibold leading-tight text-[var(--brand-navy)] sm:text-5xl">
                A visual view of the experiences, spaces, and service categories behind Taakshvi.
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
                The gallery is designed to feel curated rather than dumped. Visitors can filter categories, open media in a lightbox, and understand the range of work quickly.
              </p>
              <div className="mt-8">
                <CallbackButton className="bg-[var(--brand-pink)] text-white">Request Callback</CallbackButton>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ["Events", "Corporate moments, launches, and large-format experiences."],
                ["Travel", "Destinations, stays, and experience-led planning."],
                ["Wellness", "Retreat moments, calm spaces, and mindful programming."],
                ["Real Estate", "Property presentation, context, and visual trust building."],
              ].map(([title, copy]) => (
                <Card key={title} className="bg-white/92 shadow-xl shadow-blue-950/8">
                  <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription className="leading-7">{copy}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <GalleryClient
            items={items.map((item) => ({
              title: item.title,
              category: item.category,
              type: item.type,
              url: item.url,
            }))}
          />
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
