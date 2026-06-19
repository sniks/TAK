import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRightIcon, BadgeCheckIcon, CheckCircle2Icon, MessageCircleIcon } from "lucide-react"

import { Breadcrumbs } from "@/components/marketing/breadcrumbs"
import { CallbackButton } from "@/components/marketing/callback-button"
import { EnquiryForm } from "@/components/marketing/enquiry-form"
import { Header } from "@/components/marketing/header"
import { SiteFooter } from "@/components/marketing/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getPublicServices, getSiteSettings } from "@/lib/site-settings"

type Props = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return []
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const services = await getPublicServices()
  const service = services.find((item) => item.slug === slug)
  if (!service) return {}

  return {
    title: service.name,
    description: service.summary,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: {
      title: `${service.name} | TAAKSHVI Solution Hub`,
      description: service.summary,
      url: `/services/${service.slug}`,
    },
  }
}

function getBenefits(serviceName: string) {
  return [
    `Clear discovery for ${serviceName.toLowerCase()} requirements before planning starts.`,
    "Dedicated callback, WhatsApp, email, and form-led contact paths.",
    "Dependable follow-up instead of scattered manual communication.",
    "A premium front-end experience that sets expectations correctly.",
  ]
}

function getFaqs(serviceName: string) {
  return [
    {
      question: `How quickly will someone contact me about ${serviceName.toLowerCase()}?`,
      answer:
        "After submission, the enquiry is reviewed by the Taakshvi team and directed to the most relevant contact path so follow-up can happen quickly and with context.",
    },
    {
      question: "Can I share detailed requirements before the callback?",
      answer:
        "Yes. The enquiry form includes service-specific fields and a requirement details field so the team receives useful context before they respond.",
    },
    {
      question: "Can I connect over WhatsApp instead of waiting for a call?",
      answer:
        "Yes. The callback modal lets you switch to WhatsApp or email with your service details already prepared for the next conversation.",
    },
  ]
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params
  const [services, settings] = await Promise.all([getPublicServices(), getSiteSettings()])
  const service = services.find((item) => item.slug === slug)
  if (!service) notFound()

  const relatedServices = services.filter((item) => item.slug !== service.slug).slice(0, 3)
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: getFaqs(service.name).map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="border-b border-border bg-[linear-gradient(135deg,rgba(239,63,134,0.08),rgba(4,99,153,0.02)_50%,rgba(79,181,84,0.08))]">
          <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.95fr] lg:px-8 lg:py-20">
            <div>
              <Breadcrumbs
                items={[
                  { label: "Home", href: "/" },
                  { label: "Services", href: "/services" },
                  { label: service.name },
                ]}
              />
              <h1 className="max-w-4xl text-4xl font-semibold leading-tight text-[var(--brand-navy)] sm:text-5xl">
                {service.name}
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">{service.summary}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <CallbackButton service={service.slug} className="bg-[var(--brand-pink)] text-white">
                  Request Callback
                </CallbackButton>
                <Button
                  variant="outline"
                  render={
                    <a
                      href={`https://wa.me/${settings.primaryWhatsapp}?text=Hello%20Team%2C%20I%20am%20interested%20in%20${encodeURIComponent(service.name)}.`}
                    />
                  }
                >
                  <MessageCircleIcon data-icon="inline-start" />
                  WhatsApp Now
                </Button>
              </div>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {["Premium experience design", "Tracked lead workflow", "Service-specific form fields", "Multi-path conversion"].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-full bg-white px-4 py-3 text-sm font-medium text-[var(--brand-navy)] shadow-lg shadow-blue-950/6">
                    <BadgeCheckIcon className="text-[var(--brand-green)]" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <Card className="bg-white shadow-2xl shadow-blue-950/10">
              <CardHeader>
                <CardTitle>Tell us your requirement</CardTitle>
                <CardDescription>
                  Service-specific fields are selected automatically to make your enquiry easier to understand.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EnquiryForm defaultService={service.slug} />
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-16 sm:px-6 lg:grid-cols-3 lg:px-8">
          {[
            ["Why this service matters", `${service.name} should feel coordinated, premium, and accountable from first outreach to final execution.`],
            ["What we capture", service.questions.join(", ")],
            ["What the client gets", "Clear communication, faster follow-up, and a smoother path from first enquiry to next step."],
          ].map(([title, copy]) => (
            <Card key={title}>
              <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription className="leading-7">{copy}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </section>

        <section className="border-y border-border bg-muted/35">
          <div className="mx-auto grid w-full max-w-7xl gap-4 px-4 py-16 sm:px-6 lg:grid-cols-4 lg:px-8">
            {getBenefits(service.name).map((item) => (
              <Card key={item} className="bg-white">
                <CardHeader>
                  <div className="mb-3 text-[var(--brand-green)]">
                    <CheckCircle2Icon />
                  </div>
                  <CardDescription className="text-sm leading-7 text-foreground">{item}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--brand-pink)]">Process</div>
            <h2 className="mt-3 text-3xl font-semibold text-[var(--brand-navy)]">How this journey moves</h2>
          </div>
          <div className="grid gap-4 lg:grid-cols-4">
            {["Share requirement", "Receive routed response", "Confirm scope", "Move to execution"].map((step, index) => (
              <Card key={step}>
                <CardHeader>
                  <div className="flex size-10 items-center justify-center rounded-full bg-[var(--brand-navy)] text-sm font-semibold text-white">
                    {index + 1}
                  </div>
                  <CardTitle>{step}</CardTitle>
                  <CardDescription className="leading-7">
                    Step {index + 1} is tracked within the same operational system supporting the public site.
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 pb-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div className="grid gap-4">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--brand-pink)]">FAQs</div>
              <h2 className="mt-3 text-3xl font-semibold text-[var(--brand-navy)]">Common questions</h2>
            </div>
            {getFaqs(service.name).map((item) => (
              <Card key={item.question}>
                <CardHeader>
                  <CardTitle className="text-lg">{item.question}</CardTitle>
                  <CardDescription className="leading-7">{item.answer}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          <div className="grid gap-4">
            <Card className="bg-[linear-gradient(135deg,var(--brand-navy),var(--brand-blue))] text-white">
              <CardHeader>
                <CardTitle className="text-2xl">Related services</CardTitle>
                <CardDescription className="text-white/72">
                  Requirements often span multiple categories. Continue exploring adjacent service paths.
                </CardDescription>
              </CardHeader>
            </Card>
            {relatedServices.map((item) => (
              <Card key={item.slug} className="bg-white">
                <CardHeader>
                  <CardTitle>{item.name}</CardTitle>
                  <CardDescription className="leading-7">{item.summary}</CardDescription>
                  <Button variant="outline" render={<Link href={`/services/${item.slug}`} />} className="mt-4 w-fit">
                    Explore {item.name}
                    <ArrowRightIcon data-icon="inline-end" />
                  </Button>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </div>
  )
}
