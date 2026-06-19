"use server"

import bcrypt from "bcryptjs"
import { PublishStatus, UserRoleName, type Prisma } from "@prisma/client"
import { revalidatePath } from "next/cache"

import { requirePermission } from "@/lib/admin"
import { prisma } from "@/lib/db"
import { recordAuditLog } from "@/server/audit-log"

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function toTags(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
}

async function revalidateCms() {
  revalidatePath("/admin/cms")
  revalidatePath("/blogs")
  revalidatePath("/news")
  revalidatePath("/gallery")
  revalidatePath("/testimonials")
}

export async function saveBlogPost(formData: FormData) {
  await requirePermission("cms.write")

  const id = String(formData.get("id") ?? "")
  const title = String(formData.get("title") ?? "")
  const slug = String(formData.get("slug") || toSlug(title))
  const status = String(formData.get("status") ?? "DRAFT") as PublishStatus
  const data = {
    title,
    slug,
    featuredImage: String(formData.get("featuredImage") || "") || null,
    shortDescription: String(formData.get("shortDescription") ?? ""),
    content: String(formData.get("content") ?? ""),
    tags: toTags(formData.get("tags")),
    metaTitle: String(formData.get("metaTitle") || title),
    metaDescription: String(formData.get("metaDescription") ?? ""),
    canonicalUrl: String(formData.get("canonicalUrl") || "") || null,
    status,
    publishDate:
      status === PublishStatus.PUBLISHED
        ? new Date(String(formData.get("publishDate") || "") || Date.now())
        : status === PublishStatus.SCHEDULED && formData.get("publishDate")
          ? new Date(String(formData.get("publishDate")))
          : null,
  } satisfies Prisma.BlogPostUncheckedCreateInput

  const post = id
    ? await prisma.blogPost.update({ where: { id }, data })
    : await prisma.blogPost.upsert({
        where: { slug },
        update: data,
        create: data,
      })

  await recordAuditLog({
    action: id ? "blog.updated" : "blog.saved",
    entity: "blog_post",
    entityId: post.id,
    metadata: { title, status },
  })
  await revalidateCms()
}

export async function saveNewsPost(formData: FormData) {
  await requirePermission("cms.write")

  const id = String(formData.get("id") ?? "")
  const title = String(formData.get("title") ?? "")
  const slug = String(formData.get("slug") || toSlug(title))
  const status = String(formData.get("status") ?? "DRAFT") as PublishStatus
  const data = {
    title,
    slug,
    newsUrl: String(formData.get("newsUrl") || "") || null,
    sourceName: String(formData.get("sourceName") || "") || null,
    featuredImage: String(formData.get("featuredImage") || "") || null,
    shortDescription: String(formData.get("shortDescription") ?? ""),
    content: String(formData.get("content") ?? ""),
    tags: toTags(formData.get("tags")),
    metaTitle: String(formData.get("metaTitle") || title),
    metaDescription: String(formData.get("metaDescription") ?? ""),
    canonicalUrl: String(formData.get("canonicalUrl") || "") || null,
    status,
    publishDate:
      status === PublishStatus.PUBLISHED
        ? new Date(String(formData.get("publishDate") || "") || Date.now())
        : status === PublishStatus.SCHEDULED && formData.get("publishDate")
          ? new Date(String(formData.get("publishDate")))
          : null,
  } satisfies Prisma.NewsPostUncheckedCreateInput

  const post = id
    ? await prisma.newsPost.update({ where: { id }, data })
    : await prisma.newsPost.upsert({
        where: { slug },
        update: data,
        create: data,
      })

  await recordAuditLog({
    action: id ? "news.updated" : "news.saved",
    entity: "news_post",
    entityId: post.id,
    metadata: { title, status },
  })
  await revalidateCms()
}

export async function deleteBlogPost(formData: FormData) {
  await requirePermission("cms.write")

  const id = String(formData.get("id"))
  await prisma.blogPost.delete({ where: { id } })
  await recordAuditLog({ action: "blog.deleted", entity: "blog_post", entityId: id })
  await revalidateCms()
}

export async function deleteNewsPost(formData: FormData) {
  await requirePermission("cms.write")

  const id = String(formData.get("id"))
  await prisma.newsPost.delete({ where: { id } })
  await recordAuditLog({ action: "news.deleted", entity: "news_post", entityId: id })
  await revalidateCms()
}

export async function duplicateBlogPost(formData: FormData) {
  await requirePermission("cms.write")

  const id = String(formData.get("id"))
  const post = await prisma.blogPost.findUniqueOrThrow({ where: { id } })

  const copy = await prisma.blogPost.create({
    data: {
      ...post,
      id: undefined,
      slug: `${post.slug}-copy-${Date.now().toString().slice(-4)}`,
      title: `${post.title} (Copy)`,
      status: PublishStatus.DRAFT,
      publishDate: null,
    },
  })

  await recordAuditLog({ action: "blog.duplicated", entity: "blog_post", entityId: copy.id, metadata: { sourceId: id } })
  await revalidateCms()
}

export async function duplicateNewsPost(formData: FormData) {
  await requirePermission("cms.write")

  const id = String(formData.get("id"))
  const post = await prisma.newsPost.findUniqueOrThrow({ where: { id } })

  const copy = await prisma.newsPost.create({
    data: {
      ...post,
      id: undefined,
      slug: `${post.slug}-copy-${Date.now().toString().slice(-4)}`,
      title: `${post.title} (Copy)`,
      status: PublishStatus.DRAFT,
      publishDate: null,
    },
  })

  await recordAuditLog({ action: "news.duplicated", entity: "news_post", entityId: copy.id, metadata: { sourceId: id } })
  await revalidateCms()
}

export async function saveGalleryItem(formData: FormData) {
  await requirePermission("gallery.write")

  const id = String(formData.get("id") ?? "")
  const title = String(formData.get("title") ?? "")
  const serviceId = String(formData.get("serviceId") ?? "") || null
  const data = {
    title,
    type: String(formData.get("type") ?? "IMAGE"),
    url: String(formData.get("url") ?? ""),
    category: String(formData.get("category") ?? ""),
    serviceId,
  }

  const item = id
    ? await prisma.galleryItem.update({ where: { id }, data })
    : await prisma.galleryItem.create({ data })

  await recordAuditLog({ action: id ? "gallery.updated" : "gallery.saved", entity: "gallery_item", entityId: item.id })
  await revalidateCms()
}

export async function deleteGalleryItem(formData: FormData) {
  await requirePermission("gallery.write")

  const id = String(formData.get("id"))
  await prisma.galleryItem.delete({ where: { id } })
  await recordAuditLog({ action: "gallery.deleted", entity: "gallery_item", entityId: id })
  await revalidateCms()
}

export async function saveTestimonial(formData: FormData) {
  await requirePermission("testimonials.write")

  const id = String(formData.get("id") ?? "")
  const data = {
    name: String(formData.get("name") ?? ""),
    company: String(formData.get("company") || "") || null,
    photo: String(formData.get("photo") || "") || null,
    rating: Number(formData.get("rating") ?? 5),
    review: String(formData.get("review") ?? ""),
    isActive: formData.get("isActive") === "on",
  }

  const item = id
    ? await prisma.testimonial.update({ where: { id }, data })
    : await prisma.testimonial.create({ data })

  await recordAuditLog({ action: id ? "testimonial.updated" : "testimonial.saved", entity: "testimonial", entityId: item.id })
  await revalidateCms()
}

export async function deleteTestimonial(formData: FormData) {
  await requirePermission("testimonials.write")

  const id = String(formData.get("id"))
  await prisma.testimonial.delete({ where: { id } })
  await recordAuditLog({ action: "testimonial.deleted", entity: "testimonial", entityId: id })
  await revalidateCms()
}

type MediaAssetRecord = {
  id: string
  title: string
  url: string
  type: string
  tags: string[]
}

async function getMediaLibrary() {
  const setting = await prisma.setting.findUnique({ where: { key: "media_library" } })
  const value = setting?.value
  return Array.isArray(value) ? (value as unknown as MediaAssetRecord[]) : []
}

export async function saveMediaAsset(formData: FormData) {
  await requirePermission("cms.write")

  const id = String(formData.get("id") ?? "")
  const current = await getMediaLibrary()
  const nextItem: MediaAssetRecord = {
    id: id || crypto.randomUUID(),
    title: String(formData.get("title") ?? ""),
    url: String(formData.get("url") ?? ""),
    type: String(formData.get("type") ?? "IMAGE"),
    tags: toTags(formData.get("tags")),
  }

  const next = current.some((item) => item.id === nextItem.id)
    ? current.map((item) => (item.id === nextItem.id ? nextItem : item))
    : [nextItem, ...current]

  await prisma.setting.upsert({
    where: { key: "media_library" },
    update: { value: next as unknown as Prisma.InputJsonValue },
    create: { key: "media_library", value: next as unknown as Prisma.InputJsonValue },
  })

  await recordAuditLog({ action: id ? "media.updated" : "media.saved", entity: "media_asset", entityId: nextItem.id })
  await revalidateCms()
}

export async function deleteMediaAsset(formData: FormData) {
  await requirePermission("cms.write")

  const id = String(formData.get("id"))
  const current = await getMediaLibrary()
  const next = current.filter((item) => item.id !== id)

  await prisma.setting.upsert({
    where: { key: "media_library" },
    update: { value: next as unknown as Prisma.InputJsonValue },
    create: { key: "media_library", value: next as unknown as Prisma.InputJsonValue },
  })

  await recordAuditLog({ action: "media.deleted", entity: "media_asset", entityId: id })
  await revalidateCms()
}

export async function saveUser(formData: FormData) {
  await requirePermission("users.manage")

  const id = String(formData.get("id") ?? "")
  const name = String(formData.get("name") ?? "")
  const email = String(formData.get("email") ?? "")
  const roleName = String(formData.get("roleName") ?? "ADMIN") as UserRoleName
  const password = String(formData.get("password") ?? "")
  const isActive = formData.get("isActive") === "on"

  const role = await prisma.role.findUniqueOrThrow({ where: { name: roleName } })

  if (id) {
    await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        isActive,
        ...(password ? { passwordHash: await bcrypt.hash(password, 12) } : {}),
      },
    })

    await prisma.userRole.deleteMany({ where: { userId: id } })
    await prisma.userRole.create({ data: { userId: id, roleId: role.id } })

    await recordAuditLog({ action: "user.updated", entity: "user", entityId: id, metadata: { roleName } })
  } else {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        isActive,
        passwordHash: password ? await bcrypt.hash(password, 12) : null,
      },
    })

    await prisma.userRole.create({ data: { userId: user.id, roleId: role.id } })
    await recordAuditLog({ action: "user.created", entity: "user", entityId: user.id, metadata: { roleName } })
  }

  await revalidateCms()
}

export async function toggleUserActive(formData: FormData) {
  await requirePermission("users.manage")

  const id = String(formData.get("id"))
  const nextActive = String(formData.get("nextActive")) === "true"

  await prisma.user.update({
    where: { id },
    data: { isActive: nextActive },
  })

  await recordAuditLog({ action: "user.toggled", entity: "user", entityId: id, metadata: { isActive: nextActive } })
  await revalidateCms()
}
