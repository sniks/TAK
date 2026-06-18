import type { Metadata } from "next"

import { SimplePage } from "@/components/marketing/simple-page"

export const metadata: Metadata = {
  title: "Case Studies",
  description: "Case studies for service outcomes and client work.",
}

export default function CaseStudiesPage() {
  return (
    <SimplePage
      title="Case Studies"
      description="Case studies show how thoughtful planning, service design, and execution can create stronger outcomes for clients."
      points={["Problem and solution", "Service outcome", "SEO-ready publishing"]}
    />
  )
}
