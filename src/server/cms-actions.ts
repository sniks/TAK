"use server"

import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/db"

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export async function createBlogPost(formData: FormData) {
  const title = String(formData.get("title") ?? "")
  const slug = String(formData.get("slug") || toSlug(title))
  const status = String(formData.get("status") ?? "DRAFT") as "DRAFT" | "PUBLISHED" | "SCHEDULED"

  await prisma.blogPost.upsert({
    where: { slug },
    update: {
      title,
      shortDescription: String(formData.get("shortDescription") ?? ""),
      content: String(formData.get("content") ?? ""),
      tags: String(formData.get("tags") ?? "").split(",").map((tag) => tag.trim()).filter(Boolean),
      metaTitle: String(formData.get("metaTitle") || title),
      metaDescription: String(formData.get("metaDescription") ?? ""),
      canonicalUrl: String(formData.get("canonicalUrl") || "") || null,
      status,
      publishDate: status === "DRAFT" ? null : new Date(),
    },
    create: {
      title,
      slug,
      shortDescription: String(formData.get("shortDescription") ?? ""),
      content: String(formData.get("content") ?? ""),
      tags: String(formData.get("tags") ?? "").split(",").map((tag) => tag.trim()).filter(Boolean),
      metaTitle: String(formData.get("metaTitle") || title),
      metaDescription: String(formData.get("metaDescription") ?? ""),
      canonicalUrl: String(formData.get("canonicalUrl") || "") || null,
      status,
      publishDate: status === "DRAFT" ? null : new Date(),
    },
  })

  revalidatePath("/admin/cms")
  revalidatePath("/blogs")
}

export async function createNewsPost(formData: FormData) {
  const title = String(formData.get("title") ?? "")
  const slug = String(formData.get("slug") || toSlug(title))
  const status = String(formData.get("status") ?? "DRAFT") as "DRAFT" | "PUBLISHED" | "SCHEDULED"

  await prisma.newsPost.upsert({
    where: { slug },
    update: {
      title,
      newsUrl: String(formData.get("newsUrl") || "") || null,
      sourceName: String(formData.get("sourceName") || "") || null,
      shortDescription: String(formData.get("shortDescription") ?? ""),
      content: String(formData.get("content") ?? ""),
      tags: String(formData.get("tags") ?? "").split(",").map((tag) => tag.trim()).filter(Boolean),
      metaTitle: String(formData.get("metaTitle") || title),
      metaDescription: String(formData.get("metaDescription") ?? ""),
      status,
      publishDate: status === "DRAFT" ? null : new Date(),
    },
    create: {
      title,
      slug,
      newsUrl: String(formData.get("newsUrl") || "") || null,
      sourceName: String(formData.get("sourceName") || "") || null,
      shortDescription: String(formData.get("shortDescription") ?? ""),
      content: String(formData.get("content") ?? ""),
      tags: String(formData.get("tags") ?? "").split(",").map((tag) => tag.trim()).filter(Boolean),
      metaTitle: String(formData.get("metaTitle") || title),
      metaDescription: String(formData.get("metaDescription") ?? ""),
      status,
      publishDate: status === "DRAFT" ? null : new Date(),
    },
  })

  revalidatePath("/admin/cms")
  revalidatePath("/news")
}

export async function deleteBlogPost(formData: FormData) {
  await prisma.blogPost.delete({ where: { id: String(formData.get("id")) } })
  revalidatePath("/admin/cms")
  revalidatePath("/blogs")
}

export async function deleteNewsPost(formData: FormData) {
  await prisma.newsPost.delete({ where: { id: String(formData.get("id")) } })
  revalidatePath("/admin/cms")
  revalidatePath("/news")
}

