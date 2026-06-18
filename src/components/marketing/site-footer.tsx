import Link from "next/link"
import { Globe2Icon, MailIcon, MapPinIcon, MessageCircleIcon, PhoneCallIcon } from "lucide-react"

import { CallbackButton } from "@/components/marketing/callback-button"
import { serviceCategories, siteConfig } from "@/lib/site"

const trustSignals = [
  "Dedicated Service Coordination",
  "Fast Response",
  "Personalized Support",
  "Trusted Partners",
  "Multi-City Network",
  "Professional Consultation",
]

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[var(--brand-navy)] pb-20 text-white lg:pb-28">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="grid gap-5 min-w-0">
          <div>
            <div className="text-xl font-semibold tracking-tight">{siteConfig.name}</div>
            <p className="mt-3 max-w-md text-sm leading-7 text-white/72">
              A premium solution hub for events, travel, wellness, branding, finance, property, and consultation-led support.
            </p>
          </div>
          <div className="grid gap-3 text-sm text-white/80 min-w-0">
            <a className="inline-flex min-w-0 items-center gap-2 transition hover:text-white" href={`tel:${siteConfig.phone}`}>
              <PhoneCallIcon className="size-4" />
              {siteConfig.phone}
            </a>
            <a className="inline-flex min-w-0 items-center gap-2 transition hover:text-white" href={`mailto:${siteConfig.email}`}>
              <MailIcon className="size-4" />
              {siteConfig.email}
            </a>
            <div className="inline-flex items-start gap-2 text-white/72">
              <MapPinIcon className="size-4" />
              <span className="leading-6">Mumbai • Ahmedabad • Nasik • Lucknow</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <CallbackButton className="bg-[var(--brand-pink)] text-white hover:bg-[color-mix(in_oklab,var(--brand-pink),black_8%)]">
              Request Callback
            </CallbackButton>
            <a
              className="inline-flex h-10 items-center justify-center rounded-full border border-white/18 px-5 text-sm font-medium text-white transition hover:bg-white/8"
              href={`https://wa.me/${siteConfig.phone}?text=Hello%20Team%2C%20I%20would%20like%20to%20know%20more%20about%20Taakshvi%20services.`}
            >
              <MessageCircleIcon className="mr-2 size-4" />
              WhatsApp
            </a>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-white/72">
            {siteConfig.socialLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                aria-label={link.label}
                className="inline-flex size-10 items-center justify-center rounded-full border border-white/12 transition hover:bg-white/8 hover:text-white"
              >
                {link.label === "Instagram" ? <Globe2Icon className="size-4" /> : <MessageCircleIcon className="size-4" />}
              </a>
            ))}
          </div>
        </div>

        <div className="min-w-0">
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-white/54">Services</div>
          <div className="mt-4 grid gap-2 text-sm text-white/72">
            {serviceCategories.slice(0, 8).map((service) => (
              <Link key={service.slug} href={`/services/${service.slug}`} className="transition hover:text-white">
                {service.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="min-w-0">
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-white/54">Quick Links</div>
          <div className="mt-4 grid gap-2 text-sm text-white/72">
            {siteConfig.footerQuickLinks.map((item) => (
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
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-white/54">Why Clients Trust Us</div>
          <div className="mt-4 grid gap-3 text-sm text-white/72">
            {trustSignals.map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                {item}
              </div>
            ))}
          </div>
          <div className="mt-6">
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-white/54">Newsletter Signup</div>
            <form className="mt-4 flex w-full flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                className="h-11 w-full min-w-0 rounded-full border border-white/14 bg-white/8 px-4 text-sm text-white placeholder:text-white/40 sm:flex-1"
              />
              <a
                href={`mailto:${siteConfig.email}?subject=Newsletter%20Signup&body=Please%20add%20me%20to%20the%20Taakshvi%20newsletter.`}
                className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-white px-5 text-sm font-medium text-[var(--brand-navy)] transition hover:bg-white/90"
              >
                Subscribe
              </a>
            </form>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-5 text-sm text-white/60 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>Copyright 2026 {siteConfig.legalName}. All rights reserved.</div>
          <div className="flex flex-wrap gap-4">
            {siteConfig.legalLinks.map((item) => (
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
