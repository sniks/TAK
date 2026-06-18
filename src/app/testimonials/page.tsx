import type { Metadata } from "next"

import { Breadcrumbs } from "@/components/marketing/breadcrumbs"
import { CallbackButton } from "@/components/marketing/callback-button"
import { Header } from "@/components/marketing/header"
import { SiteFooter } from "@/components/marketing/site-footer"
import { TestimonialsCarousel } from "@/components/marketing/testimonials-carousel"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { prisma } from "@/lib/db"

export const metadata: Metadata = {
  title: "Testimonials",
  description: "See how Taakshvi clients describe the quality, responsiveness, and follow-through of the service experience.",
}

export default async function TestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="border-b border-border bg-[linear-gradient(135deg,rgba(239,63,134,0.08),rgba(4,99,153,0.02)_50%,rgba(79,181,84,0.08))]">
          <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8 lg:py-20">
            <div>
              <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Testimonials" }]} />
              <h1 className="text-4xl font-semibold leading-tight text-[var(--brand-navy)] sm:text-5xl">
                Real customer feedback, captured as proof of service quality and trust.
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
                Testimonials help visitors understand the tone of delivery before they enquire. They also reinforce that Taakshvi is active, accountable, and trusted across multiple categories.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ["Premium support", "Clients value responsiveness and clarity."],
                ["Multi-service confidence", "One trusted brand across varied needs."],
                ["Thoughtful follow-up", "Clients feel supported through clear, timely communication."],
                ["Repeatable quality", "Good operations make premium service scalable."],
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

        <section className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <TestimonialsCarousel
            items={testimonials.map((item) => ({
              id: item.id,
              name: item.name,
              company: item.company,
              rating: item.rating,
              review: item.review,
              photo: item.photo,
            }))}
          />
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] bg-[linear-gradient(135deg,var(--brand-navy),var(--brand-blue))] px-6 py-10 text-white sm:px-8 lg:flex lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold">Ready to add your requirement to the pipeline?</h2>
              <p className="mt-4 text-sm leading-7 text-white/72">
                Use the same callback system our customers start with so your requirement reaches the right owner fast.
              </p>
            </div>
            <div className="mt-6 lg:mt-0">
              <CallbackButton className="bg-[var(--brand-pink)] text-white">Request Callback</CallbackButton>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
