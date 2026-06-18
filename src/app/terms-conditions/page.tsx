import type { Metadata } from "next"

import { SimplePage } from "@/components/marketing/simple-page"

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms and conditions for Taakshvi Solution Hub.",
}

export default function TermsPage() {
  return (
    <SimplePage
      title="Terms & Conditions"
      description="Service enquiries submitted through the platform are requests for callback and consultation. Final scope, commercials, timelines, and delivery responsibilities are confirmed directly during the service conversation."
      points={["Callback request terms", "Service scope confirmation", "Responsible communication"]}
    />
  )
}
