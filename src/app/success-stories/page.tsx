import type { Metadata } from "next"

import { SimplePage } from "@/components/marketing/simple-page"

export const metadata: Metadata = {
  title: "Success Stories",
  description: "Success stories from Taakshvi Solution Hub.",
}

export default function SuccessStoriesPage() {
  return (
    <SimplePage
      title="Success Stories"
      description="Success stories highlight memorable client outcomes, standout experiences, and the impact of thoughtful coordination."
      points={["Client outcomes", "Service impact", "Publishing approval"]}
    />
  )
}
