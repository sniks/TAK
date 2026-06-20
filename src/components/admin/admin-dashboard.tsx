import Link from "next/link"
import { BarChart3Icon, CalendarClockIcon, FileTextIcon, GalleryHorizontalIcon, SettingsIcon, UsersIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type AdminDashboardProps = {
  metrics: {
    total: number
    today: number
    new: number
    qualified: number
    won: number
    lost: number
    failedEmails: number
    pendingEmails: number
    retryQueue: number
    pendingFollowups: number
    unassignedLeads: number
    pendingContactRequests: number
    conversionRate: number
  }
  leadRows: Array<{
    id: string
    date: string
    name: string
    mobile: string
    service: string
    city: string
    assignedTo: string
    status: string
    source: string
    emailStatus: string
    pendingFollowups: number
  }>
  cmsCounts: {
    blogs: number
    news: number
    gallery: number
    testimonials: number
    settings: number
  }
  leadTrend: Array<{ label: string; leads: number; qualified: number }>
  auditLogs: Array<{
    id: string
    actor: string
    action: string
    entity: string
    createdAt: string
  }>
  leadSources: Array<{
    source: string
    count: number
  }>
  servicePerformance: Array<{
    service: string
    total: number
    won: number
    conversionRate: number
  }>
}

export function AdminDashboard({
  metrics,
  leadRows,
  cmsCounts,
  leadTrend,
  auditLogs,
  leadSources,
  servicePerformance,
}: AdminDashboardProps) {
  const modules = [
    ["Lead Management", `${metrics.total} lead records with status, ownership, and follow-up visibility.`, UsersIcon],
    ["Blog CMS", `${cmsCounts.blogs} published and draft blog records.`, FileTextIcon],
    ["News CMS", `${cmsCounts.news} media and coverage records.`, FileTextIcon],
    ["Gallery", `${cmsCounts.gallery} gallery assets ready for category management.`, GalleryHorizontalIcon],
    ["Testimonials", `${cmsCounts.testimonials} testimonial records.`, UsersIcon],
    ["Settings", `${cmsCounts.settings} configuration groups available for editing.`, SettingsIcon],
  ]

  const statusRows = [
    ["New", metrics.new.toString(), "Unworked inbound leads"],
    ["Qualified", metrics.qualified.toString(), "Leads ready for proposal"],
    ["Won", metrics.won.toString(), "Closed successful leads"],
    ["Lost", metrics.lost.toString(), "Closed unsuccessful leads"],
  ]

  const maxTrend = Math.max(1, ...leadTrend.map((item) => item.leads))

  return (
    <div className="min-h-screen bg-muted/35">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="border-r border-border bg-[var(--brand-navy)] p-6 text-white">
          <Link href="/" className="text-lg font-semibold">
            TAAKSHVI Admin
          </Link>
          <Separator className="my-6 bg-white/15" />
          <nav className="grid gap-2 text-sm text-white/75">
            {[
              ["Dashboard", "/admin"],
              ["Content", "/admin/cms"],
              ["Settings", "/admin/settings"],
              ["View Website", "/"],
            ].map(([item, href]) => (
              <Link key={item} href={href} className="rounded-lg px-3 py-2 transition hover:bg-white/10 hover:text-white">
                {item}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-[var(--brand-navy)]">Admin Dashboard</h1>
              <p className="mt-2 text-muted-foreground">
                Review inbound activity, content volume, and operational settings from one central workspace.
              </p>
            </div>
            <Badge variant="secondary">Secure Admin Area</Badge>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              ["Total Leads", metrics.total.toString(), BarChart3Icon],
              ["New Leads", metrics.new.toString(), UsersIcon],
              ["Today's Leads", metrics.today.toString(), CalendarClockIcon],
              ["Conversion Rate", `${metrics.conversionRate}%`, BarChart3Icon],
            ].map(([label, value, Icon]) => (
              <Card key={label as string}>
                <CardHeader>
                  <CardTitle>{label as string}</CardTitle>
                  <CardDescription>Current operational snapshot.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-semibold">{value as string}</span>
                    <Icon className="text-[var(--brand-blue)]" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              ["Failed Emails", metrics.failedEmails.toString(), FileTextIcon],
              ["Pending Emails", metrics.pendingEmails.toString(), FileTextIcon],
              ["Pending Followups", metrics.pendingFollowups.toString(), CalendarClockIcon],
              ["Unassigned Leads", metrics.unassignedLeads.toString(), UsersIcon],
            ].map(([label, value, Icon]) => (
              <Card key={label as string}>
                <CardHeader>
                  <CardTitle>{label as string}</CardTitle>
                  <CardDescription>Launch-readiness watchlist.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-semibold">{value as string}</span>
                    <Icon className="text-[var(--brand-pink)]" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <Card>
              <CardHeader>
                <CardTitle>Lead Trends</CardTitle>
                <CardDescription>Last 14 days of enquiry activity.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex h-52 items-end gap-2">
                  {leadTrend.map((item) => (
                    <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
                      <div className="flex h-40 w-full items-end rounded-lg bg-muted px-1">
                        <div
                          className="w-full rounded-md bg-[linear-gradient(180deg,var(--brand-pink),var(--brand-blue))]"
                          style={{ height: `${Math.max(6, (item.leads / maxTrend) * 100)}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-muted-foreground">{item.label}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Operational Queue</CardTitle>
                <CardDescription>Contacts, followups, and delivery work waiting on the team.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Queue</TableHead>
                      <TableHead>Count</TableHead>
                      <TableHead>State</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      ["New Leads", metrics.new.toString(), "Fresh inbound leads"],
                      ["Pending Contact Requests", metrics.pendingContactRequests.toString(), "Same-day new requests"],
                      ["Retry Queue", metrics.retryQueue.toString(), "Email retries waiting to run"],
                      ["Pending Followups", metrics.pendingFollowups.toString(), "Outstanding followup actions"],
                    ].map((row) => (
                      <TableRow key={row[0]}>
                        <TableCell>{row[0]}</TableCell>
                        <TableCell>{row[1]}</TableCell>
                        <TableCell className="text-muted-foreground">{row[2]}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recent Leads</CardTitle>
              <CardDescription>Latest enquiry records. Private details remain visible only inside admin.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Open Followups</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leadRows.length ? (
                    leadRows.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell>{lead.date}</TableCell>
                        <TableCell>
                          <Link href={`/admin/leads/${lead.id}`} className="font-medium text-[var(--brand-navy)] hover:underline">
                            {lead.name}
                          </Link>
                        </TableCell>
                        <TableCell>{lead.mobile}</TableCell>
                        <TableCell>{lead.service}</TableCell>
                        <TableCell>{lead.city}</TableCell>
                        <TableCell>{lead.assignedTo}</TableCell>
                        <TableCell><Badge variant="secondary">{lead.status}</Badge></TableCell>
                        <TableCell>{lead.source}</TableCell>
                        <TableCell>{lead.emailStatus}</TableCell>
                        <TableCell>{lead.pendingFollowups}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={10} className="h-24 text-center text-muted-foreground">
                        No leads have been submitted yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest content, settings, and routing changes recorded in the audit trail.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Actor</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Module</TableHead>
                      <TableHead>Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{log.actor}</TableCell>
                        <TableCell>{log.action}</TableCell>
                        <TableCell>{log.entity}</TableCell>
                        <TableCell>{log.createdAt}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Lead Status Pipeline</CardTitle>
                <CardDescription>Current lead-stage distribution.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Status</TableHead>
                      <TableHead>Count</TableHead>
                      <TableHead>State</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {statusRows.map((row) => (
                      <TableRow key={row[0]}>
                        <TableCell>{row[0]}</TableCell>
                        <TableCell>{row[1]}</TableCell>
                        <TableCell className="text-muted-foreground">{row[2]}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
          <div className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <Card>
              <CardHeader>
                <CardTitle>Lead Sources</CardTitle>
                <CardDescription>Top inbound source labels currently landing in CRM.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Source</TableHead>
                      <TableHead>Leads</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leadSources.map((item) => (
                      <TableRow key={item.source}>
                        <TableCell>{item.source}</TableCell>
                        <TableCell>{item.count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Service Performance</CardTitle>
                <CardDescription>Lead volume and win rate by service.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Won</TableHead>
                      <TableHead>Conv.</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {servicePerformance.map((item) => (
                      <TableRow key={item.service}>
                        <TableCell>{item.service}</TableCell>
                        <TableCell>{item.total}</TableCell>
                        <TableCell>{item.won}</TableCell>
                        <TableCell>{item.conversionRate}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {modules.map(([title, copy, Icon]) => (
              <Card key={title as string}>
                <CardHeader>
                  <Icon className="text-[var(--brand-pink)]" />
                  <CardTitle>{title as string}</CardTitle>
                  <CardDescription>{copy as string}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
