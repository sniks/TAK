import type { ReactNode } from "react"
import type { Metadata } from "next"
import { MailIcon, MessageCircleIcon, PhoneCallIcon } from "lucide-react"

import { Breadcrumbs } from "@/components/marketing/breadcrumbs"
import { CallbackButton } from "@/components/marketing/callback-button"
import { EnquiryForm } from "@/components/marketing/enquiry-form"
import { Header } from "@/components/marketing/header"
import { SiteFooter } from "@/components/marketing/site-footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Reach Taakshvi Solution Hub by callback, WhatsApp, email, or a fully tracked service enquiry.",
}

export default async function ContactPage() {
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
                  copy="Talk to the assigned owner"
                  icon={<PhoneCallIcon />}
                >
                  <CallbackButton variant="outline" mode="call" source="Contact Page Call CTA" ctaType="call">
                    Call Now
                  </CallbackButton>
                </ContactCard>
                <ContactCard
                  title="WhatsApp"
                  copy="Instant service conversation"
                  icon={<MessageCircleIcon />}
                >
                  <CallbackButton variant="outline" mode="whatsapp" source="Contact Page WhatsApp CTA" ctaType="whatsapp">
                    Open WhatsApp
                  </CallbackButton>
                </ContactCard>
                <ContactCard
                  title="Email"
                  copy="Send a tracked email enquiry"
                  icon={<MailIcon />}
                >
                  <CallbackButton variant="outline" mode="email" source="Contact Page Email CTA" ctaType="email">
                    Email Team
                  </CallbackButton>
                </ContactCard>
              </div>
              <div className="mt-8">
                <CallbackButton className="bg-[var(--brand-pink)] text-white" source="Contact Page Callback CTA" ctaType="callback">
                  Open Callback Options
                </CallbackButton>
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
                <EnquiryForm source="Contact Page Form" ctaType="form" />
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
  icon,
  children,
}: {
  title: string
  copy: string
  icon: ReactNode
  children: ReactNode
}) {
  return (
    <div className="flex h-full min-h-[152px] w-full flex-col overflow-hidden rounded-2xl border border-border bg-white p-5 shadow-lg shadow-blue-950/6 transition hover:-translate-y-1 hover:shadow-xl">
      <div className="mb-3 flex size-11 shrink-0 items-center justify-center text-[var(--brand-pink)]">{icon}</div>
      <div className="min-w-0 font-semibold text-[var(--brand-navy)]">{title}</div>
      <div className="mt-1 min-w-0 break-words text-sm leading-6 text-muted-foreground [overflow-wrap:anywhere]">{copy}</div>
      <div className="mt-4">{children}</div>
    </div>
  )
}
