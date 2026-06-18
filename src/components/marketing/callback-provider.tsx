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
import {
  buildEmailBody,
  buildWhatsAppMessage,
  resolveLeadOwner,
  type PublicRoutingRule,
} from "@/lib/routing-config"
import { serviceCategories } from "@/lib/site"

type CallbackMode = "request-callback" | "whatsapp" | "email"

type CallbackContextValue = {
  openCallback: (options?: { service?: string }) => void
}

const modeOptions = [
  { value: "request-callback" as const, label: "Request Callback", icon: PhoneCallIcon },
  { value: "whatsapp" as const, label: "WhatsApp", icon: MessageCircleIcon },
  { value: "email" as const, label: "Email", icon: MailIcon },
]

const CallbackContext = createContext<CallbackContextValue | null>(null)

export function CallbackProvider({
  children,
  routingRules = [],
}: {
  children: ReactNode
  routingRules?: PublicRoutingRule[]
}) {
  const [open, setOpen] = useState(false)
  const [service, setService] = useState("corporate-events")
  const [mode, setMode] = useState<CallbackMode>("request-callback")
  const [name, setName] = useState("")
  const [mobile, setMobile] = useState("")
  const [city, setCity] = useState("")
  const [requirements, setRequirements] = useState("")

  const value = useMemo<CallbackContextValue>(
    () => ({
      openCallback: (options) => {
        startTransition(() => {
          setService(options?.service ?? "corporate-events")
          setMode("request-callback")
          setOpen(true)
        })
      },
    }),
    []
  )

  const selectedService =
    serviceCategories.find((item) => item.slug === service)?.name ?? "Corporate Events"
  const owner = resolveLeadOwner({ service, city }, routingRules)
  const whatsappHref = `https://wa.me/${owner.whatsapp}?text=${buildWhatsAppMessage({
    name: name || "Visitor",
    service: selectedService,
    mobile: mobile || "Not shared",
    city: city || "Not shared",
  })}`
  const emailHref = `mailto:${owner.email}?subject=Service Enquiry&body=${buildEmailBody({
    name: name || "Visitor",
    service: selectedService,
    city: city || "Not shared",
    requirements,
  })}`

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
              <EnquiryForm defaultService={service} variant="compact" />
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
                    <FieldLabel htmlFor="callback-city">City</FieldLabel>
                    <Input id="callback-city" value={city} onChange={(event) => setCity(event.target.value)} />
                  </Field>
                  <Field>
                    <FieldLabel>Selected Service</FieldLabel>
                    <Select value={service} onValueChange={(value) => value && setService(value)}>
                      <SelectTrigger className="w-full">
                        <SelectValue>{selectedService}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {serviceCategories.map((item) => (
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
                  onClick={() => setOpen(false)}
                  render={<a href={mode === "whatsapp" ? whatsappHref : emailHref} />}
                  className="bg-[var(--brand-pink)] text-white hover:bg-[color-mix(in_oklab,var(--brand-pink),black_8%)]"
                >
                  {mode === "whatsapp" ? "Open WhatsApp" : "Open Email Client"}
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
