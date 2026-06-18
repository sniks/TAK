import { HomePage } from "@/components/marketing/home-page"
import { getRecentEnquiries } from "@/lib/dashboard-data"
import { prisma } from "@/lib/db"

export default async function Page() {
  const [recentEnquiries, testimonials] = await Promise.all([
    getRecentEnquiries(),
    prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ])

  return <HomePage recentEnquiries={recentEnquiries} testimonials={testimonials} />
}
