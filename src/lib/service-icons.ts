import { createElement } from "react"
import type { LucideIcon, LucideProps } from "lucide-react"
import {
  BriefcaseBusinessIcon,
  Building2Icon,
  CameraIcon,
  Code2Icon,
  HeartPulseIcon,
  HomeIcon,
  LaptopMinimalIcon,
  MegaphoneIcon,
  PlaneIcon,
  ShieldCheckIcon,
  SparklesIcon,
  StarIcon,
  TargetIcon,
  TheaterIcon,
  UsersRoundIcon,
} from "lucide-react"

const serviceIconMap: Record<string, LucideIcon> = {
  "corporate-events": BriefcaseBusinessIcon,
  "tours-travel": PlaneIcon,
  "wellness-retreats": SparklesIcon,
  "branding-marketing": MegaphoneIcon,
  "photography-videography": CameraIcon,
  "artist-management": TheaterIcon,
  "venue-sourcing": Building2Icon,
  "team-building-activities": UsersRoundIcon,
  "real-estate": HomeIcon,
  astrology: TargetIcon,
  finance: ShieldCheckIcon,
  "health-wellness": HeartPulseIcon,
  "website-software-development": Code2Icon,
  other: LaptopMinimalIcon,
}

export function getServiceIcon(slug: string): LucideIcon {
  return serviceIconMap[slug] ?? StarIcon
}

export function renderServiceIcon(slug: string, props?: LucideProps) {
  return createElement(getServiceIcon(slug), props)
}
