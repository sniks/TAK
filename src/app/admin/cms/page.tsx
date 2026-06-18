import type { Metadata } from "next"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { requireAdminSession } from "@/lib/admin"
import { prisma } from "@/lib/db"
import { createBlogPost, createNewsPost, deleteBlogPost, deleteNewsPost } from "@/server/cms-actions"

export const metadata: Metadata = {
  title: "Admin CMS",
  robots: { index: false, follow: false },
}

export default async function AdminCmsPage() {
  await requireAdminSession()

  const [blogs, news] = await Promise.all([
    prisma.blogPost.findMany({ orderBy: { publishDate: "desc" } }),
    prisma.newsPost.findMany({ orderBy: { publishDate: "desc" } }),
  ])

  return (
    <div className="min-h-screen bg-muted/35 p-4 sm:p-8">
      <div className="mx-auto grid w-full max-w-6xl gap-6">
        <Link href="/admin" className="text-sm font-medium text-muted-foreground">Back to dashboard</Link>
        <div className="grid gap-6 lg:grid-cols-2">
          <CmsForm title="Blog CMS" action={createBlogPost} mode="blog" />
          <CmsForm title="News CMS" action={createNewsPost} mode="news" />
        </div>
        <CmsTable title="Blog Posts" rows={blogs} deleteAction={deleteBlogPost} />
        <CmsTable title="News Posts" rows={news} deleteAction={deleteNewsPost} />
      </div>
    </div>
  )
}

function CmsForm({ title, action, mode }: { title: string; action: (formData: FormData) => Promise<void>; mode: "blog" | "news" }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Create or update by slug. Status supports draft, published, and scheduled.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="grid gap-4">
          <FieldGroup>
            <Field><FieldLabel>Title</FieldLabel><Input name="title" required /></Field>
            <Field><FieldLabel>Slug</FieldLabel><Input name="slug" /></Field>
            {mode === "news" ? (
              <div className="grid gap-4 md:grid-cols-2">
                <Field><FieldLabel>News URL</FieldLabel><Input name="newsUrl" /></Field>
                <Field><FieldLabel>Source Name</FieldLabel><Input name="sourceName" /></Field>
              </div>
            ) : null}
            <Field><FieldLabel>Short Description</FieldLabel><Input name="shortDescription" required /></Field>
            <Field><FieldLabel>Content</FieldLabel><Textarea name="content" rows={5} required /></Field>
            <Field><FieldLabel>Tags</FieldLabel><Input name="tags" placeholder="events, planning" /></Field>
            <div className="grid gap-4 md:grid-cols-2">
              <Field><FieldLabel>Meta Title</FieldLabel><Input name="metaTitle" /></Field>
              <Field><FieldLabel>Meta Description</FieldLabel><Input name="metaDescription" /></Field>
            </div>
            {mode === "blog" ? <Field><FieldLabel>Canonical URL</FieldLabel><Input name="canonicalUrl" /></Field> : null}
            <Field>
              <FieldLabel>Status</FieldLabel>
              <Select name="status" defaultValue="DRAFT">
                <SelectTrigger className="w-full"><SelectValue>Draft</SelectValue></SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="PUBLISHED">Published</SelectItem>
                    <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>
          <Button type="submit">Save {mode === "blog" ? "Blog" : "News"}</Button>
        </form>
      </CardContent>
    </Card>
  )
}

function CmsTable({
  title,
  rows,
  deleteAction,
}: {
  title: string
  rows: Array<{ id: string; title: string; slug: string; status: string }>
  deleteAction: (formData: FormData) => Promise<void>
}) {
  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow><TableHead>Title</TableHead><TableHead>Slug</TableHead><TableHead>Status</TableHead><TableHead>Action</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.title}</TableCell>
                <TableCell>{row.slug}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell>
                  <form action={deleteAction}>
                    <input type="hidden" name="id" value={row.id} />
                    <Button variant="destructive" type="submit">Delete</Button>
                  </form>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
