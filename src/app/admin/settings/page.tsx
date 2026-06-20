import type { Metadata } from "next"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { requirePermission } from "@/lib/admin"
import { prisma } from "@/lib/db"
import { createRoutingRule, createService, deleteRoutingRule, deleteService, updateServices, updateSettings } from "@/server/settings-actions"

export const metadata: Metadata = {
  title: "Admin Settings",
  robots: { index: false, follow: false },
}

export default async function SettingsPage() {
  await requirePermission("settings.write")

  const [company, contact, recent, seo, social, homepage, emailSettings, whatsappSettings, footerSettings, routingRules, services] =
    await Promise.all([
      prisma.setting.findUnique({ where: { key: "company_profile" } }),
      prisma.setting.findUnique({ where: { key: "site_contact" } }),
      prisma.setting.findUnique({ where: { key: "recent_enquiries_widget" } }),
      prisma.setting.findUnique({ where: { key: "site_seo" } }),
      prisma.setting.findUnique({ where: { key: "site_social" } }),
      prisma.setting.findUnique({ where: { key: "homepage_settings" } }),
      prisma.setting.findUnique({ where: { key: "email_settings" } }),
      prisma.setting.findUnique({ where: { key: "whatsapp_settings" } }),
      prisma.setting.findUnique({ where: { key: "footer_settings" } }),
      prisma.leadRoutingRule.findMany({
        select: {
          id: true,
          serviceId: true,
          city: true,
          ownerName: true,
          assignedMobile: true,
          assignedWhatsapp: true,
          assignedEmail: true,
          priority: true,
          service: {
            select: {
              name: true,
            },
          },
        },
        orderBy: [{ priority: "asc" }, { ownerName: "asc" }],
      }),
      prisma.service.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          serviceEmail: true,
          serviceWhatsappNumber: true,
          isActive: true,
        },
        orderBy: { name: "asc" },
      }),
    ])

  const companyValue = (company?.value ?? {}) as {
    companyName?: string
    legalName?: string
    siteUrl?: string
    tagline?: string
    description?: string
    aboutHeadline?: string
    aboutDescription?: string
    citiesLabel?: string
  }
  const contactValue = (contact?.value ?? {}) as { phone?: string; email?: string; address?: string }
  const recentValue = (recent?.value ?? {}) as {
    enabled?: boolean
    limit?: number
    liveBadge?: boolean
    autoHideSeconds?: number
    inactivityReappearSeconds?: number
    rotationSeconds?: number
    displayStyle?: "toast" | "popup" | "floating-card"
  }
  const seoValue = (seo?.value ?? {}) as { title?: string; description?: string; ogImage?: string }
  const socialValue = (social?.value ?? {}) as {
    instagram?: string
    facebook?: string
    linkedin?: string
    whatsappChannel?: string
  }
  const homepageValue = (homepage?.value ?? {}) as {
    heroBadge?: string
    heroHeadline?: string
    heroSubheadline?: string
    primaryCtaLabel?: string
    secondaryCtaLabel?: string
    servicesHeading?: string
    whyChooseHeading?: string
    whyChooseIntro?: string
    mediaHeading?: string
    mediaIntro?: string
    ctaTitle?: string
    ctaCopy?: string
  }
  const emailValue = (emailSettings?.value ?? {}) as {
    from?: string
    replyTo?: string
    bcc?: string[]
    cc?: string[]
    enableBcc?: boolean
  }
  const whatsappValue = (whatsappSettings?.value ?? {}) as { primary?: string }
  const footerValue = (footerSettings?.value ?? {}) as {
    trustHeading?: string
    trustPoints?: string[]
    newsletterLabel?: string
    ctaTitle?: string
    ctaCopy?: string
  }

  return (
    <div className="min-h-screen bg-muted/35 p-4 sm:p-8">
      <div className="mx-auto w-full max-w-6xl">
        <Link href="/admin" className="text-sm font-medium text-muted-foreground">
          Back to dashboard
        </Link>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Admin Settings</CardTitle>
            <CardDescription>
              Manage site-wide contact details, content controls, and service owner routing from one place.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={updateSettings} className="grid gap-6">
              <Tabs defaultValue="general" className="gap-6">
                <TabsList variant="line" className="flex w-full flex-wrap justify-start gap-2">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="seo">SEO</TabsTrigger>
                  <TabsTrigger value="social">Social Media</TabsTrigger>
                  <TabsTrigger value="homepage">Homepage</TabsTrigger>
                  <TabsTrigger value="services">Services</TabsTrigger>
                  <TabsTrigger value="routing">Lead Routing</TabsTrigger>
                  <TabsTrigger value="recent">Recent Enquiries</TabsTrigger>
                  <TabsTrigger value="email">Email Settings</TabsTrigger>
                  <TabsTrigger value="whatsapp">WhatsApp Settings</TabsTrigger>
                  <TabsTrigger value="footer">Footer Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="general">
                  <FieldGroup>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field>
                        <FieldLabel htmlFor="companyName">Company Name</FieldLabel>
                        <Input id="companyName" name="companyName" defaultValue={companyValue.companyName ?? "TAAKSHVI Solution Hub"} />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="legalName">Legal Name</FieldLabel>
                        <Input id="legalName" name="legalName" defaultValue={companyValue.legalName ?? "Taakshvi Solution Hub"} />
                      </Field>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field>
                        <FieldLabel htmlFor="siteUrl">Site URL</FieldLabel>
                        <Input id="siteUrl" name="siteUrl" defaultValue={companyValue.siteUrl ?? "https://taakshvisolutionhub.com"} />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="tagline">Tagline</FieldLabel>
                        <Input id="tagline" name="tagline" defaultValue={companyValue.tagline ?? ""} />
                      </Field>
                    </div>
                    <Field>
                      <FieldLabel htmlFor="description">Brand Description</FieldLabel>
                      <Textarea id="description" name="description" rows={3} defaultValue={companyValue.description ?? ""} />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="aboutHeadline">About Headline</FieldLabel>
                      <Textarea id="aboutHeadline" name="aboutHeadline" rows={2} defaultValue={companyValue.aboutHeadline ?? ""} />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="aboutDescription">About Description</FieldLabel>
                      <Textarea id="aboutDescription" name="aboutDescription" rows={4} defaultValue={companyValue.aboutDescription ?? ""} />
                    </Field>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field>
                        <FieldLabel htmlFor="phone">Primary Phone</FieldLabel>
                        <Input id="phone" name="phone" defaultValue={contactValue.phone ?? "7977938960"} />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="email">Primary Email</FieldLabel>
                        <Input id="email" name="email" defaultValue={contactValue.email ?? "namaste@taakshvisolutionhub.com"} />
                      </Field>
                    </div>
                    <Field>
                      <FieldLabel htmlFor="address">Address</FieldLabel>
                      <Input id="address" name="address" defaultValue={contactValue.address ?? "Mumbai, Maharashtra, India"} />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="citiesLabel">Cities Label</FieldLabel>
                      <Input id="citiesLabel" name="citiesLabel" defaultValue={companyValue.citiesLabel ?? "Mumbai • Ahmedabad • Nasik • Lucknow"} />
                    </Field>
                  </FieldGroup>
                </TabsContent>

                <TabsContent value="seo">
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="seoTitle">Default Meta Title</FieldLabel>
                      <Input id="seoTitle" name="seoTitle" defaultValue={seoValue.title ?? ""} />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="seoDescription">Default Meta Description</FieldLabel>
                      <Input id="seoDescription" name="seoDescription" defaultValue={seoValue.description ?? ""} />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="seoOgImage">OG Image URL</FieldLabel>
                      <Input id="seoOgImage" name="seoOgImage" defaultValue={seoValue.ogImage ?? ""} />
                    </Field>
                  </FieldGroup>
                </TabsContent>

                <TabsContent value="social">
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="instagram">Instagram URL</FieldLabel>
                      <Input id="instagram" name="instagram" defaultValue={socialValue.instagram ?? ""} />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="facebook">Facebook URL</FieldLabel>
                      <Input id="facebook" name="facebook" defaultValue={socialValue.facebook ?? ""} />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="linkedin">LinkedIn URL</FieldLabel>
                      <Input id="linkedin" name="linkedin" defaultValue={socialValue.linkedin ?? ""} />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="whatsappChannel">WhatsApp Channel URL</FieldLabel>
                      <Input id="whatsappChannel" name="whatsappChannel" defaultValue={socialValue.whatsappChannel ?? ""} />
                    </Field>
                  </FieldGroup>
                </TabsContent>

                <TabsContent value="homepage">
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="heroBadge">Hero Badge</FieldLabel>
                      <Input id="heroBadge" name="heroBadge" defaultValue={homepageValue.heroBadge ?? ""} />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="heroHeadline">Hero Headline</FieldLabel>
                      <Input id="heroHeadline" name="heroHeadline" defaultValue={homepageValue.heroHeadline ?? ""} />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="heroSubheadline">Hero Subheadline</FieldLabel>
                      <Textarea id="heroSubheadline" name="heroSubheadline" rows={3} defaultValue={homepageValue.heroSubheadline ?? ""} />
                    </Field>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field>
                        <FieldLabel htmlFor="primaryCtaLabel">Primary CTA Label</FieldLabel>
                        <Input id="primaryCtaLabel" name="primaryCtaLabel" defaultValue={homepageValue.primaryCtaLabel ?? "Request Callback"} />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="secondaryCtaLabel">Secondary CTA Label</FieldLabel>
                        <Input id="secondaryCtaLabel" name="secondaryCtaLabel" defaultValue={homepageValue.secondaryCtaLabel ?? "WhatsApp Now"} />
                      </Field>
                    </div>
                    <Field>
                      <FieldLabel htmlFor="servicesHeading">Services Section Heading</FieldLabel>
                      <Input id="servicesHeading" name="servicesHeading" defaultValue={homepageValue.servicesHeading ?? ""} />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="whyChooseHeading">Why Choose Us Heading</FieldLabel>
                      <Input id="whyChooseHeading" name="whyChooseHeading" defaultValue={homepageValue.whyChooseHeading ?? ""} />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="whyChooseIntro">Why Choose Us Intro</FieldLabel>
                      <Textarea id="whyChooseIntro" name="whyChooseIntro" rows={3} defaultValue={homepageValue.whyChooseIntro ?? ""} />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="mediaHeading">Media Heading</FieldLabel>
                      <Input id="mediaHeading" name="mediaHeading" defaultValue={homepageValue.mediaHeading ?? ""} />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="mediaIntro">Media Intro</FieldLabel>
                      <Textarea id="mediaIntro" name="mediaIntro" rows={3} defaultValue={homepageValue.mediaIntro ?? ""} />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="ctaTitle">Homepage CTA Title</FieldLabel>
                      <Input id="ctaTitle" name="ctaTitle" defaultValue={homepageValue.ctaTitle ?? ""} />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="ctaCopy">Homepage CTA Copy</FieldLabel>
                      <Textarea id="ctaCopy" name="ctaCopy" rows={3} defaultValue={homepageValue.ctaCopy ?? ""} />
                    </Field>
                  </FieldGroup>
                </TabsContent>

                <TabsContent value="services">
                  <div className="grid gap-4">
                    {services.map((service) => (
                      <Card key={service.id} className="border-border/70">
                        <CardHeader>
                          <CardTitle className="text-lg">{service.name}</CardTitle>
                          <CardDescription>Edit the public-facing service card and detail-page summary.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                          <input type="hidden" name="serviceId" value={service.id} />
                          <div className="grid gap-4 md:grid-cols-2">
                            <Field>
                              <FieldLabel>Name</FieldLabel>
                              <Input name="serviceName" defaultValue={service.name} />
                            </Field>
                            <Field>
                              <FieldLabel>Slug</FieldLabel>
                              <Input name="serviceSlug" defaultValue={service.slug} />
                            </Field>
                          </div>
                          <div className="grid gap-4 md:grid-cols-2">
                            <Field>
                              <FieldLabel>Routing Email</FieldLabel>
                              <Input name="serviceEmail" type="email" defaultValue={service.serviceEmail ?? ""} />
                            </Field>
                            <Field>
                              <FieldLabel>Routing WhatsApp</FieldLabel>
                              <Input name="serviceWhatsappNumber" defaultValue={service.serviceWhatsappNumber ?? ""} />
                            </Field>
                          </div>
                          <Field>
                            <FieldLabel>Description</FieldLabel>
                            <Textarea name="serviceDescription" rows={3} defaultValue={service.description} />
                          </Field>
                          <Field orientation="horizontal">
                            <Checkbox id={`service-${service.id}`} name="serviceIsActive" value={service.id} defaultChecked={service.isActive} />
                            <FieldLabel htmlFor={`service-${service.id}`}>Active on website</FieldLabel>
                          </Field>
                          <Button variant="destructive" type="submit" formAction={deleteService} name="id" value={service.id}>
                            Delete Service
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                    <div className="flex justify-end">
                      <Button type="submit" formAction={updateServices} className="w-fit">
                        Save Services
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="routing">
                  <div className="grid gap-4">
                    {routingRules.map((rule) => (
                      <Card key={rule.id} className="border-border/70">
                        <CardHeader>
                          <CardTitle className="text-lg">{rule.service?.name ?? "Default Routing Rule"}</CardTitle>
                          <CardDescription>Controls callback, WhatsApp, and email ownership for this service path.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                          <input type="hidden" name="routingId" value={rule.id} />
                          <input type="hidden" name="routingServiceId" value={rule.serviceId ?? ""} />
                          <div className="grid gap-4 md:grid-cols-2">
                            <Field>
                              <FieldLabel>Owner Name</FieldLabel>
                              <Input name="routingOwnerName" defaultValue={rule.ownerName ?? ""} />
                            </Field>
                            <Field>
                              <FieldLabel>City</FieldLabel>
                              <Input name="routingCity" defaultValue={rule.city ?? ""} />
                            </Field>
                            <Field>
                              <FieldLabel>Phone</FieldLabel>
                              <Input name="routingMobile" defaultValue={rule.assignedMobile} />
                            </Field>
                            <Field>
                              <FieldLabel>WhatsApp</FieldLabel>
                              <Input name="routingWhatsapp" defaultValue={rule.assignedWhatsapp ?? rule.assignedMobile} />
                            </Field>
                            <Field>
                              <FieldLabel>Email</FieldLabel>
                              <Input name="routingEmail" defaultValue={rule.assignedEmail ?? ""} />
                            </Field>
                            <Field>
                              <FieldLabel>Priority</FieldLabel>
                              <Input name="routingPriority" type="number" defaultValue={rule.priority} />
                            </Field>
                          </div>
                          <Button variant="destructive" type="submit" formAction={deleteRoutingRule} name="id" value={rule.id}>
                            Delete Rule
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="email">
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="emailFrom">From Email</FieldLabel>
                      <Input id="emailFrom" name="emailFrom" defaultValue={emailValue.from ?? ""} />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="emailReplyTo">Reply-To Email</FieldLabel>
                      <Input id="emailReplyTo" name="emailReplyTo" defaultValue={emailValue.replyTo ?? ""} />
                    </Field>
                    <Field orientation="horizontal">
                      <Checkbox id="emailEnableBcc" name="emailEnableBcc" defaultChecked={emailValue.enableBcc ?? true} />
                      <FieldLabel htmlFor="emailEnableBcc">Enable BCC on outgoing lead emails</FieldLabel>
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="emailBcc">BCC Recipients</FieldLabel>
                      <Textarea
                        id="emailBcc"
                        name="emailBcc"
                        rows={4}
                        defaultValue={(emailValue.bcc ?? []).join("\n")}
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="emailCc">CC Recipients</FieldLabel>
                      <Textarea
                        id="emailCc"
                        name="emailCc"
                        rows={4}
                        defaultValue={(emailValue.cc ?? []).join("\n")}
                      />
                    </Field>
                  </FieldGroup>
                </TabsContent>

                <TabsContent value="recent">
                  <FieldGroup>
                    <Field orientation="horizontal">
                      <Checkbox id="recentEnabled" name="recentEnabled" defaultChecked={recentValue.enabled ?? true} />
                      <FieldLabel htmlFor="recentEnabled">Enable recent enquiry widget</FieldLabel>
                    </Field>
                    <Field orientation="horizontal">
                      <Checkbox id="recentLiveBadge" name="recentLiveBadge" defaultChecked={recentValue.liveBadge ?? true} />
                      <FieldLabel htmlFor="recentLiveBadge">Show live badge on enquiry widget</FieldLabel>
                    </Field>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field>
                        <FieldLabel htmlFor="recentLimit">Maximum records</FieldLabel>
                        <Input id="recentLimit" name="recentLimit" type="number" min="1" max="10" defaultValue={recentValue.limit ?? 4} />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="recentDisplayStyle">Display Style</FieldLabel>
                        <select
                          id="recentDisplayStyle"
                          name="recentDisplayStyle"
                          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                          defaultValue={recentValue.displayStyle ?? "floating-card"}
                        >
                          <option value="toast">Toast</option>
                          <option value="popup">Popup</option>
                          <option value="floating-card">Floating Card</option>
                        </select>
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="recentAutoHideSeconds">Auto Hide Seconds</FieldLabel>
                        <Input id="recentAutoHideSeconds" name="recentAutoHideSeconds" type="number" min="6" max="20" defaultValue={recentValue.autoHideSeconds ?? 10} />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="recentInactivityReappearSeconds">Inactivity Reappear Seconds</FieldLabel>
                        <Input id="recentInactivityReappearSeconds" name="recentInactivityReappearSeconds" type="number" min="20" max="120" defaultValue={recentValue.inactivityReappearSeconds ?? 45} />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="recentRotationSeconds">Rotation Seconds</FieldLabel>
                        <Input id="recentRotationSeconds" name="recentRotationSeconds" type="number" min="10" max="30" defaultValue={recentValue.rotationSeconds ?? 18} />
                      </Field>
                    </div>
                  </FieldGroup>
                </TabsContent>

                <TabsContent value="whatsapp">
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="whatsappPrimary">Primary WhatsApp Number</FieldLabel>
                      <Input id="whatsappPrimary" name="whatsappPrimary" defaultValue={whatsappValue.primary ?? ""} />
                    </Field>
                  </FieldGroup>
                </TabsContent>

                <TabsContent value="footer">
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="footerTrustHeading">Footer Trust Heading</FieldLabel>
                      <Input id="footerTrustHeading" name="footerTrustHeading" defaultValue={footerValue.trustHeading ?? "Why Clients Trust Us"} />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="footerTrustPoints">Footer Trust Points</FieldLabel>
                      <Textarea
                        id="footerTrustPoints"
                        name="footerTrustPoints"
                        rows={6}
                        defaultValue={(footerValue.trustPoints ?? []).join("\n")}
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="footerNewsletterLabel">Newsletter Label</FieldLabel>
                      <Input id="footerNewsletterLabel" name="footerNewsletterLabel" defaultValue={footerValue.newsletterLabel ?? "Newsletter Signup"} />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="footerCtaTitle">Footer CTA Title</FieldLabel>
                      <Input id="footerCtaTitle" name="footerCtaTitle" defaultValue={footerValue.ctaTitle ?? ""} />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="footerCtaCopy">Footer CTA Copy</FieldLabel>
                      <Textarea id="footerCtaCopy" name="footerCtaCopy" rows={3} defaultValue={footerValue.ctaCopy ?? ""} />
                    </Field>
                  </FieldGroup>
                </TabsContent>
              </Tabs>

              <Button type="submit" className="w-fit">
                Save Settings
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Add Routing Rule</CardTitle>
            <CardDescription>Create service owner rules used by callback requests, WhatsApp links, and email paths.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={createRoutingRule} className="grid gap-4">
              <div className="grid gap-4 md:grid-cols-3">
                    <Field>
                      <FieldLabel htmlFor="serviceId">Service</FieldLabel>
                      <select
                        id="serviceId"
                        name="serviceId"
                        className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                        defaultValue=""
                      >
                        <option value="">Default Rule</option>
                        {services.map((service) => (
                          <option key={service.id} value={service.id}>
                            {service.name}
                          </option>
                        ))}
                      </select>
                    </Field>
                <Field>
                  <FieldLabel htmlFor="city">City</FieldLabel>
                  <Input id="city" name="city" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="ownerName">Owner Name</FieldLabel>
                  <Input id="ownerName" name="ownerName" required />
                </Field>
                <Field>
                  <FieldLabel htmlFor="mobile">Phone</FieldLabel>
                  <Input id="mobile" name="mobile" required />
                </Field>
                <Field>
                  <FieldLabel htmlFor="whatsapp">WhatsApp</FieldLabel>
                  <Input id="whatsapp" name="whatsapp" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="routing-email">Email</FieldLabel>
                  <Input id="routing-email" name="email" type="email" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="priority">Priority</FieldLabel>
                  <Input id="priority" name="priority" type="number" defaultValue="100" />
                </Field>
              </div>
              <Button type="submit" className="w-fit">
                Add Rule
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Add Service</CardTitle>
            <CardDescription>Create a new service record that appears on the public website and in enquiry flows.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={createService} className="grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="service-name">Service Name</FieldLabel>
                  <Input id="service-name" name="name" required />
                </Field>
                <Field>
                  <FieldLabel htmlFor="service-slug">Slug</FieldLabel>
                  <Input id="service-slug" name="slug" required />
                </Field>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="service-email">Routing Email</FieldLabel>
                  <Input id="service-email" name="serviceEmail" type="email" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="service-whatsapp">Routing WhatsApp</FieldLabel>
                  <Input id="service-whatsapp" name="serviceWhatsappNumber" />
                </Field>
              </div>
              <Field>
                <FieldLabel htmlFor="service-description">Description</FieldLabel>
                <Textarea id="service-description" name="description" rows={3} required />
              </Field>
              <Button type="submit" className="w-fit">
                Add Service
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
