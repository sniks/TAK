import { HomePage } from "@/components/marketing/home-page"
import { getRecentEnquiries } from "@/lib/dashboard-data"
import { prisma } from "@/lib/db"
import { getSiteSettings } from "@/lib/site-settings"

export default async function Page() {
  const settings = await getSiteSettings()

  const [recentEnquiries, testimonials, mediaItems] = await Promise.all([
    getRecentEnquiries(settings.recentEnquiries.limit),
    prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.newsPost.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishDate: "desc" },
      take: 3,
    }),
  ])

  return (
    <HomePage
      recentEnquiries={recentEnquiries}
      testimonials={testimonials}
      mediaItems={mediaItems.map((item) => ({
        id: item.id,
        title: item.title,
        source: item.sourceName,
        href: item.newsUrl || `/news/${item.slug}`,
        description: item.shortDescription,
      }))}
    />
  )
}
