import type { Metadata } from "next"

import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { requireAdminSession } from "@/lib/admin"
import { getCmsCounts, getDashboardMetrics, getLeadRows, getLeadTrend } from "@/lib/dashboard-data"

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: { index: false, follow: false },
}

export default async function AdminPage() {
  await requireAdminSession()

  const [metrics, leadRows, cmsCounts, leadTrend] = await Promise.all([
    getDashboardMetrics(),
    getLeadRows(),
    getCmsCounts(),
    getLeadTrend(),
  ])

  return <AdminDashboard metrics={metrics} leadRows={leadRows} cmsCounts={cmsCounts} leadTrend={leadTrend} />
}
