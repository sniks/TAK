import { redirect } from "next/navigation"

import { auth } from "@/auth"
import { prisma } from "@/lib/db"

export async function requireAdminSession() {
  const session = await auth()

  if (!session?.user) {
    redirect("/admin/login")
  }

  return session
}

export async function requirePermission(permissionKey: string) {
  const session = await requireAdminSession()
  const email = session.user?.email
  if (!email) {
    redirect("/admin/login")
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      roles: {
        include: {
          role: {
            include: {
              permissions: {
                include: {
                  permission: true,
                },
              },
            },
          },
        },
      },
    },
  })

  const permissions = new Set(
    user?.roles.flatMap((userRole) => userRole.role.permissions.map((rolePermission) => rolePermission.permission.key)) ?? []
  )

  if (!permissions.has(permissionKey) && !permissions.has("users.manage")) {
    redirect("/admin")
  }

  return { session, user, permissions }
}
