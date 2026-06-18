import { redirect } from "next/navigation"

import { auth } from "@/auth"
import { AdminLoginForm } from "@/components/admin/admin-login-form"

export default async function AdminLoginPage() {
  const session = await auth()

  if (session?.user) {
    redirect("/admin")
  }

  return <AdminLoginForm />
}
