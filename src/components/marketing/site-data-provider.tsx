"use client"

import { createContext, useContext, type ReactNode } from "react"

import type { PublicService, SiteSettings } from "@/lib/site-settings"

type SiteDataContextValue = {
  settings: SiteSettings
  services: PublicService[]
}

const SiteDataContext = createContext<SiteDataContextValue | null>(null)

export function SiteDataProvider({
  children,
  settings,
  services,
}: {
  children: ReactNode
  settings: SiteSettings
  services: PublicService[]
}) {
  return <SiteDataContext.Provider value={{ settings, services }}>{children}</SiteDataContext.Provider>
}

export function useSiteData() {
  const context = useContext(SiteDataContext)

  if (!context) {
    throw new Error("useSiteData must be used within SiteDataProvider")
  }

  return context
}
