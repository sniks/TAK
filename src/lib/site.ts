export const siteConfig = {
  name: "TAAKSHVI Solution Hub",
  legalName: "Taakshvi Solution Hub",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://taakshvisolutionhub.com",
  email: "namaste@taakshvisolutionhub.com",
  phone: "7977938960",
  tagline:
    "Your Trusted Partner for Events, Travel, Branding, Wellness, Real Estate & More",
  description:
    "Premium events, travel, branding, wellness, real estate, astrology, finance, and health service coordination from one trusted solution hub.",
  nav: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about-us" },
    { label: "Services", href: "/services" },
    { label: "Gallery", href: "/gallery" },
    { label: "Testimonials", href: "/testimonials" },
    { label: "Blogs", href: "/blogs" },
    { label: "News", href: "/news" },
    { label: "Contact", href: "/contact-us" },
  ],
  footerQuickLinks: [
    { label: "About Us", href: "/about-us" },
    { label: "All Services", href: "/services" },
    { label: "Gallery", href: "/gallery" },
    { label: "Testimonials", href: "/testimonials" },
    { label: "Blogs", href: "/blogs" },
    { label: "News", href: "/news" },
    { label: "Contact Us", href: "/contact-us" },
  ],
  legalLinks: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms-conditions" },
  ],
  socialLinks: [
    {
      label: "Instagram",
      href: "https://www.instagram.com/taakshvisolutionhub?igsh=NjU2NjRmZnpodHg0&utm_source=qr",
    },
    {
      label: "WhatsApp Channel",
      href: "https://whatsapp.com/channel/0029VbDDwiM7oQheKXOsnN2K",
    },
  ],
}

export const serviceCategories = [
  {
    name: "Corporate Events",
    slug: "corporate-events",
    summary: "End-to-end corporate event planning, logistics, production, and guest experience management.",
    questions: ["Event Type", "Event Date", "Event Location", "Number of Guests", "Budget Range", "Requirement Details"],
  },
  {
    name: "Tours & Travel",
    slug: "tours-travel",
    summary: "Custom travel coordination for leisure, groups, retreats, and business movement.",
    questions: ["Destination", "Travel Dates", "Number of Travellers", "Budget Range", "Requirement Details"],
  },
  {
    name: "Wellness Retreats",
    slug: "wellness-retreats",
    summary: "Curated wellness escapes, group retreats, and mindful experience planning.",
    questions: ["Preferred Location", "Preferred Dates", "Number of Participants", "Requirement Details"],
  },
  {
    name: "Branding & Marketing",
    slug: "branding-marketing",
    summary: "Brand identity, campaigns, launch support, and strategic marketing execution.",
    questions: ["Business Name", "Services Required", "Project Budget", "Requirement Details"],
  },
  {
    name: "Photography & Videography",
    slug: "photography-videography",
    summary: "Professional coverage for events, campaigns, spaces, products, and people.",
    questions: ["Shoot Type", "Event Date", "Location", "Requirement Details"],
  },
  {
    name: "Artist Management",
    slug: "artist-management",
    summary: "Artist discovery, booking, coordination, and event performance management.",
    questions: ["Artist Category", "Event Date", "Event Location", "Budget Range", "Requirement Details"],
  },
  {
    name: "Venue Sourcing",
    slug: "venue-sourcing",
    summary: "Venue discovery and negotiation for events, retreats, shoots, and meetings.",
    questions: ["City", "Event Date", "Number of Guests", "Budget Range", "Requirement Details"],
  },
  {
    name: "Team Building Activities",
    slug: "team-building-activities",
    summary: "Structured team experiences that improve connection, morale, and collaboration.",
    questions: ["Team Size", "Preferred Date", "Preferred Location", "Objective", "Requirement Details"],
  },
  {
    name: "Real Estate",
    slug: "real-estate",
    summary: "Property support for buying, selling, renting, leasing, and location advisory.",
    questions: ["Buy / Sell / Rent / Lease", "Property Type", "Preferred Location", "Budget Range", "Requirement Details"],
  },
  {
    name: "Astrology",
    slug: "astrology",
    summary: "Consultation coordination for personal, family, and business guidance.",
    questions: ["Consultation Type", "Preferred Consultation Mode", "Date Of Birth", "Requirement Details"],
  },
  {
    name: "Finance",
    slug: "finance",
    summary: "Financial requirement discovery and consultation routing for qualified enquiries.",
    questions: ["Financial Requirement Type", "Investment Range", "Preferred Consultation Mode", "Requirement Details"],
  },
  {
    name: "Health & Wellness",
    slug: "health-wellness",
    summary: "Health, lifestyle, and wellness service coordination with trusted partners.",
    questions: ["Wellness Service Type", "Preferred Location", "Preferred Date", "Requirement Details"],
  },
  {
    name: "Website & Software Development",
    slug: "website-software-development",
    summary: "Websites, CRM, ERP, mobile apps, and custom software delivery for brands investing in digital transformation.",
    questions: [
      "Project Type",
      "Business Type",
      "Project Budget",
      "Expected Timeline",
      "Technology Preference",
      "Requirement Details",
    ],
  },
  {
    name: "Other",
    slug: "other",
    summary: "Custom requirements routed to the right Taakshvi team member.",
    questions: ["Service Required", "Requirement Details"],
  },
] as const

export type ServiceSlug = (typeof serviceCategories)[number]["slug"]

export const serviceQuestionFieldConfig: Partial<
  Record<
    ServiceSlug,
    Array<{
      label: string
      type: "text" | "textarea" | "select"
      options?: string[]
    }>
  >
> = {
  "website-software-development": [
    {
      label: "Project Type",
      type: "select",
      options: ["Website", "Web Application", "CRM", "ERP", "Mobile App", "Custom Software", "Other"],
    },
    {
      label: "Business Type",
      type: "select",
      options: ["Startup", "SME", "Enterprise", "Personal", "Other"],
    },
    {
      label: "Project Budget",
      type: "select",
      options: ["Under ₹25,000", "₹25,000 - ₹50,000", "₹50,000 - ₹1 Lakh", "₹1 Lakh - ₹5 Lakh", "₹5 Lakh+"],
    },
    {
      label: "Expected Timeline",
      type: "select",
      options: ["Immediate", "1 Month", "2-3 Months", "Flexible"],
    },
    {
      label: "Technology Preference",
      type: "select",
      options: ["React", "Next.js", "Laravel", "Node.js", "WordPress", "Mobile App", "No Preference"],
    },
    {
      label: "Requirement Details",
      type: "textarea",
    },
  ],
}

export function getServiceBySlug(slug: string) {
  return serviceCategories.find((service) => service.slug === slug)
}

export function getServiceQuestionFields(slug: string) {
  return serviceQuestionFieldConfig[slug as ServiceSlug] ?? null
}
