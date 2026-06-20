"use client"

import {
  createContext,
  startTransition,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { MailIcon, MessageCircleIcon, PhoneCallIcon } from "lucide-react"
import { toast } from "sonner"

import { EnquiryForm } from "@/components/marketing/enquiry-form"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { resolveLeadOwner, type PublicRoutingRule } from "@/lib/routing-config"
import { useSiteData } from "@/components/marketing/site-data-provider"
import { createClientRequestId } from "@/lib/client-id"

type CallbackMode = "request-callback" | "whatsapp" | "email" | "call"

type CallbackContextValue = {
  openCallback: (options?: {
    service?: string
    mode?: CallbackMode
    source?: string
    ctaType?: string
  }) => void
}

const modeOptions = [
  { value: "request-callback" as const, label: "Request Callback", icon: PhoneCallIcon },
  { value: "whatsapp" as const, label: "WhatsApp", icon: MessageCircleIcon },
  { value: "email" as const, label: "Email", icon: MailIcon },
  { value: "call" as const, label: "Call", icon: PhoneCallIcon },
]

const CallbackContext = createContext<CallbackContextValue | null>(null)

export function CallbackProvider({
  children,
  routingRules = [],
}: {
  children: ReactNode
  routingRules?: PublicRoutingRule[]
}) {
  const { services } = useSiteData()
  const [open, setOpen] = useState(false)
  const [service, setService] = useState("corporate-events")
  const [mode, setMode] = useState<CallbackMode>("request-callback")
  const [name, setName] = useState("")
  const [mobile, setMobile] = useState("")
  const [email, setEmail] = useState("")
  const [city, setCity] = useState("")
  const [requirements, setRequirements] = useState("")
  const [source, setSource] = useState("Callback Modal")
  const [ctaType, setCtaType] = useState("callback")
  const [pending, setPending] = useState(false)

  const value = useMemo<CallbackContextValue>(
    () => ({
      openCallback: (options) => {
        startTransition(() => {
          setService(options?.service ?? "corporate-events")
          setMode(options?.mode ?? "request-callback")
          setName("")
          setMobile("")
          setEmail("")
          setCity("")
          setRequirements("")
          setSource(options?.source ?? "Callback Modal")
          setCtaType(options?.ctaType ?? (options?.mode ?? "request-callback"))
          setOpen(true)
        })
      },
    }),
    []
  )

  const selectedService =
    services.find((item) => item.slug === service)?.name ?? services[0]?.name ?? "Corporate Events"
  const owner = resolveLeadOwner({ service, city }, routingRules)

  async function submitTrackedCta() {
    if (!name.trim() || !mobile.trim() || !email.trim() || !city.trim() || !requirements.trim()) {
      toast.error("Name, mobile, email, city, and requirement are required.")
      return
    }

    setPending(true)
    const popup = window.open("", mode === "call" ? "_self" : "_blank")
    if (popup && mode !== "call") {
      popup.document.write(
        "<!doctype html><html><head><title>Opening contact path</title></head><body style='font-family:Arial,sans-serif;padding:16px'>Preparing your contact path...</body></html>"
      )
      popup.document.close()
    }

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: createClientRequestId(),
          fullName: name,
          mobile,
          email,
          city,
          message: requirements,
          service,
          submissionType:
            mode === "request-callback" ? "callback" : mode,
          source,
          ctaType,
          consentAccepted: "on",
          servicePayload: {},
          campaignData: {},
        }),
      })

      const result = (await response.json()) as {
        ok: boolean
        message: string
        redirectUrl?: string
        warning?: string
      }

      if (!response.ok || !result.ok) {
        toast.error(result.message || "We could not save your enquiry right now.")
        if (popup && mode !== "call") popup.close()
        return
      }

      if (result.warning) {
        toast.warning(result.warning)
      }

      toast.success(result.message)
      setOpen(false)

      if (result.redirectUrl) {
        if (mode === "call") {
          window.location.assign(result.redirectUrl)
        } else if (popup) {
          popup.location.href = result.redirectUrl
          popup.focus()
        } else {
          window.location.assign(result.redirectUrl)
        }
      }
    } catch (error) {
      console.error("Failed to submit tracked CTA", error)
      toast.error("We could not save your enquiry right now. Please try again.")
      if (popup && mode !== "call") popup.close()
    } finally {
      setPending(false)
    }
  }

  return (
    <CallbackContext.Provider value={value}>
      {children}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto rounded-3xl bg-white p-0">
          <DialogHeader className="border-b border-border/70 px-6 py-5">
            <DialogTitle>Request Callback</DialogTitle>
            <DialogDescription>
              Choose the contact path that feels most convenient for your requirement.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 p-6">
            <div className="grid gap-3 md:grid-cols-3">
              {modeOptions.map((option) => (
                <button
                  key={option.value}
                  className={`rounded-2xl border p-4 text-left transition ${
                    mode === option.value
                      ? "border-[var(--brand-pink)] bg-pink-50 shadow-sm"
                      : "border-border bg-white hover:border-[var(--brand-blue)]"
                  }`}
                  onClick={() => setMode(option.value)}
                  type="button"
                >
                  <option.icon className="mb-3 text-[var(--brand-pink)]" />
                  <div className="font-semibold text-[var(--brand-navy)]">{option.label}</div>
                </button>
              ))}
            </div>

            {mode === "request-callback" ? (
              <EnquiryForm
                defaultService={service}
                variant="compact"
                source={source}
                ctaType={ctaType}
              />
            ) : (
              <FieldGroup>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="callback-name">Name</FieldLabel>
                    <Input id="callback-name" value={name} onChange={(event) => setName(event.target.value)} />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="callback-mobile">Mobile</FieldLabel>
                    <Input id="callback-mobile" value={mobile} onChange={(event) => setMobile(event.target.value)} />
                  </Field>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="callback-email">Email</FieldLabel>
                    <Input id="callback-email" value={email} onChange={(event) => setEmail(event.target.value)} />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="callback-city">City</FieldLabel>
                    <Input id="callback-city" value={city} onChange={(event) => setCity(event.target.value)} />
                  </Field>
                  <Field className="md:col-span-2">
                    <FieldLabel>Selected Service</FieldLabel>
                    <Select value={service} onValueChange={(value) => value && setService(value)}>
                      <SelectTrigger className="w-full">
                        <SelectValue>{selectedService}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {services.map((item) => (
                            <SelectItem key={item.slug} value={item.slug}>
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                </div>
                <Field>
                  <FieldLabel htmlFor="callback-requirements">Requirements</FieldLabel>
                  <Input
                    id="callback-requirements"
                    value={requirements}
                    onChange={(event) => setRequirements(event.target.value)}
                  />
                </Field>
                <div className="rounded-2xl bg-muted p-4 text-sm text-muted-foreground">
                  Best contact number for {selectedService}: {owner.mobile}
                </div>
                <Button
                  disabled={pending}
                  onClick={submitTrackedCta}
                  className="bg-[var(--brand-pink)] text-white hover:bg-[color-mix(in_oklab,var(--brand-pink),black_8%)]"
                  type="button"
                >
                  {pending
                    ? "Saving enquiry..."
                    : mode === "whatsapp"
                      ? "Open WhatsApp"
                      : mode === "email"
                        ? "Open Email Client"
                        : "Call Now"}
                </Button>
              </FieldGroup>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </CallbackContext.Provider>
  )
}

export function useCallbackDialog() {
  const context = useContext(CallbackContext)
  if (!context) {
    throw new Error("useCallbackDialog must be used within CallbackProvider")
  }
  return context
}
