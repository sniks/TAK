import type { Metadata } from "next"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { requireAdminSession } from "@/lib/admin"
import { prisma } from "@/lib/db"
import { createRoutingRule, deleteRoutingRule, updateSettings } from "@/server/settings-actions"

export const metadata: Metadata = {
  title: "Admin Settings",
  robots: { index: false, follow: false },
}

export default async function SettingsPage() {
  await requireAdminSession()

  const [contact, recent, seo, social, homepage, emailSettings, whatsappSettings, footerSettings, mediaSettings, routingRules, services] =
    await Promise.all([
      prisma.setting.findUnique({ where: { key: "site_contact" } }),
      prisma.setting.findUnique({ where: { key: "recent_enquiries_widget" } }),
      prisma.setting.findUnique({ where: { key: "site_seo" } }),
      prisma.setting.findUnique({ where: { key: "site_social" } }),
      prisma.setting.findUnique({ where: { key: "homepage_settings" } }),
      prisma.setting.findUnique({ where: { key: "email_settings" } }),
      prisma.setting.findUnique({ where: { key: "whatsapp_settings" } }),
      prisma.setting.findUnique({ where: { key: "footer_settings" } }),
      prisma.setting.findUnique({ where: { key: "media_settings" } }),
      prisma.leadRoutingRule.findMany({
        include: { service: true },
        orderBy: [{ priority: "asc" }, { ownerName: "asc" }],
      }),
      prisma.service.findMany({ orderBy: { name: "asc" } }),
    ])

  const contactValue = (contact?.value ?? {}) as { phone?: string; email?: string }
  const recentValue = (recent?.value ?? {}) as { enabled?: boolean; limit?: number }
  const seoValue = (seo?.value ?? {}) as { title?: string; description?: string }
  const socialValue = (social?.value ?? {}) as { instagram?: string; facebook?: string; linkedin?: string }
  const homepageValue = (homepage?.value ?? {}) as { heroHeadline?: string; heroSubheadline?: string }
  const emailValue = (emailSettings?.value ?? {}) as { from?: string; replyTo?: string }
  const whatsappValue = (whatsappSettings?.value ?? {}) as { primary?: string }
  const footerValue = (footerSettings?.value ?? {}) as { trustHeading?: string }
  const mediaValue = (mediaSettings?.value ?? {}) as { sectionHeading?: string }

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
                  <TabsTrigger value="routing">Lead Routing</TabsTrigger>
                  <TabsTrigger value="email">Email Settings</TabsTrigger>
                  <TabsTrigger value="whatsapp">WhatsApp Settings</TabsTrigger>
                  <TabsTrigger value="footer">Footer Settings</TabsTrigger>
                  <TabsTrigger value="media">Media Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="general">
                  <FieldGroup>
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
                    <Field orientation="horizontal">
                      <Checkbox id="recentEnabled" name="recentEnabled" defaultChecked={recentValue.enabled ?? true} />
                      <FieldLabel htmlFor="recentEnabled">Enable recent enquiry widget</FieldLabel>
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="recentLimit">Recent enquiry records shown</FieldLabel>
                      <Input id="recentLimit" name="recentLimit" type="number" min="1" max="10" defaultValue={recentValue.limit ?? 4} />
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
                  </FieldGroup>
                </TabsContent>

                <TabsContent value="homepage">
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="heroHeadline">Hero Headline</FieldLabel>
                      <Input id="heroHeadline" name="heroHeadline" defaultValue={homepageValue.heroHeadline ?? ""} />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="heroSubheadline">Hero Subheadline</FieldLabel>
                      <Input id="heroSubheadline" name="heroSubheadline" defaultValue={homepageValue.heroSubheadline ?? ""} />
                    </Field>
                  </FieldGroup>
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
                  </FieldGroup>
                </TabsContent>

                <TabsContent value="media">
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="mediaSectionHeading">Media Section Heading</FieldLabel>
                      <Input id="mediaSectionHeading" name="mediaSectionHeading" defaultValue={mediaValue.sectionHeading ?? "Featured In"} />
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
      </div>
    </div>
  )
}
