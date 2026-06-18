import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { Breadcrumbs } from "@/components/marketing/breadcrumbs"
import { Header } from "@/components/marketing/header"
import { SiteFooter } from "@/components/marketing/site-footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { estimateReadTime, formatPublishDate } from "@/lib/content"
import { prisma } from "@/lib/db"

export const metadata: Metadata = {
  title: "Blogs",
  description: "Read Taakshvi insights across events, travel, wellness, branding, finance, and real estate.",
}

export default async function BlogsPage() {
  const posts = await prisma.blogPost.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishDate: "desc" },
  })

  const featured = posts[0]
  const rest = posts.slice(1)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blogs" }]} />
        <div className="max-w-3xl">
          <h1 className="text-4xl font-semibold text-[var(--brand-navy)]">Insights from the Taakshvi network</h1>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            Thoughtful content helps visitors understand the depth behind our service categories before they enquire.
          </p>
        </div>

        {featured ? (
          <Card className="mt-10 overflow-hidden border-border/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(244,247,251,0.98))] shadow-xl shadow-blue-950/8">
            <CardHeader className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <Badge variant="secondary">Featured Article</Badge>
                <CardTitle className="mt-4 text-3xl leading-tight">{featured.title}</CardTitle>
                <CardDescription className="mt-4 text-base leading-8">{featured.shortDescription}</CardDescription>
                <div className="mt-5 flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span>{formatPublishDate(featured.publishDate)}</span>
                  <span>{estimateReadTime(featured.content)}</span>
                  <span>{featured.tags.slice(0, 2).join(" · ")}</span>
                </div>
                <Button className="mt-6 w-fit" render={<Link href={`/blogs/${featured.slug}`} />}>
                  Read Article
                  <ArrowRightIcon data-icon="inline-end" />
                </Button>
              </div>
              <div className="rounded-[1.75rem] bg-[linear-gradient(135deg,rgba(239,63,134,0.14),rgba(4,99,153,0.08),rgba(79,181,84,0.14))] p-6">
                <div className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--brand-pink)]">Topics</div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {featured.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <p className="mt-6 text-sm leading-7 text-muted-foreground">
                  Each article is designed to help visitors understand the depth, tone, and quality of the Taakshvi experience.
                </p>
              </div>
            </CardHeader>
          </Card>
        ) : null}

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {(rest.length ? rest : posts).map((post) => (
            <Link key={post.id} href={`/blogs/${post.slug}`}>
              <Card className="h-full transition hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-950/10">
                <CardHeader>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <CardTitle className="leading-tight">{post.title}</CardTitle>
                  <CardDescription className="leading-7">{post.shortDescription}</CardDescription>
                  <div className="text-sm text-muted-foreground">
                    {formatPublishDate(post.publishDate)} · {estimateReadTime(post.content)}
                  </div>
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
