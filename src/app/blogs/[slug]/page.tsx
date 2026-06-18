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
import { estimateReadTime, formatPublishDate, toParagraphs } from "@/lib/content"
import { prisma } from "@/lib/db"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await prisma.blogPost.findUnique({ where: { slug } })
  if (!post) return {}
  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.shortDescription,
    alternates: { canonical: post.canonicalUrl ?? `/blogs/${post.slug}` },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await prisma.blogPost.findUnique({ where: { slug } })
  if (!post || post.status !== "PUBLISHED") notFound()

  const related = await prisma.blogPost.findMany({
    where: { status: "PUBLISHED", id: { not: post.id }, tags: { hasSome: post.tags } },
    take: 3,
  })

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <article className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <aside>
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Blogs", href: "/blogs" },
                { label: post.title },
              ]}
            />
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
            <h1 className="mt-5 text-4xl font-semibold leading-tight text-[var(--brand-navy)]">{post.title}</h1>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">{post.shortDescription}</p>
            <div className="mt-6 grid gap-2 text-sm text-muted-foreground">
              <div>{formatPublishDate(post.publishDate)}</div>
              <div>{estimateReadTime(post.content)}</div>
              <div>Taakshvi Editorial Desk</div>
            </div>
            <Card className="mt-8 bg-[linear-gradient(135deg,var(--brand-navy),var(--brand-blue))] text-white">
              <CardHeader>
                <CardTitle className="text-xl">Need help on a related requirement?</CardTitle>
                <CardDescription className="text-white/72">
                  Move from reading to action with the same callback system used across the site.
                </CardDescription>
                <CallbackButton className="mt-3 bg-[var(--brand-pink)] text-white">Request Callback</CallbackButton>
              </CardHeader>
            </Card>
          </aside>

          <div>
            <div className="rounded-[2rem] border border-border bg-white p-8 shadow-xl shadow-blue-950/6">
              <div className="prose prose-neutral max-w-none text-foreground">
                {toParagraphs(post.content).map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>

            {related.length ? (
              <section className="mt-10">
                <h2 className="text-2xl font-semibold text-[var(--brand-navy)]">Related posts</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  {related.map((item) => (
                    <Card key={item.id}>
                      <CardHeader>
                        <CardTitle className="text-lg leading-tight">{item.title}</CardTitle>
                        <CardDescription className="leading-7">{item.shortDescription}</CardDescription>
                        <Button variant="outline" render={<Link href={`/blogs/${item.slug}`} />} className="mt-3 w-fit">
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
