"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import {
  ArrowRightIcon,
  BadgeCheckIcon,
  BriefcaseBusinessIcon,
  Building2Icon,
  CameraIcon,
  HeartPulseIcon,
  HomeIcon,
  MapPinnedIcon,
  MegaphoneIcon,
  PlaneIcon,
  ShieldCheckIcon,
  SparklesIcon,
  StarIcon,
  TargetIcon,
  TheaterIcon,
  UsersRoundIcon,
} from "lucide-react"

import { CallbackButton } from "@/components/marketing/callback-button"
import { EnquiryForm } from "@/components/marketing/enquiry-form"
import { Header } from "@/components/marketing/header"
import { useSiteData } from "@/components/marketing/site-data-provider"
import { SiteFooter } from "@/components/marketing/site-footer"
import { TestimonialsCarousel } from "@/components/marketing/testimonials-carousel"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

type RecentEnquiry = {
  id: string
  name: string
  city: string
  service: string
  time: string
}

type TestimonialItem = {
  id: string
  name: string
  company: string | null
  rating: number
  review: string
  photo?: string | null
}

type MediaItem = {
  id: string
  title: string
  source: string | null
  href: string | null
  description: string
}

const serviceIcons = [
  BriefcaseBusinessIcon,
  PlaneIcon,
  SparklesIcon,
  MegaphoneIcon,
  CameraIcon,
  TheaterIcon,
  Building2Icon,
  UsersRoundIcon,
  HomeIcon,
  TargetIcon,
  StarIcon,
  HeartPulseIcon,
  ShieldCheckIcon,
]

const whyChooseCards = [
  {
    icon: ShieldCheckIcon,
    title: "Trusted Service Network",
    copy: "Curated partners and experienced coordinators across events, travel, wellness, property, and brand support.",
  },
  {
    icon: SparklesIcon,
    title: "Quick Response Team",
    copy: "Your requirement reaches the right conversation path quickly, with callback, WhatsApp, and email options.",
  },
  {
    icon: TargetIcon,
    title: "Personalized Solutions",
    copy: "We shape the experience around your goals, budget, timeline, and preferred level of support.",
  },
  {
    icon: UsersRoundIcon,
    title: "End-To-End Coordination",
    copy: "From first brief to final execution, one brand experience keeps communication cleaner and more dependable.",
  },
  {
    icon: MapPinnedIcon,
    title: "Multi-City Coverage",
    copy: "Support across Mumbai, Ahmedabad, Nasik, and Lucknow, plus destination-led service requirements.",
  },
  {
    icon: BadgeCheckIcon,
    title: "Verified Service Partners",
    copy: "A dependable network helps each category feel more premium, responsive, and professionally managed.",
  },
]

export function HomePage({
  recentEnquiries,
  testimonials,
  mediaItems,
}: {
  recentEnquiries: RecentEnquiry[]
  testimonials: TestimonialItem[]
  mediaItems: MediaItem[]
}) {
  const { settings, services } = useSiteData()
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const smoothX = useSpring(mouseX, { stiffness: 80, damping: 18 })
  const smoothY = useSpring(mouseY, { stiffness: 80, damping: 18 })
  const collageX = useTransform(smoothX, [-0.5, 0.5], [-22, 22])
  const collageY = useTransform(smoothY, [-0.5, 0.5], [-16, 16])
  const formX = useTransform(smoothX, [-0.5, 0.5], [12, -12])
  const ribbonRotate = useTransform(smoothX, [-0.5, 0.5], [-6, 6])
  const glowShift = useTransform(smoothY, [-0.5, 0.5], [-18, 18])

  return (
    <div
      className="min-h-screen bg-background"
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect()
        mouseX.set((event.clientX - rect.width / 2) / rect.width)
        mouseY.set((event.clientY - rect.height / 2) / rect.height)
      }}
    >
      <Header />
      <main>
        <section className="relative overflow-hidden border-b border-border/70 bg-white">
          <motion.div
            style={{ x: glowShift }}
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(112deg,rgba(239,63,134,0.08),rgba(4,99,153,0.04)_46%,rgba(79,181,84,0.11))]"
          />
          <div className="pointer-events-none absolute left-0 top-16 h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--brand-pink),transparent_70%),transparent_65%)] blur-3xl" />
          <div className="pointer-events-none absolute right-10 top-0 h-[580px] w-[580px] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--brand-green),transparent_74%),transparent_62%)] blur-3xl" />

          <div className="relative mx-auto grid w-full max-w-[1540px] gap-6 px-4 pb-10 pt-8 sm:px-6 lg:grid-cols-[0.96fr_0.98fr_0.82fr] lg:px-8 lg:pb-0 lg:pt-7">
            <div className="flex flex-col justify-start gap-7 py-12 lg:min-h-[510px]">
              <div className="w-fit rounded-full border border-pink-100 bg-white/75 px-4 py-2 text-sm font-medium text-[var(--brand-pink)] shadow-sm backdrop-blur">
                {settings.homepage.heroBadge}
              </div>
              <div className="flex flex-col gap-5">
                <h1 className="max-w-3xl text-4xl font-semibold leading-[1.03] text-[var(--brand-navy)] sm:text-5xl xl:text-[4.4rem]">
                  {settings.homepage.heroHeadline.includes("Inspire & Deliver") ? (
                    <>
                      {settings.homepage.heroHeadline.replace("Inspire & Deliver", "")}
                      <span className="bg-[linear-gradient(90deg,var(--brand-pink),var(--brand-blue),var(--brand-green))] bg-clip-text text-transparent">
                        Inspire & Deliver
                      </span>
                    </>
                  ) : (
                    settings.homepage.heroHeadline
                  )}
                </h1>
                <p className="max-w-xl text-base leading-8 text-muted-foreground">
                  {settings.homepage.heroSubheadline}
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <CallbackButton
                  className="h-12 bg-[var(--brand-pink)] px-7 text-white hover:bg-[color-mix(in_oklab,var(--brand-pink),black_8%)]"
                  size="lg"
                >
                  {settings.homepage.primaryCtaLabel}
                  <ArrowRightIcon data-icon="inline-end" />
                </CallbackButton>
                <Button
                  className="h-12 border-[var(--brand-green)] text-[var(--brand-green)] hover:bg-[color-mix(in_oklab,var(--brand-green),white_88%)]"
                  size="lg"
                  render={<a href={`https://wa.me/${settings.primaryWhatsapp}?text=Hello%20Team%2C%20I%20am%20interested%20in%20Taakshvi%20services.`} />}
                  variant="outline"
                >
                  {settings.homepage.secondaryCtaLabel}
                </Button>
                <Button variant="outline" size="lg" className="h-12 px-7" render={<Link href="/services" />}>
                  Explore Services
                </Button>
              </div>
            </div>

            <motion.div
              style={{ x: collageX, y: collageY }}
              className="relative hidden min-h-[520px] max-w-full items-center justify-center overflow-hidden lg:flex"
            >
              <Image
                src="/brand/hero-collage.png"
                alt="Corporate events, luxury travel, wellness, real estate, and brand strategy collage"
                width={860}
                height={860}
                priority
                className="relative z-10 w-full max-w-full object-contain mix-blend-multiply drop-shadow-2xl [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_86%)]"
              />
              <motion.div
                style={{ rotate: ribbonRotate }}
                className="absolute left-10 top-1/2 h-20 w-[92%] -translate-y-1/2 rounded-full bg-[linear-gradient(90deg,rgba(239,63,134,0.75),rgba(4,99,153,0.74),rgba(79,181,84,0.62))] opacity-75 blur-xl"
              />
            </motion.div>

            <div className="relative grid content-start gap-4 py-8 lg:min-h-[510px]">
              <motion.div style={{ x: formX }} className="rounded-2xl border border-white/80 bg-white/88 p-5 shadow-2xl shadow-blue-950/10 backdrop-blur-xl">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-pink-50 text-[var(--brand-pink)]">
                    <SparklesIcon />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-[var(--brand-navy)]">Tell us your requirement</h2>
                    <p className="text-xs text-muted-foreground">Quick response. Secure and private.</p>
                  </div>
                </div>
                <EnquiryForm variant="compact" />
                <div className="mt-4 grid grid-cols-3 gap-2 text-[11px] text-muted-foreground">
                  {["Quick Response", "Secure & Private", "Trusted by 1000+"].map((item) => (
                    <div key={item} className="flex items-center gap-1 rounded-full bg-muted px-2 py-1">
                      <BadgeCheckIcon className="size-3 text-[var(--brand-green)]" />
                      <span className="truncate">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
              <RecentEnquiriesWidget enquiries={recentEnquiries} />
            </div>
          </div>

          <div className="relative mx-auto mt-10 w-full max-w-[1320px] px-4 sm:px-6">
            <div className="grid auto-rows-fr grid-cols-2 gap-px overflow-hidden rounded-[1.75rem] border border-border bg-border shadow-xl shadow-blue-950/8 backdrop-blur sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
              {services.map((service, index) => {
                const Icon = serviceIcons[index] ?? StarIcon
                return (
                  <Link
                    key={service.slug}
                    href={`/services/${service.slug}`}
                    className="group box-border flex h-full min-h-[136px] w-full flex-col items-center justify-center gap-3 overflow-hidden bg-white px-4 py-5 text-center text-xs font-medium hover:bg-[linear-gradient(135deg,rgba(239,63,134,0.08),rgba(79,181,84,0.08))]"
                  >
                    <Icon
                      className={
                        index % 3 === 0
                          ? "size-6 shrink-0 text-[var(--brand-pink)] transition group-hover:scale-110"
                          : index % 3 === 1
                            ? "size-6 shrink-0 text-[var(--brand-blue)] transition group-hover:scale-110"
                            : "size-6 shrink-0 text-[var(--brand-green)] transition group-hover:scale-110"
                      }
                    />
                    <span className="min-w-0 max-w-[128px] whitespace-normal break-words leading-tight text-[var(--brand-navy)]">
                      {service.name}
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-28 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div className="flex flex-col gap-4">
            <div className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--brand-pink)]">About Taakshvi</div>
            <h2 className="text-3xl font-semibold text-[var(--brand-navy)]">A premium solution hub built around trust, speed, and thoughtful coordination.</h2>
            <p className="text-base leading-8 text-muted-foreground">
              Taakshvi helps clients move from uncertainty to confident action with one trusted brand that brings together experiences, destinations, wellness, property, branding, and consultation-led services.
            </p>
            <div className="grid gap-3">
              {["Dedicated service coordination", "Personalized conversations", "Professional consultation support", "Dependable multi-city network"].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm font-medium text-[var(--brand-navy)]">
                  <BadgeCheckIcon className="text-[var(--brand-green)]" />
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="grid items-stretch gap-4 sm:grid-cols-2">
            {services.slice(0, 8).map((service, index) => {
              const Icon = serviceIcons[index] ?? StarIcon
              return (
                <Link key={service.slug} href={`/services/${service.slug}`}>
                  <Card className="group h-full overflow-hidden transition hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-950/10">
                    <CardHeader>
                      <div className="mb-3 flex size-11 shrink-0 items-center justify-center rounded-lg bg-muted text-[var(--brand-blue)] transition group-hover:bg-[var(--brand-navy)] group-hover:text-white">
                        <Icon />
                      </div>
                      <CardTitle>{service.name}</CardTitle>
                      <CardDescription>{service.summary}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              )
            })}
          </div>
        </section>

        <section className="border-y border-border bg-muted/35">
          <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--brand-pink)]">Why Choose Taakshvi</div>
                <h2 className="mt-3 text-3xl font-semibold text-[var(--brand-navy)]">{settings.homepage.whyChooseHeading}</h2>
              </div>
              <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
                {settings.homepage.whyChooseIntro}
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {whyChooseCards.map((item) => (
                <motion.div key={item.title} whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                  <Card className="h-full bg-white/90 shadow-lg shadow-blue-950/6 backdrop-blur">
                    <CardHeader>
                      <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-muted text-[var(--brand-pink)]">
                        <item.icon />
                      </div>
                      <CardTitle>{item.title}</CardTitle>
                      <CardDescription className="leading-7">{item.copy}</CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.82fr_1.18fr] lg:px-8">
          <div className="flex flex-col justify-center gap-5">
            <div className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--brand-pink)]">Start Your Enquiry</div>
            <h2 className="text-3xl font-semibold text-[var(--brand-navy)]">{settings.homepage.ctaTitle}</h2>
            <p className="text-base leading-8 text-muted-foreground">
              {settings.homepage.ctaCopy}
            </p>
            <Separator />
            <div className="grid gap-3 text-sm text-muted-foreground">
              <div>Fast callback support</div>
              <div>WhatsApp and email contact options</div>
              <div>Clear follow-up and personalized guidance</div>
            </div>
          </div>
          <Card className="bg-white shadow-xl shadow-blue-950/5">
            <CardHeader>
              <CardTitle>Request a Callback</CardTitle>
              <CardDescription>Tell us a little about your requirement and preferred service.</CardDescription>
            </CardHeader>
            <CardContent>
              <EnquiryForm />
            </CardContent>
          </Card>
        </section>

        <section className="border-y border-border bg-[linear-gradient(135deg,rgba(239,63,134,0.05),rgba(4,99,153,0.03),rgba(79,181,84,0.05))]">
          <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--brand-pink)]">Testimonials</div>
                <h2 className="mt-3 text-3xl font-semibold text-[var(--brand-navy)]">What clients say about working with Taakshvi</h2>
              </div>
              <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
                Real feedback creates confidence faster than claims. The best service brands make their customer experience visible.
              </p>
            </div>
            <TestimonialsCarousel items={testimonials} />
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--brand-pink)]">Featured In</div>
              <h2 className="mt-3 text-3xl font-semibold text-[var(--brand-navy)]">{settings.homepage.mediaHeading}</h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
              {settings.homepage.mediaIntro}
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {mediaItems.map((item) => (
              <Card key={item.title} className="h-full bg-white shadow-lg shadow-blue-950/6">
                <CardHeader>
                  <Badge variant="secondary">{item.source ?? "Coverage"}</Badge>
                  <CardTitle className="leading-tight">{item.title}</CardTitle>
                  <CardDescription className="leading-7">{item.description}</CardDescription>
                  <Button variant="outline" className="mt-4 w-fit" render={<a href={item.href ?? "/news"} target="_blank" rel="noreferrer" />}>
                    Read More
                    <ArrowRightIcon data-icon="inline-end" />
                  </Button>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}

function RecentEnquiriesWidget({ enquiries }: { enquiries: RecentEnquiry[] }) {
  const { settings } = useSiteData()

  if (!settings.recentEnquiries.enabled) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-40 rounded-2xl border border-border bg-white/95 p-4 shadow-2xl shadow-blue-950/12 backdrop-blur-xl sm:left-auto sm:right-4 sm:w-[21rem] lg:bottom-8 lg:right-8 lg:w-80">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--brand-navy)]">
          <span className="size-2 rounded-full bg-[var(--brand-green)]" />
          Recent Enquiries
        </div>
        {settings.recentEnquiries.liveBadge ? (
          <Badge variant="secondary" className="text-[var(--brand-pink)]">
            Live
          </Badge>
        ) : null}
      </div>
      <div className="grid gap-3">
        {enquiries.length ? (
          enquiries.map((enquiry) => (
            <div key={enquiry.id} className="grid grid-cols-[36px_1fr_auto] items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-full bg-blue-50 text-[var(--brand-blue)]">
                <UsersRoundIcon />
              </div>
              <div className="min-w-0 text-xs">
                <div className="truncate font-semibold text-[var(--brand-navy)]">
                  {enquiry.name} from {enquiry.city}
                </div>
                <div className="truncate text-muted-foreground">requested {enquiry.service}</div>
                <div className="mt-0.5 text-[11px] text-muted-foreground">{enquiry.time}</div>
              </div>
              <span className="size-2 rounded-full bg-[var(--brand-green)]" />
            </div>
          ))
        ) : (
          <div className="rounded-lg bg-muted p-3 text-xs text-muted-foreground">
            Fresh enquiry activity will appear here as new requests come in.
          </div>
        )}
      </div>
    </div>
  )
}
