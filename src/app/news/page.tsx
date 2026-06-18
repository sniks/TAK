import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { Breadcrumbs } from "@/components/marketing/breadcrumbs"
import { Header } from "@/components/marketing/header"
import { SiteFooter } from "@/components/marketing/site-footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatPublishDate } from "@/lib/content"
import { prisma } from "@/lib/db"

export const metadata: Metadata = {
  title: "News",
  description: "Media mentions, external coverage, and published updates related to Taakshvi Solution Hub.",
}

export default async function NewsPage() {
  const posts = await prisma.newsPost.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishDate: "desc" },
  })

  const featured = posts[0]
  const rest = posts.slice(1)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "News" }]} />
        <div className="max-w-3xl">
          <h1 className="text-4xl font-semibold text-[var(--brand-navy)]">Media coverage and published updates</h1>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            News helps validate that the brand is active, visible, and trusted beyond the website itself.
          </p>
        </div>

        {featured ? (
          <Card className="mt-10 border-border/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(244,247,251,0.98))] shadow-xl shadow-blue-950/8">
            <CardHeader className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <Badge variant="secondary">Featured Coverage</Badge>
                <CardTitle className="mt-4 text-3xl leading-tight">{featured.title}</CardTitle>
                <CardDescription className="mt-4 text-base leading-8">{featured.shortDescription}</CardDescription>
                <div className="mt-5 flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span>{featured.sourceName ?? "External Source"}</span>
                  <span>{formatPublishDate(featured.publishDate)}</span>
                </div>
                <Button className="mt-6 w-fit" render={<Link href={`/news/${featured.slug}`} />}>
                  Read Coverage
                  <ArrowRightIcon data-icon="inline-end" />
                </Button>
              </div>
              <div className="rounded-[1.75rem] bg-[linear-gradient(135deg,rgba(239,63,134,0.14),rgba(4,99,153,0.08),rgba(79,181,84,0.14))] p-6">
                <div className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--brand-pink)]">Why it matters</div>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                  External references reinforce public trust and show that Taakshvi is a live operating brand rather than a static brochure site.
                </p>
              </div>
            </CardHeader>
          </Card>
        ) : null}

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {(rest.length ? rest : posts).map((post) => (
            <Link key={post.id} href={`/news/${post.slug}`}>
              <Card className="h-full transition hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-950/10">
                <CardHeader>
                  <Badge variant="secondary">{post.sourceName ?? "Coverage"}</Badge>
                  <CardTitle className="leading-tight">{post.title}</CardTitle>
                  <CardDescription className="leading-7">{post.shortDescription}</CardDescription>
                  <div className="text-sm text-muted-foreground">{formatPublishDate(post.publishDate)}</div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
