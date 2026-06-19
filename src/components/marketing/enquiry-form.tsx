"use client"

import { useMemo, useRef, useState } from "react"
import { ArrowRightIcon, CheckCircle2Icon, MessageCircleIcon } from "lucide-react"
import { toast } from "sonner"

import { serviceCategories } from "@/lib/site"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

type SubmissionType = "callback" | "whatsapp"

type SubmissionResult = {
  ok: boolean
  message: string
  requestId?: string
  submissionType?: SubmissionType
  redirectUrl?: string
  warning?: string
}

export function EnquiryForm({
  defaultService = "corporate-events",
  variant = "full",
}: {
  defaultService?: string
  variant?: "full" | "compact"
}) {
  const formRef = useRef<HTMLFormElement | null>(null)
  const requestIdRef = useRef<string>("")
  const [selectedService, setSelectedService] = useState(defaultService)
  const [pending, setPending] = useState(false)
  const service = useMemo(
    () => serviceCategories.find((item) => item.slug === selectedService) ?? serviceCategories[0],
    [selectedService]
  )

  return (
    <form
      ref={formRef}
      className="flex flex-col gap-5"
      onSubmit={async (event) => {
        event.preventDefault()

        if (pending) return

        const form = formRef.current
        if (!form) return

        const submitter = event.nativeEvent.submitter as HTMLButtonElement | null
        const submissionType = submitter?.value === "whatsapp" ? "whatsapp" : "callback"
        const popup =
          submissionType === "whatsapp"
            ? window.open("", "_blank")
            : null

        if (popup) {
          popup.document.write(
            "<!doctype html><html><head><title>Opening WhatsApp</title></head><body style='font-family:Arial,sans-serif;padding:16px'>Opening WhatsApp…</body></html>"
          )
          popup.document.close()
        }

        setPending(true)

        try {
          if (!requestIdRef.current) {
            requestIdRef.current = crypto.randomUUID()
          }

          const formData = new FormData(form)
          formData.set("requestId", requestIdRef.current)
          formData.set("submissionType", submissionType)
          formData.set("service", selectedService)

          const payload: Record<string, unknown> = Object.fromEntries(formData.entries())
          payload.servicePayload = Object.fromEntries(
            [...formData.entries()]
              .filter(([key, value]) => key.startsWith("question:") && typeof value === "string")
              .map(([key, value]) => [key.replace("question:", ""), value])
          )
          if (payload.consentAccepted !== "on") {
            toast.error("Please accept the consent before submitting.")
            popup?.close()
            return
          }

          const response = await fetch("/api/enquiries", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })

          const result = (await response.json()) as SubmissionResult

          if (!response.ok || !result.ok) {
            toast.error(result.message || "We could not submit your enquiry right now.")
            popup?.close()
            return
          }

          if (result.warning) {
            toast.warning(result.warning)
          }

          if (result.submissionType === "whatsapp") {
            if (popup && result.redirectUrl) {
              popup.location.href = result.redirectUrl
              popup.focus()
            } else if (result.redirectUrl) {
              window.location.assign(result.redirectUrl)
            }
          }

          toast.success(result.message)
          form.reset()
          setSelectedService(defaultService)
          requestIdRef.current = ""
        } catch (error) {
          console.error("Failed to submit enquiry", error)
          toast.error("We could not submit your enquiry right now. Please try again.")
          popup?.close()
        } finally {
          setPending(false)
        }
      }}
    >
      <FieldGroup>
        <div className="grid gap-4 md:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="fullName">Full Name *</FieldLabel>
            <Input id="fullName" name="fullName" required autoComplete="name" placeholder="Enter your full name" />
          </Field>
          <Field>
            <FieldLabel htmlFor="mobile">Phone Number *</FieldLabel>
            <Input id="mobile" name="mobile" required inputMode="tel" autoComplete="tel" placeholder="Enter phone number" />
          </Field>
          {variant === "full" ? (
            <Field>
              <FieldLabel htmlFor="whatsapp">WhatsApp Number</FieldLabel>
              <Input id="whatsapp" name="whatsapp" inputMode="tel" />
            </Field>
          ) : null}
          <Field className={variant === "compact" ? "md:col-span-2" : undefined}>
            <FieldLabel htmlFor="email">Email Address *</FieldLabel>
            <Input id="email" name="email" type="email" required autoComplete="email" placeholder="Enter email address" />
          </Field>
          {variant === "full" ? (
            <Field>
              <FieldLabel htmlFor="company">Company Name</FieldLabel>
              <Input id="company" name="company" autoComplete="organization" />
            </Field>
          ) : null}
          <Field>
            <FieldLabel htmlFor="city">City *</FieldLabel>
            <Input id="city" name="city" required autoComplete="address-level2" placeholder="Select city" />
          </Field>
        </div>
        <Field>
          <FieldLabel>Service Required *</FieldLabel>
          <Select
            value={selectedService}
            onValueChange={(value) => {
              if (value) setSelectedService(value)
            }}
            name="service"
          >
            <SelectTrigger className="w-full bg-background">
              <SelectValue placeholder="Select a service">{service.name}</SelectValue>
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
          <FieldDescription>{service.summary}</FieldDescription>
        </Field>
        {variant === "full" ? (
          <div className="grid gap-4 md:grid-cols-2">
            {service.questions.map((question) => (
              <Field key={question} className={question.includes("Details") ? "md:col-span-2" : undefined}>
                <FieldLabel htmlFor={question}>{question}</FieldLabel>
                {question.includes("Details") ? (
                  <Textarea id={question} name={`question:${question}`} rows={4} />
                ) : (
                  <Input id={question} name={`question:${question}`} />
                )}
              </Field>
            ))}
          </div>
        ) : null}
        <Field>
          <FieldLabel htmlFor="message">Message / Requirement *</FieldLabel>
          <Textarea
            id="message"
            name="message"
            required
            rows={variant === "compact" ? 4 : 5}
            placeholder="Tell us what you need, along with any timeline or important details."
          />
        </Field>
        <Field orientation="horizontal">
          <Checkbox id="consentAccepted" name="consentAccepted" required />
          <FieldLabel htmlFor="consentAccepted">
            I agree to be contacted by Taakshvi Solution Hub regarding my enquiry.
          </FieldLabel>
        </Field>
      </FieldGroup>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          type="submit"
          value="callback"
          size="lg"
          disabled={pending}
          className="h-11 flex-1 bg-[var(--brand-pink)] text-white hover:bg-[color-mix(in_oklab,var(--brand-pink),black_8%)]"
        >
          {pending ? "Submitting" : "Request a Callback"}
          <ArrowRightIcon data-icon="inline-end" />
        </Button>
        <Button
          type="submit"
          value="whatsapp"
          size="lg"
          disabled={pending}
          variant="outline"
          className="h-11 flex-1 border-[var(--brand-green)] text-[var(--brand-green)] hover:bg-[color-mix(in_oklab,var(--brand-green),white_88%)]"
        >
          {pending ? "Submitting" : "Send Enquiry on WhatsApp"}
          <MessageCircleIcon data-icon="inline-end" />
        </Button>
      </div>
      <div className="flex items-start gap-2 rounded-lg border border-border bg-muted p-3 text-sm text-muted-foreground">
        <CheckCircle2Icon data-icon="inline-start" />
        <span>We save every submission with a unique request ID to help prevent duplicate entries.</span>
      </div>
    </form>
  )
}
