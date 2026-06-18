import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { Breadcrumbs } from "@/components/marketing/breadcrumbs"
import { CallbackButton } from "@/components/marketing/callback-button"
import { Header } from "@/components/marketing/header"
import { SiteFooter } from "@/components/marketing/site-footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatPublishDate, getNewsEmbed, toParagraphs } from "@/lib/content"
import { prisma } from "@/lib/db"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await prisma.newsPost.findUnique({ where: { slug } })
  if (!post) return {}
  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.shortDescription,
  }
}

export default async function NewsPostPage({ params }: Props) {
  const { slug } = await params
  const post = await prisma.newsPost.findUnique({ where: { slug } })
  if (!post || post.status !== "PUBLISHED") notFound()

  const related = await prisma.newsPost.findMany({
    where: { status: "PUBLISHED", id: { not: post.id } },
    orderBy: { publishDate: "desc" },
    take: 3,
  })
  const embedUrl = getNewsEmbed(post.newsUrl)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <article className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <aside>
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "News", href: "/news" },
                { label: post.title },
              ]}
            />
            <Badge variant="secondary">{post.sourceName ?? "Coverage"}</Badge>
            <h1 className="mt-5 text-4xl font-semibold leading-tight text-[var(--brand-navy)]">{post.title}</h1>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">{post.shortDescription}</p>
            <div className="mt-6 grid gap-2 text-sm text-muted-foreground">
              <div>{formatPublishDate(post.publishDate)}</div>
              <div>{post.sourceName ?? "External coverage source"}</div>
            </div>
            <Card className="mt-8 bg-[linear-gradient(135deg,var(--brand-navy),var(--brand-blue))] text-white">
              <CardHeader>
                <CardTitle className="text-xl">Want to discuss a similar requirement?</CardTitle>
                <CardDescription className="text-white/72">
                  Move from media coverage to a direct conversation with the Taakshvi team.
                </CardDescription>
                <CallbackButton className="mt-3 bg-[var(--brand-pink)] text-white">Request Callback</CallbackButton>
              </CardHeader>
            </Card>
            {post.newsUrl ? (
              <Button variant="outline" render={<a href={post.newsUrl} target="_blank" rel="noreferrer" />} className="mt-4 w-fit">
                Read Original Source
              </Button>
            ) : null}
          </aside>

          <div className="grid gap-8">
            {embedUrl ? (
              <div className="overflow-hidden rounded-[2rem] border border-border bg-white shadow-xl shadow-blue-950/6">
                <div className="aspect-video">
                  <iframe
                    className="size-full"
                    src={embedUrl}
                    title={post.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            ) : null}

            <div className="rounded-[2rem] border border-border bg-white p-8 shadow-xl shadow-blue-950/6">
              <div className="prose prose-neutral max-w-none text-foreground">
                {toParagraphs(post.content).map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>

            {related.length ? (
              <section>
                <h2 className="text-2xl font-semibold text-[var(--brand-navy)]">Related coverage</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  {related.map((item) => (
                    <Card key={item.id}>
                      <CardHeader>
                        <CardTitle className="text-lg leading-tight">{item.title}</CardTitle>
                        <CardDescription className="leading-7">{item.shortDescription}</CardDescription>
                        <Button variant="outline" render={<Link href={`/news/${item.slug}`} />} className="mt-3 w-fit">
                          Read More
                        </Button>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        </div>
      </article>
      <SiteFooter />
    </div>
  )
}
