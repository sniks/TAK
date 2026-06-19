import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRightIcon, BadgeCheckIcon, Building2Icon, ShieldCheckIcon, SparklesIcon, WorkflowIcon } from "lucide-react"

import { Breadcrumbs } from "@/components/marketing/breadcrumbs"
import { CallbackButton } from "@/components/marketing/callback-button"
import { Header } from "@/components/marketing/header"
import { SiteFooter } from "@/components/marketing/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getSiteSettings } from "@/lib/site-settings"

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn how Taakshvi Solution Hub brings together premium service coordination across multiple life and business needs.",
}

const values = [
  ["Clarity First", "Every enquiry is qualified, routed, and followed up with clean ownership."],
  ["Premium Execution", "We design service experiences that feel considered from first contact to final delivery."],
  ["Trust & Privacy", "Public trust signals stay visible while customer-sensitive data remains protected."],
  ["Accountability", "Our team takes ownership of the next step so clients feel supported instead of left guessing."],
]

const timeline = [
  ["Discovery", "Understand the client requirement, expected outcome, urgency, and service fit."],
  ["Routing", "Direct the enquiry to the right owner based on service, city, and operational context."],
  ["Planning", "Structure scope, feasibility, vendor flow, and customer communication."],
  ["Execution", "Deliver the service with visible follow-up and a single accountable point of contact."],
]

const operatingCards = [
  {
    icon: SparklesIcon,
    title: "Premium first impression",
    copy: "A service business should look active, current, and professionally managed the moment a visitor lands.",
  },
  {
    icon: WorkflowIcon,
    title: "Thoughtful service coordination",
    copy: "Each requirement is guided toward the conversation, specialist, and next step that fits best.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Protected customer data",
    copy: "Public trust widgets never leak personal information while internal records stay complete.",
  },
  {
    icon: Building2Icon,
    title: "Connected brand experience",
    copy: "Our website, communication style, and service delivery approach are designed to feel like one coherent brand.",
  },
]

export default async function AboutPage() {
  const settings = await getSiteSettings()

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="border-b border-border bg-[linear-gradient(135deg,rgba(239,63,134,0.08),rgba(4,99,153,0.03)_48%,rgba(79,181,84,0.08))]">
          <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-20">
            <div>
              <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About Us" }]} />
              <h1 className="max-w-4xl text-4xl font-semibold leading-tight text-[var(--brand-navy)] sm:text-5xl">
                {settings.aboutHeadline}
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">{settings.aboutDescription}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <CallbackButton className="bg-[var(--brand-pink)] text-white">
                  Request Callback
                </CallbackButton>
                <Button variant="outline" render={<Link href="/services" />}>
                  Explore Services
                  <ArrowRightIcon data-icon="inline-end" />
                </Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ["13+", "Service categories under one brand"],
                ["Fast response", "Callback, WhatsApp, email, and guided conversations"],
                ["Multi-city", settings.citiesLabel],
                ["Trusted support", "One premium service desk coordinating discovery, follow-up, and next steps."],
              ].map(([value, label]) => (
                <Card key={label} className="bg-white/92 shadow-xl shadow-blue-950/8 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="text-3xl text-[var(--brand-navy)]">{value}</CardTitle>
                    <CardDescription className="text-sm leading-7">{label}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div className="flex flex-col gap-4">
            <div className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--brand-pink)]">Our Story</div>
            <h2 className="text-3xl font-semibold text-[var(--brand-navy)]">Why Taakshvi exists</h2>
            <p className="text-base leading-8 text-muted-foreground">
              Many customers need a trusted partner, not just a directory. Events, travel, wellness, branding, finance, and real estate often overlap. Taakshvi was designed to create one premium front door for those enquiries and one disciplined operating system behind them.
            </p>
            <p className="text-base leading-8 text-muted-foreground">
              That combination matters. The public website should inspire confidence, while the service experience should stay responsive, thoughtful, and professionally managed from first contact onward.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {operatingCards.map((item) => (
              <Card key={item.title}>
                <CardHeader>
                  <div className="mb-3 flex size-11 items-center justify-center rounded-2xl bg-muted text-[var(--brand-blue)]">
                    <item.icon />
                  </div>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription className="leading-7">{item.copy}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section className="border-y border-border bg-muted/35">
          <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--brand-pink)]">Operating Model</div>
              <h2 className="mt-3 text-3xl font-semibold text-[var(--brand-navy)]">How our service journey works</h2>
              <div className="mt-8 grid gap-4">
                {timeline.map(([title, copy], index) => (
                  <div key={title} className="grid grid-cols-[auto_1fr] gap-4 rounded-2xl border border-border bg-white p-5">
                    <div className="flex size-10 items-center justify-center rounded-full bg-[var(--brand-navy)] text-sm font-semibold text-white">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-semibold text-[var(--brand-navy)]">{title}</div>
                      <div className="mt-1 text-sm leading-7 text-muted-foreground">{copy}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              <Card className="bg-white shadow-xl shadow-blue-950/8">
                <CardHeader>
                  <CardTitle>Vision</CardTitle>
                  <CardDescription className="leading-7">
                    Build the most dependable premium solution hub for customers who want expert coordination across business, lifestyle, and growth services.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="bg-white shadow-xl shadow-blue-950/8">
                <CardHeader>
                  <CardTitle>Mission</CardTitle>
                  <CardDescription className="leading-7">
                    Turn every enquiry into a well-managed customer journey with clear discovery, responsive follow-up, and confident execution.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="bg-white shadow-xl shadow-blue-950/8">
                <CardHeader>
                  <CardTitle>Leadership Approach</CardTitle>
                  <CardDescription className="leading-7">
                    Operate with fewer gaps between marketing, lead capture, and service delivery so customers experience one coherent brand instead of disconnected teams.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-4 lg:grid-cols-4">
            {values.map(([title, copy]) => (
              <Card key={title}>
                <CardHeader>
                  <div className="mb-3 text-[var(--brand-green)]">
                    <BadgeCheckIcon />
                  </div>
                  <CardTitle>{title}</CardTitle>
                  <CardDescription className="leading-7">{copy}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] bg-[linear-gradient(135deg,var(--brand-navy),color-mix(in_oklab,var(--brand-navy),black_10%)_58%,var(--brand-blue))] px-6 py-10 text-white sm:px-8 lg:flex lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="text-sm font-semibold uppercase tracking-[0.24em] text-white/60">Next Step</div>
              <h2 className="mt-3 text-3xl font-semibold">Tell us what you need. We will route it properly.</h2>
              <p className="mt-4 text-sm leading-7 text-white/72">
                Whether the requirement starts with corporate events, travel, wellness, branding, finance, or real estate, the same tracked operating layer keeps the conversation moving.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3 lg:mt-0">
              <CallbackButton className="bg-[var(--brand-pink)] text-white">
                Request Callback
              </CallbackButton>
              <Button variant="secondary" render={<Link href="/contact-us" />}>
                Contact Us
              </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
