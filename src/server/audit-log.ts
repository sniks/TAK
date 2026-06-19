"use server"

import { Prisma } from "@prisma/client"

import { auth } from "@/auth"
import { prisma } from "@/lib/db"

export async function recordAuditLog({
  action,
  entity,
  entityId,
  metadata,
}: {
  action: string
  entity: string
  entityId?: string | null
  metadata?: unknown
}) {
  const session = await auth()

  let actorId: string | null = null
  if (session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    })
    actorId = user?.id ?? null
  }

  await prisma.auditLog.create({
    data: {
      actorId,
      action,
      entity,
      entityId: entityId ?? null,
      metadata: metadata === undefined ? Prisma.JsonNull : (metadata as Prisma.InputJsonValue),
    },
  })
}
