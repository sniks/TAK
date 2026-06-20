"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { PhoneCallIcon } from "lucide-react"

import { CallbackButton } from "@/components/marketing/callback-button"
import { useSiteData } from "@/components/marketing/site-data-provider"

export function Header() {
  const pathname = usePathname()
  const { settings } = useSiteData()

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/brand/taakshvi-logo.jpeg"
            alt="TAAKSHVI Solution Hub logo"
            width={54}
            height={54}
            className="size-12 rounded-lg object-contain"
            priority
          />
          <div className="hidden flex-col leading-none sm:flex">
            <span className="text-base font-semibold text-[var(--brand-navy)]">TAAKSHVI</span>
            <span className="text-xs font-medium tracking-[0.22em] text-muted-foreground">
              SOLUTION HUB
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-muted-foreground lg:flex">
          {settings.nav.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`transition hover:text-foreground ${isActive ? "text-foreground" : ""}`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="hidden items-center gap-3 sm:flex">
          <CallbackButton
            variant="outline"
            size="lg"
            mode="call"
            source="Header Call CTA"
            ctaType="call"
          >
            <PhoneCallIcon data-icon="inline-start" />
            {settings.primaryPhone}
          </CallbackButton>
          <CallbackButton
            className="bg-[var(--brand-pink)] text-white hover:bg-[color-mix(in_oklab,var(--brand-pink),black_8%)]"
            size="lg"
            source="Header Callback CTA"
            ctaType="callback"
          >
            <PhoneCallIcon data-icon="inline-start" />
            Request Callback
          </CallbackButton>
        </div>

        <CallbackButton className="bg-[var(--brand-pink)] text-white sm:hidden" size="sm" source="Mobile Header Callback CTA" ctaType="callback">
          <PhoneCallIcon data-icon="inline-start" />
          Callback
        </CallbackButton>
      </div>
    </header>
  )
}
