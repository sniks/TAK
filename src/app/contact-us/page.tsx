import type { ReactNode } from "react"
import type { Metadata } from "next"
import { MailIcon, MessageCircleIcon, PhoneCallIcon } from "lucide-react"

import { Breadcrumbs } from "@/components/marketing/breadcrumbs"
import { CallbackButton } from "@/components/marketing/callback-button"
import { EnquiryForm } from "@/components/marketing/enquiry-form"
import { Header } from "@/components/marketing/header"
import { SiteFooter } from "@/components/marketing/site-footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { siteConfig } from "@/lib/site"

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Reach Taakshvi Solution Hub by callback, WhatsApp, email, or a fully tracked service enquiry.",
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="border-b border-border bg-[linear-gradient(135deg,rgba(239,63,134,0.08),rgba(4,99,153,0.02)_50%,rgba(79,181,84,0.08))]">
          <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-20">
            <div>
              <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact Us" }]} />
              <h1 className="text-4xl font-semibold leading-tight text-[var(--brand-navy)] sm:text-5xl">
                Choose the contact path that fits your urgency and service type.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
                Callback, WhatsApp, email, and the full enquiry form all help you start the conversation in the way that feels most convenient.
              </p>
              <div className="mt-8 grid items-stretch gap-4 sm:grid-cols-3">
                <ContactCard
                  title="Call"
                  copy={siteConfig.phone}
                  href={`tel:${siteConfig.phone}`}
                  icon={<PhoneCallIcon />}
                />
                <ContactCard
                  title="WhatsApp"
                  copy="Instant service conversation"
                  href={`https://wa.me/${siteConfig.phone}?text=Hello%20Team%2C%20I%20would%20like%20to%20discuss%20a%20service%20requirement.`}
                  icon={<MessageCircleIcon />}
                />
                <ContactCard
                  title="Email"
                  copy={siteConfig.email}
                  href={`mailto:${siteConfig.email}`}
                  icon={<MailIcon />}
                />
              </div>
              <div className="mt-8">
                <CallbackButton className="bg-[var(--brand-pink)] text-white">Open Callback Options</CallbackButton>
              </div>
            </div>

            <Card className="bg-white shadow-2xl shadow-blue-950/10">
              <CardHeader>
                <CardTitle>Submit a tracked enquiry</CardTitle>
                <CardDescription>
                  Share your requirement clearly and our team will respond with the most relevant next step.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EnquiryForm />
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}

function ContactCard({
  title,
  copy,
  href,
  icon,
}: {
  title: string
  copy: string
  href: string
  icon: ReactNode
}) {
  return (
    <a
      href={href}
      className="flex h-full min-h-[152px] w-full flex-col overflow-hidden rounded-2xl border border-border bg-white p-5 shadow-lg shadow-blue-950/6 transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="mb-3 flex size-11 shrink-0 items-center justify-center text-[var(--brand-pink)]">{icon}</div>
      <div className="min-w-0 font-semibold text-[var(--brand-navy)]">{title}</div>
      <div className="mt-1 min-w-0 break-words text-sm leading-6 text-muted-foreground [overflow-wrap:anywhere]">{copy}</div>
    </a>
  )
}
