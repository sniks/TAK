import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { requirePermission } from "@/lib/admin"
import { getLeadDetailById } from "@/lib/dashboard-data"

type Props = {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = {
  title: "Lead Detail",
  robots: { index: false, follow: false },
}

function formatDateTime(value: Date | null) {
  if (!value) return "-"
  return value.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default async function LeadDetailPage({ params }: Props) {
  await requirePermission("leads.read")

  const { id } = await params
  const lead = await getLeadDetailById(id)

  if (!lead) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-muted/35 p-4 sm:p-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <Link href="/admin" className="text-sm font-medium text-muted-foreground">
              Back to dashboard
            </Link>
            <h1 className="mt-2 text-3xl font-semibold text-[var(--brand-navy)]">{lead.fullName}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Lead ID {lead.id} {lead.requestId ? `| Request ID ${lead.requestId}` : ""}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{lead.status}</Badge>
            <Badge variant="secondary">{lead.emailStatus}</Badge>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <Card>
            <CardHeader>
              <CardTitle>Lead Information</CardTitle>
              <CardDescription>Core contact, service, and routing information.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div><div className="text-xs text-muted-foreground">Service</div><div className="font-medium">{lead.serviceName}</div></div>
              <div><div className="text-xs text-muted-foreground">Submission Type</div><div className="font-medium">{lead.submissionType}</div></div>
              <div><div className="text-xs text-muted-foreground">Source</div><div className="font-medium">{lead.source}</div></div>
              <div><div className="text-xs text-muted-foreground">CTA Type</div><div className="font-medium">{lead.ctaType ?? "-"}</div></div>
              <div><div className="text-xs text-muted-foreground">Name</div><div className="font-medium">{lead.fullName}</div></div>
              <div><div className="text-xs text-muted-foreground">Company</div><div className="font-medium">{lead.company ?? "-"}</div></div>
              <div><div className="text-xs text-muted-foreground">Mobile</div><div className="font-medium">{lead.mobile}</div></div>
              <div><div className="text-xs text-muted-foreground">WhatsApp</div><div className="font-medium">{lead.whatsapp ?? "-"}</div></div>
              <div><div className="text-xs text-muted-foreground">Email</div><div className="font-medium">{lead.email}</div></div>
              <div><div className="text-xs text-muted-foreground">City</div><div className="font-medium">{lead.city}</div></div>
              <div><div className="text-xs text-muted-foreground">Assigned Mobile</div><div className="font-medium">{lead.assignedMobile}</div></div>
              <div><div className="text-xs text-muted-foreground">Assigned Email</div><div className="font-medium">{lead.assignedEmail}</div></div>
              <div><div className="text-xs text-muted-foreground">Routing WhatsApp</div><div className="font-medium">{lead.routingWhatsapp ?? "-"}</div></div>
              <div><div className="text-xs text-muted-foreground">Routing Reason</div><div className="font-medium">{lead.routingReason ?? "-"}</div></div>
              <div><div className="text-xs text-muted-foreground">Created</div><div className="font-medium">{formatDateTime(lead.createdAt)}</div></div>
              <div><div className="text-xs text-muted-foreground">Updated</div><div className="font-medium">{formatDateTime(lead.updatedAt)}</div></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Email Delivery</CardTitle>
              <CardDescription>Resend state, retries, and last delivery details.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div><div className="text-xs text-muted-foreground">Status</div><div className="font-medium">{lead.emailStatus}</div></div>
                <div><div className="text-xs text-muted-foreground">Retry Count</div><div className="font-medium">{lead.emailRetryCount}</div></div>
                <div><div className="text-xs text-muted-foreground">Message ID</div><div className="font-medium break-all">{lead.emailMessageId ?? "-"}</div></div>
                <div><div className="text-xs text-muted-foreground">Last Attempt</div><div className="font-medium">{formatDateTime(lead.emailLastAttemptAt)}</div></div>
                <div><div className="text-xs text-muted-foreground">Sent At</div><div className="font-medium">{formatDateTime(lead.emailSentAt)}</div></div>
                <div><div className="text-xs text-muted-foreground">Next Retry</div><div className="font-medium">{formatDateTime(lead.emailNextRetryAt)}</div></div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Last Error</div>
                <div className="mt-1 rounded-lg border bg-background p-3 text-sm">{lead.emailLastError ?? "No delivery error logged."}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Requirement</CardTitle>
              <CardDescription>Submitted message and structured form payload.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div>
                <div className="text-xs text-muted-foreground">Message</div>
                <div className="mt-1 rounded-lg border bg-background p-3 text-sm whitespace-pre-wrap">{lead.message ?? "-"}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Service Payload</div>
                <pre className="mt-1 overflow-x-auto rounded-lg border bg-background p-3 text-xs">{JSON.stringify(lead.servicePayload, null, 2)}</pre>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Campaign Data</div>
                <pre className="mt-1 overflow-x-auto rounded-lg border bg-background p-3 text-xs">{JSON.stringify(lead.campaignData, null, 2)}</pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Followups</CardTitle>
              <CardDescription>Automatically created and manual followup records.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Due</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lead.followups.length ? (
                    lead.followups.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.type ?? "-"}</TableCell>
                        <TableCell>{item.status ?? "-"}</TableCell>
                        <TableCell>{item.priority ?? "-"}</TableCell>
                        <TableCell>{formatDateTime(item.dueAt)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">No followups yet.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <Card>
            <CardHeader>
              <CardTitle>Assignments & Notes</CardTitle>
              <CardDescription>Owner mapping and internal notes on the lead.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5">
              <div>
                <div className="mb-2 text-sm font-medium">Assignments</div>
                <div className="grid gap-3">
                  {lead.assignments.length ? (
                    lead.assignments.map((item) => (
                      <div key={item.id} className="rounded-lg border bg-background p-3 text-sm">
                        <div className="font-medium">{item.ownerName ?? "Assigned Owner"}</div>
                        <div className="text-muted-foreground">{item.mobile} {item.email ? `| ${item.email}` : ""}</div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-lg border bg-background p-3 text-sm text-muted-foreground">No assignments recorded.</div>
                  )}
                </div>
              </div>
              <div>
                <div className="mb-2 text-sm font-medium">Notes</div>
                <div className="grid gap-3">
                  {lead.notes.length ? (
                    lead.notes.map((item) => (
                      <div key={item.id} className="rounded-lg border bg-background p-3 text-sm">
                        <div>{item.note}</div>
                        <div className="mt-1 text-xs text-muted-foreground">{formatDateTime(item.createdAt)}</div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-lg border bg-background p-3 text-sm text-muted-foreground">No notes recorded.</div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
              <CardDescription>Submission, routing, email, and retry activity.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              {lead.activities.length ? (
                lead.activities.map((item) => (
                  <div key={item.id} className="rounded-lg border bg-background p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-medium text-sm">{item.type}</div>
                      <div className="text-xs text-muted-foreground">{formatDateTime(item.createdAt)}</div>
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">{item.message}</div>
                    {Object.keys(item.metadata).length ? (
                      <pre className="mt-2 overflow-x-auto rounded-md bg-muted p-2 text-[11px]">{JSON.stringify(item.metadata, null, 2)}</pre>
                    ) : null}
                  </div>
                ))
              ) : (
                <div className="rounded-lg border bg-background p-3 text-sm text-muted-foreground">No activity recorded.</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
