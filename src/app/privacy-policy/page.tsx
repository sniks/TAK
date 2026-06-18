import type { Metadata } from "next"

import { SimplePage } from "@/components/marketing/simple-page"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Taakshvi Solution Hub.",
}

export default function PrivacyPolicyPage() {
  return (
    <SimplePage
      title="Privacy Policy"
      description="Taakshvi Solution Hub collects enquiry details only to respond to service requests, follow up on customer conversations, and improve support quality."
      points={["Private contact details are handled with care", "We use enquiry information only for relevant communication", "Customers can request correction or deletion through the contact channel"]}
    />
  )
}
