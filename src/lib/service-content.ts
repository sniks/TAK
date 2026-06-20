export type ServiceDetailSection = {
  title: string
  description: string
}

export type ServicePortfolioItem = {
  title: string
  category: string
  summary: string
}

export type ServiceTestimonial = {
  name: string
  role: string
  company: string
  quote: string
}

export type ServiceDetailContent = {
  metaTitle?: string
  metaDescription?: string
  eyebrow?: string
  heroDescription: string
  heroHighlights: string[]
  servicesOffered: string[]
  portfolio: ServicePortfolioItem[]
  technologyStack: string[]
  process: ServiceDetailSection[]
  faqs: Array<{ question: string; answer: string }>
  testimonials: ServiceTestimonial[]
  ctaTitle: string
  ctaCopy: string
}

export const serviceDetailContent: Record<string, ServiceDetailContent> = {
  "website-software-development": {
    metaTitle: "Website & Software Development Services | Taakshvi Solution Hub",
    metaDescription:
      "Professional Website Development, CRM, ERP, Mobile Apps, Custom Software Solutions, and Digital Transformation Services by Taakshvi Solution Hub.",
    eyebrow: "Digital Products",
    heroDescription:
      "Website and software delivery for brands that need clean execution, reliable architecture, and a business-first product experience. From corporate websites to CRM, ERP, mobile apps, cloud integrations, and AI-enabled workflows, Taakshvi manages the full journey from discovery to launch.",
    heroHighlights: [
      "Business websites, portals, and landing pages",
      "CRM, ERP, and custom workflow software",
      "Mobile apps for Android, iOS, and cross-platform delivery",
      "Cloud, API, and AI-led digital transformation",
    ],
    servicesOffered: [
      "Website Development",
      "Corporate Websites",
      "Business Websites",
      "Landing Pages",
      "Portfolio Websites",
      "E-Commerce Websites",
      "CMS Development",
      "WordPress Development",
      "Custom Web Applications",
      "CRM Development",
      "ERP Development",
      "School Management Software",
      "Mobile App Development",
      "Android Apps",
      "iOS Apps",
      "Cross Platform Apps",
      "Custom Software Development",
      "API Development",
      "Cloud Solutions",
      "AI Solutions",
      "Maintenance & Support",
    ],
    portfolio: [
      {
        title: "Corporate Website Revamp",
        category: "Websites",
        summary: "Premium multi-page website placeholder for a service-led brand with enquiry capture, SEO structure, and CMS-ready content architecture.",
      },
      {
        title: "Sales CRM Workflow Platform",
        category: "CRM Projects",
        summary: "Pipeline, follow-up, team assignment, and reporting placeholder for a sales operation that needs clearer visibility and cleaner lead movement.",
      },
      {
        title: "Operations ERP Dashboard",
        category: "ERP Projects",
        summary: "Finance, inventory, approvals, and reporting placeholder for a business moving from spreadsheets to unified operational control.",
      },
      {
        title: "Field Service Mobile App",
        category: "Mobile Apps",
        summary: "Cross-platform placeholder for field teams that need booking access, status updates, notifications, and offline-friendly workflows.",
      },
      {
        title: "Custom Business Automation Suite",
        category: "Software Solutions",
        summary: "Internal software placeholder connecting forms, approvals, lead capture, dashboards, and third-party APIs into one controlled system.",
      },
    ],
    technologyStack: [
      "Next.js",
      "React",
      "TypeScript",
      "Node.js",
      "Laravel",
      "WordPress",
      "PostgreSQL",
      "Prisma",
      "REST APIs",
      "Cloud Deployment",
      "Mobile App Frameworks",
      "AI Integrations",
    ],
    process: [
      {
        title: "Discovery & Scope",
        description: "Clarify business goals, users, workflows, scope boundaries, success metrics, and launch expectations before delivery starts.",
      },
      {
        title: "Architecture & UX Planning",
        description: "Define sitemap, user flows, data model, system dependencies, admin surfaces, and the right stack for the problem being solved.",
      },
      {
        title: "Design & Build",
        description: "Ship production-ready UI, backend logic, integrations, and content structures in a controlled sequence with milestone visibility.",
      },
      {
        title: "QA, Launch & Support",
        description: "Validate forms, routing, performance, analytics, SEO, and deployment flows, then support the team after release with maintenance and iteration.",
      },
    ],
    faqs: [
      {
        question: "Do you handle both websites and internal business software?",
        answer:
          "Yes. The delivery scope can cover marketing websites, business portals, CRM systems, ERP workflows, mobile apps, and custom internal software.",
      },
      {
        question: "Can Taakshvi build on a preferred technology stack?",
        answer:
          "Yes. We can align with preferred technologies such as React, Next.js, Node.js, Laravel, WordPress, or mobile app frameworks when that choice is commercially and technically sensible.",
      },
      {
        question: "Do you support redesigns and upgrades of existing systems?",
        answer:
          "Yes. Projects can include redesign, migration, rebuild, feature expansion, API integration, or ongoing maintenance for an existing product.",
      },
      {
        question: "What happens after I submit the enquiry?",
        answer:
          "The requirement is saved in CRM, routed to the configured owner, and prepared for callback, WhatsApp, or email follow-up with project context already attached.",
      },
    ],
    testimonials: [
      {
        name: "Rohan Mehta",
        role: "Founder",
        company: "B2B Services Brand",
        quote:
          "The strongest part of the delivery was clarity. Scope, timelines, and build decisions were explained in business terms instead of technical noise.",
      },
      {
        name: "Priya Soni",
        role: "Operations Lead",
        company: "Growing SME",
        quote:
          "Our CRM requirements were messy at the start. The workflow became much cleaner once the team mapped actual operational bottlenecks before building features.",
      },
      {
        name: "Amit Khanna",
        role: "Director",
        company: "Multi-Location Business",
        quote:
          "The website looked polished, but the bigger value was the backend structure. It gave us better enquiry handling, reporting, and follow-up discipline.",
      },
    ],
    ctaTitle: "Need a website, CRM, ERP, app, or custom software solution?",
    ctaCopy:
      "Share the project type, budget range, timeline, and preferred technology direction. Taakshvi will route the requirement into a structured delivery conversation.",
  },
}

