"use client"

import { useActionState, useMemo, useState } from "react"
import { ArrowRightIcon, CheckCircle2Icon } from "lucide-react"

import { serviceCategories } from "@/lib/site"
import { createLead, type LeadActionState } from "@/server/lead-actions"
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

const initialState: LeadActionState = { ok: false, message: "" }

export function EnquiryForm({
  defaultService = "corporate-events",
  variant = "full",
}: {
  defaultService?: string
  variant?: "full" | "compact"
}) {
  const [selectedService, setSelectedService] = useState(defaultService)
  const [state, action, pending] = useActionState(createLead, initialState)
  const service = useMemo(
    () => serviceCategories.find((item) => item.slug === selectedService) ?? serviceCategories[0],
    [selectedService]
  )

  return (
    <form action={action} className="flex flex-col gap-5">
      <FieldGroup>
        <div className="grid gap-4 md:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="fullName">Full Name *</FieldLabel>
            <Input id="fullName" name="fullName" required autoComplete="name" placeholder="Enter your full name" />
          </Field>
          <Field>
            <FieldLabel htmlFor="mobile">Mobile Number *</FieldLabel>
            <Input id="mobile" name="mobile" required inputMode="tel" autoComplete="tel" placeholder="Enter mobile number" />
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
        <Field orientation="horizontal">
          <Checkbox id="consentAccepted" name="consentAccepted" required />
          <FieldLabel htmlFor="consentAccepted">
            I agree to be contacted by Taakshvi Solution Hub regarding my enquiry.
          </FieldLabel>
        </Field>
      </FieldGroup>
      {state.message ? (
        <div className="flex items-start gap-2 rounded-lg border border-border bg-muted p-3 text-sm" role="status">
          <CheckCircle2Icon data-icon="inline-start" />
          <span>{state.message}</span>
        </div>
      ) : null}
      <Button type="submit" size="lg" disabled={pending} className="h-11">
        {pending ? "Submitting" : "Request a Callback"}
        <ArrowRightIcon data-icon="inline-end" />
      </Button>
    </form>
  )
}
