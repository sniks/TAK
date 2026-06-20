"use client"

import { type ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { useCallbackDialog } from "@/components/marketing/callback-provider"

export function CallbackButton({
  children,
  service,
  mode,
  source,
  ctaType,
  variant = "default",
  size = "lg",
  className,
}: {
  children: ReactNode
  service?: string
  mode?: "request-callback" | "whatsapp" | "email" | "call"
  source?: string
  ctaType?: string
  variant?: "default" | "outline" | "secondary" | "ghost" | "destructive" | "link"
  size?: "default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg"
  className?: string
}) {
  const { openCallback } = useCallbackDialog()

  return (
    <Button
      className={className}
      onClick={() => openCallback({ service, mode, source, ctaType })}
      size={size}
      variant={variant}
      type="button"
    >
      {children}
    </Button>
  )
}
