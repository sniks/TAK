import type { Metadata } from "next"

import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { requirePermission } from "@/lib/admin"
import { getCmsCounts, getDashboardMetrics, getLeadRows, getLeadTrend, getRecentAuditLogs } from "@/lib/dashboard-data"

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: { index: false, follow: false },
}

export default async function AdminPage() {
  await requirePermission("analytics.read")

  const [metrics, leadRows, cmsCounts, leadTrend, auditLogs] = await Promise.all([
    getDashboardMetrics(),
    getLeadRows(),
    getCmsCounts(),
    getLeadTrend(),
    getRecentAuditLogs(),
  ])

  return <AdminDashboard metrics={metrics} leadRows={leadRows} cmsCounts={cmsCounts} leadTrend={leadTrend} auditLogs={auditLogs} />
}
