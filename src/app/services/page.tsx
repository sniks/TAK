import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRightIcon, BadgeCheckIcon, SparklesIcon } from "lucide-react"

import { Breadcrumbs } from "@/components/marketing/breadcrumbs"
import { CallbackButton } from "@/components/marketing/callback-button"
import { Header } from "@/components/marketing/header"
import { SiteFooter } from "@/components/marketing/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { renderServiceIcon } from "@/lib/service-icons"
import { getPublicServices, getSiteSettings } from "@/lib/site-settings"

export const metadata: Metadata = {
  title: "Services",
  description: "Explore premium Taakshvi services with clear benefits, process, and enquiry pathways.",
}

const featuredGroups = [
  "Corporate experiences and team engagement",
  "Travel, retreats, and experiential wellness",
  "Brand building, media, and artist support",
  "Property, finance, lifestyle services, and digital transformation",
]

export default async function ServicesPage() {
  const [services, settings] = await Promise.all([getPublicServices(), getSiteSettings()])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="border-b border-border bg-[linear-gradient(135deg,rgba(239,63,134,0.08),rgba(4,99,153,0.02)_50%,rgba(79,181,84,0.08))]">
          <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.95fr] lg:px-8 lg:py-20">
            <div>
              <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Services" }]} />
              <h1 className="max-w-4xl text-4xl font-semibold leading-tight text-[var(--brand-navy)] sm:text-5xl">
                Premium services, one trusted brand, and a cleaner path from enquiry to execution.
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
                Taakshvi brings multiple service lines into one coordinated experience so clients can move faster with confidence instead of managing fragmented vendors and follow-up.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <CallbackButton className="bg-[var(--brand-pink)] text-white">Request Callback</CallbackButton>
                <Button variant="outline" render={<a href="#service-grid" />}>
                  Browse All Services
                  <ArrowRightIcon data-icon="inline-end" />
                </Button>
              </div>
            </div>

            <div className="grid items-stretch gap-4 sm:grid-cols-2">
              {featuredGroups.map((item, index) => (
                <Card key={item} className="h-full overflow-hidden bg-white/92 shadow-xl shadow-blue-950/8 backdrop-blur">
                  <CardHeader>
                    <div
                      className={
                        index % 2 === 0
                          ? "flex size-11 shrink-0 items-center justify-center text-[var(--brand-pink)]"
                          : "flex size-11 shrink-0 items-center justify-center text-[var(--brand-green)]"
                      }
                    >
                      <SparklesIcon />
                    </div>
                    <CardTitle className="text-lg">{item}</CardTitle>
                    <CardDescription className="leading-7">
                      Dedicated service pages, direct enquiry paths, and clear service coordination.
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="service-grid" className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--brand-pink)]">Service Categories</div>
              <h2 className="mt-3 text-3xl font-semibold text-[var(--brand-navy)]">{settings.homepage.servicesHeading}</h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
              Each page has its own context, enquiry path, and service guidance rather than feeling like a generic card list.
            </p>
          </div>
          <div className="grid items-stretch gap-4 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service, index) => {
              return (
              <Card key={service.slug} className="group h-full overflow-hidden border-border/80 bg-white transition hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-950/10">
                <CardHeader>
                  <div
                    className={
                      index % 3 === 0
                        ? "flex size-11 shrink-0 items-center justify-center text-[var(--brand-pink)]"
                        : index % 3 === 1
                          ? "flex size-11 shrink-0 items-center justify-center text-[var(--brand-blue)]"
                          : "flex size-11 shrink-0 items-center justify-center text-[var(--brand-green)]"
                    }
                  >
                    {renderServiceIcon(service.slug)}
                  </div>
                  <CardTitle>{service.name}</CardTitle>
                  <CardDescription className="leading-7">{service.summary}</CardDescription>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                    {service.questions.slice(0, 3).map((question) => (
                      <span key={question} className="rounded-full bg-muted px-3 py-1">
                        {question}
                      </span>
                    ))}
                  </div>
                  <Button variant="outline" render={<Link href={`/services/${service.slug}`} />} className="mt-4 w-fit">
                    View Service Page
                    <ArrowRightIcon data-icon="inline-end" />
                  </Button>
                </CardHeader>
              </Card>
              )
            })}
          </div>
        </section>

        <section className="border-y border-border bg-muted/35">
          <div className="mx-auto grid w-full max-w-7xl gap-4 px-4 py-16 sm:px-6 lg:grid-cols-4 lg:px-8">
            {[
              ["Discovery", "Capture the context, urgency, scale, and objective."],
              ["Routing", "Assign the right contact path by service and location."],
              ["Planning", "Define scope, deliverables, and next-step communication."],
              ["Delivery", "Keep execution and follow-up visible to the client."],
            ].map(([title, copy], index) => (
              <Card key={title} className="h-full overflow-hidden">
                <CardHeader>
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--brand-navy)] text-sm font-semibold text-white">
                    {index + 1}
                  </div>
                  <CardTitle>{title}</CardTitle>
                  <CardDescription className="leading-7">{copy}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-16 sm:px-6 lg:grid-cols-3 lg:px-8">
          {[
            ["Why clients choose Taakshvi", "Multi-service convenience, stronger accountability, and cleaner communication across the full journey."],
            ["What stays consistent", "Every service page follows the same conversion logic, callback system, and tracked lead workflow."],
            ["What changes by service", "Questions, messaging, benefits, and recommended next actions adapt to the selected category."],
          ].map(([title, copy]) => (
            <Card key={title} className="h-full overflow-hidden">
              <CardHeader>
                <div className="mb-3 flex size-11 shrink-0 items-center justify-center text-[var(--brand-green)]">
                  <BadgeCheckIcon />
                </div>
                <CardTitle>{title}</CardTitle>
                <CardDescription className="leading-7">{copy}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] bg-[linear-gradient(135deg,var(--brand-navy),var(--brand-blue))] px-6 py-10 text-white sm:px-8 lg:flex lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold">Need help choosing the right service path?</h2>
              <p className="mt-4 text-sm leading-7 text-white/72">
                Start with one conversation. We will direct your requirement to the right team and next step.
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
