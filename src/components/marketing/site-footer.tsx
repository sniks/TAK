"use client"

import Link from "next/link"
import { Globe2Icon, LinkIcon, MailIcon, MapPinIcon, MessageCircleIcon, PhoneCallIcon } from "lucide-react"

import { CallbackButton } from "@/components/marketing/callback-button"
import { useSiteData } from "@/components/marketing/site-data-provider"

const socialIconByLabel: Record<string, typeof Globe2Icon> = {
  instagram: Globe2Icon,
  facebook: Globe2Icon,
  linkedin: LinkIcon,
  "whatsapp channel": MessageCircleIcon,
}

export function SiteFooter() {
  const { settings, services } = useSiteData()

  return (
    <footer className="border-t border-white/10 bg-[var(--brand-navy)] pb-20 text-white lg:pb-28">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="grid gap-5 min-w-0">
          <div>
            <div className="text-xl font-semibold tracking-tight">{settings.companyName}</div>
            <p className="mt-3 max-w-md text-sm leading-7 text-white/72">
              {settings.description}
            </p>
          </div>
          <div className="grid gap-3 text-sm text-white/80 min-w-0">
            <div className="inline-flex min-w-0 items-center gap-2 text-left transition hover:text-white">
              <PhoneCallIcon className="size-4" />
              <CallbackButton variant="link" size="default" mode="call" source="Footer Call CTA" ctaType="call" className="h-auto p-0 text-sm text-inherit">
                {settings.primaryPhone}
              </CallbackButton>
            </div>
            <div className="inline-flex min-w-0 items-center gap-2 text-left transition hover:text-white">
              <MailIcon className="size-4" />
              <CallbackButton variant="link" size="default" mode="email" source="Footer Email CTA" ctaType="email" className="h-auto p-0 text-sm text-inherit">
                {settings.primaryEmail}
              </CallbackButton>
            </div>
            <div className="inline-flex items-start gap-2 text-white/72">
              <MapPinIcon className="size-4" />
              <span className="leading-6">{settings.citiesLabel}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <CallbackButton className="bg-[var(--brand-pink)] text-white hover:bg-[color-mix(in_oklab,var(--brand-pink),black_8%)]" source="Footer Callback CTA" ctaType="callback">
              Request Callback
            </CallbackButton>
            <CallbackButton
              className="border-white/18 text-white hover:bg-white/8"
              variant="outline"
              size="default"
              mode="whatsapp"
              source="Footer WhatsApp CTA"
              ctaType="whatsapp"
            >
              <MessageCircleIcon className="mr-2 size-4" />
              WhatsApp
            </CallbackButton>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-white/72">
            {settings.socialLinks.map((link) => {
              const Icon = socialIconByLabel[link.label.toLowerCase()] ?? Globe2Icon

              return (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={link.label}
                  className="inline-flex size-10 items-center justify-center rounded-full border border-white/12 transition hover:bg-white/8 hover:text-white"
                >
                  <Icon className="size-4" />
                </a>
              )
            })}
          </div>
        </div>

        <div className="min-w-0">
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-white/54">Services</div>
          <div className="mt-4 grid gap-2 text-sm text-white/72 sm:grid-cols-2">
            {services.map((service) => (
              <Link key={service.slug} href={`/services/${service.slug}`} className="transition hover:text-white">
                {service.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="min-w-0">
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-white/54">Quick Links</div>
          <div className="mt-4 grid gap-2 text-sm text-white/72">
            {settings.footerQuickLinks.map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-white">
                {item.label}
              </Link>
            ))}
          </div>
          <div className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-white/54">Read</div>
          <div className="mt-4 grid gap-2 text-sm text-white/72">
            <Link href="/blogs" className="transition hover:text-white">
              Blogs
            </Link>
            <Link href="/news" className="transition hover:text-white">
              News
            </Link>
            <Link href="/contact-us" className="transition hover:text-white">
              Contact
            </Link>
          </div>
        </div>

        <div className="min-w-0">
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-white/54">{settings.footer.trustHeading}</div>
          <div className="mt-4 grid gap-3 text-sm text-white/72">
            {settings.footer.trustPoints.map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                {item}
              </div>
            ))}
          </div>
          <div className="mt-6">
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-white/54">{settings.footer.newsletterLabel}</div>
            <form className="mt-4 flex w-full flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                className="h-11 w-full min-w-0 rounded-full border border-white/14 bg-white/8 px-4 text-sm text-white placeholder:text-white/40 sm:flex-1"
              />
              <CallbackButton
                variant="secondary"
                size="default"
                mode="email"
                source="Footer Newsletter CTA"
                ctaType="email"
                className="h-11 shrink-0 rounded-full bg-white px-5 text-sm font-medium text-[var(--brand-navy)] transition hover:bg-white/90"
              >
                Subscribe
              </CallbackButton>
            </form>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-5 text-sm text-white/60 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>Copyright 2026 {settings.legalName}. All rights reserved.</div>
          <div className="flex flex-wrap gap-4">
            {settings.legalLinks.map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-white">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
