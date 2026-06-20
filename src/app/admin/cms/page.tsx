import type { Metadata } from "next"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { requirePermission } from "@/lib/admin"
import { prisma } from "@/lib/db"
import {
  deleteBlogPost,
  deleteGalleryItem,
  deleteMediaAsset,
  deleteNewsPost,
  deleteTestimonial,
  duplicateBlogPost,
  duplicateNewsPost,
  saveBlogPost,
  saveGalleryItem,
  saveMediaAsset,
  saveNewsPost,
  saveTestimonial,
  saveUser,
  toggleUserActive,
} from "@/server/cms-actions"

export const metadata: Metadata = {
  title: "Admin CMS",
  robots: { index: false, follow: false },
}

export default async function AdminCmsPage() {
  await requirePermission("cms.read")

  const [blogs, news, galleryItems, testimonials, services, users, roles, mediaLibrary] = await Promise.all([
    prisma.blogPost.findMany({ orderBy: [{ publishDate: "desc" }, { title: "asc" }] }),
    prisma.newsPost.findMany({ orderBy: [{ publishDate: "desc" }, { title: "asc" }] }),
    prisma.galleryItem.findMany({ include: { service: true }, orderBy: { createdAt: "desc" } }),
    prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.service.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
    prisma.user.findMany({ include: { roles: { include: { role: true } } }, orderBy: { createdAt: "desc" } }),
    prisma.role.findMany({ orderBy: { name: "asc" } }),
    prisma.setting.findUnique({ where: { key: "media_library" } }),
  ])

  const mediaAssets = Array.isArray(mediaLibrary?.value)
    ? (mediaLibrary.value as Array<{ id: string; title: string; url: string; type: string; tags: string[] }>)
    : []

  return (
    <div className="min-h-screen bg-muted/35 p-4 sm:p-8">
      <div className="mx-auto grid w-full max-w-6xl gap-6">
        <Link href="/admin" className="text-sm font-medium text-muted-foreground">Back to dashboard</Link>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            ["Blog Posts", blogs.length],
            ["News Posts", news.length],
            ["Gallery Items", galleryItems.length],
            ["Testimonials", testimonials.length],
          ].map(([label, value]) => (
            <Card key={label as string}>
              <CardHeader>
                <CardTitle>{label as string}</CardTitle>
                <CardDescription>{value as number} records available in admin.</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="blogs" className="gap-6">
          <TabsList variant="line" className="flex w-full flex-wrap justify-start gap-2">
            <TabsTrigger value="blogs">Blogs</TabsTrigger>
            <TabsTrigger value="news">News</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="media">Media Library</TabsTrigger>
          </TabsList>

          <TabsContent value="blogs" className="grid gap-6">
            <CmsForm title="Blog CMS" action={saveBlogPost} mode="blog" />
            <CmsTable title="Blog Posts" rows={blogs} deleteAction={deleteBlogPost} duplicateAction={duplicateBlogPost} />
          </TabsContent>

          <TabsContent value="news" className="grid gap-6">
            <CmsForm title="News CMS" action={saveNewsPost} mode="news" />
            <CmsTable title="News Posts" rows={news} deleteAction={deleteNewsPost} duplicateAction={duplicateNewsPost} />
          </TabsContent>

          <TabsContent value="gallery" className="grid gap-6">
            <GalleryForm services={services} />
            <GalleryTable rows={galleryItems} />
          </TabsContent>

          <TabsContent value="testimonials" className="grid gap-6">
            <TestimonialForm />
            <TestimonialsTable rows={testimonials} />
          </TabsContent>

          <TabsContent value="users" className="grid gap-6">
            <UserForm roles={roles.map((role) => role.name)} />
            <UsersTable rows={users} />
          </TabsContent>

          <TabsContent value="media" className="grid gap-6">
            <MediaForm />
            <MediaTable rows={mediaAssets} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function CmsForm({ title, action, mode }: { title: string; action: (formData: FormData) => Promise<void>; mode: "blog" | "news" }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Create or update content records. Status supports draft, published, and scheduled.</CardDescription>
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
            <Field><FieldLabel>Featured Image URL</FieldLabel><Input name="featuredImage" /></Field>
            <Field><FieldLabel>Short Description</FieldLabel><Input name="shortDescription" required /></Field>
            <Field><FieldLabel>Content</FieldLabel><Textarea name="content" rows={5} required /></Field>
            <Field><FieldLabel>Tags</FieldLabel><Input name="tags" placeholder="events, planning" /></Field>
            <div className="grid gap-4 md:grid-cols-2">
              <Field><FieldLabel>Meta Title</FieldLabel><Input name="metaTitle" /></Field>
              <Field><FieldLabel>Meta Description</FieldLabel><Input name="metaDescription" /></Field>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Field><FieldLabel>Canonical URL</FieldLabel><Input name="canonicalUrl" /></Field>
              <Field><FieldLabel>Publish Date</FieldLabel><Input name="publishDate" type="datetime-local" /></Field>
            </div>
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
  duplicateAction,
}: {
  title: string
  rows: Array<{ id: string; title: string; slug: string; status: string; publishDate: Date | null }>
  deleteAction: (formData: FormData) => Promise<void>
  duplicateAction: (formData: FormData) => Promise<void>
}) {
  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow><TableHead>Title</TableHead><TableHead>Slug</TableHead><TableHead>Status</TableHead><TableHead>Publish Date</TableHead><TableHead>Actions</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.title}</TableCell>
                <TableCell>{row.slug}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell>{row.publishDate ? row.publishDate.toLocaleDateString("en-IN") : "Draft"}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <form action={duplicateAction}>
                      <input type="hidden" name="id" value={row.id} />
                      <Button variant="outline" type="submit">Duplicate</Button>
                    </form>
                    <form action={deleteAction}>
                      <input type="hidden" name="id" value={row.id} />
                      <Button variant="destructive" type="submit">Delete</Button>
                    </form>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

function GalleryForm({ services }: { services: Array<{ id: string; name: string }> }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gallery Manager</CardTitle>
        <CardDescription>Add media used by the public gallery.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={saveGalleryItem} className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Field><FieldLabel>Title</FieldLabel><Input name="title" required /></Field>
            <Field><FieldLabel>Category</FieldLabel><Input name="category" required /></Field>
            <Field><FieldLabel>Asset URL</FieldLabel><Input name="url" required /></Field>
            <Field><FieldLabel>Type</FieldLabel><Input name="type" defaultValue="IMAGE" /></Field>
          </div>
          <Field>
            <FieldLabel>Service</FieldLabel>
            <Select name="serviceId">
              <SelectTrigger className="w-full"><SelectValue placeholder="Select service" /></SelectTrigger>
              <SelectContent><SelectGroup>{services.map((service) => <SelectItem key={service.id} value={service.id}>{service.name}</SelectItem>)}</SelectGroup></SelectContent>
            </Select>
          </Field>
          <Button type="submit" className="w-fit">Save Gallery Item</Button>
        </form>
      </CardContent>
    </Card>
  )
}

function GalleryTable({ rows }: { rows: Array<{ id: string; title: string; category: string; type: string; url: string; service?: { name: string } | null }> }) {
  return (
    <Card>
      <CardHeader><CardTitle>Gallery Items</CardTitle></CardHeader>
      <CardContent>
        <Table>
          <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Category</TableHead><TableHead>Service</TableHead><TableHead>Type</TableHead><TableHead>Action</TableHead></TableRow></TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.title}</TableCell>
                <TableCell>{row.category}</TableCell>
                <TableCell>{row.service?.name ?? "General"}</TableCell>
                <TableCell>{row.type}</TableCell>
                <TableCell>
                  <form action={deleteGalleryItem}>
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

function TestimonialForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Testimonials Manager</CardTitle>
        <CardDescription>Control customer proof points shown on the public website.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={saveTestimonial} className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Field><FieldLabel>Name</FieldLabel><Input name="name" required /></Field>
            <Field><FieldLabel>Company / Service</FieldLabel><Input name="company" /></Field>
            <Field><FieldLabel>Photo URL</FieldLabel><Input name="photo" /></Field>
            <Field><FieldLabel>Rating</FieldLabel><Input name="rating" type="number" min="1" max="5" defaultValue="5" /></Field>
          </div>
          <Field><FieldLabel>Review</FieldLabel><Textarea name="review" rows={4} required /></Field>
          <Field orientation="horizontal">
            <Checkbox id="testimonial-active" name="isActive" defaultChecked />
            <FieldLabel htmlFor="testimonial-active">Active on website</FieldLabel>
          </Field>
          <Button type="submit" className="w-fit">Save Testimonial</Button>
        </form>
      </CardContent>
    </Card>
  )
}

function TestimonialsTable({ rows }: { rows: Array<{ id: string; name: string; company: string | null; rating: number; isActive: boolean }> }) {
  return (
    <Card>
      <CardHeader><CardTitle>Testimonials</CardTitle></CardHeader>
      <CardContent>
        <Table>
          <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Company</TableHead><TableHead>Rating</TableHead><TableHead>Status</TableHead><TableHead>Action</TableHead></TableRow></TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.company ?? "-"}</TableCell>
                <TableCell>{row.rating}/5</TableCell>
                <TableCell>{row.isActive ? "Active" : "Hidden"}</TableCell>
                <TableCell>
                  <form action={deleteTestimonial}>
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

function UserForm({ roles }: { roles: string[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>Create admin users and assign one role.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={saveUser} className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Field><FieldLabel>Name</FieldLabel><Input name="name" required /></Field>
            <Field><FieldLabel>Email</FieldLabel><Input name="email" type="email" required /></Field>
            <Field><FieldLabel>Password</FieldLabel><Input name="password" type="password" required /></Field>
            <Field>
              <FieldLabel>Role</FieldLabel>
              <Select name="roleName" defaultValue={roles[0]}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent><SelectGroup>{roles.map((role) => <SelectItem key={role} value={role}>{role}</SelectItem>)}</SelectGroup></SelectContent>
              </Select>
            </Field>
          </div>
          <Field orientation="horizontal">
            <Checkbox id="user-active" name="isActive" defaultChecked />
            <FieldLabel htmlFor="user-active">User can sign in</FieldLabel>
          </Field>
          <Button type="submit" className="w-fit">Create User</Button>
        </form>
      </CardContent>
    </Card>
  )
}

function UsersTable({
  rows,
}: {
  rows: Array<{ id: string; name: string; email: string; isActive: boolean; roles: Array<{ role: { name: string } }> }>
}) {
  return (
    <Card>
      <CardHeader><CardTitle>Users</CardTitle></CardHeader>
      <CardContent>
        <Table>
          <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Role</TableHead><TableHead>Status</TableHead><TableHead>Action</TableHead></TableRow></TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.roles.map((role) => role.role.name).join(", ") || "None"}</TableCell>
                <TableCell>{row.isActive ? "Active" : "Disabled"}</TableCell>
                <TableCell>
                  <form action={toggleUserActive}>
                    <input type="hidden" name="id" value={row.id} />
                    <input type="hidden" name="nextActive" value={row.isActive ? "false" : "true"} />
                    <Button variant="outline" type="submit">{row.isActive ? "Disable" : "Enable"}</Button>
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

function MediaForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Media Library</CardTitle>
        <CardDescription>Keep reusable URLs for homepage, blogs, news, gallery, and testimonials in one place.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={saveMediaAsset} className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Field><FieldLabel>Title</FieldLabel><Input name="title" required /></Field>
            <Field><FieldLabel>Type</FieldLabel><Input name="type" defaultValue="IMAGE" /></Field>
            <Field><FieldLabel>Asset URL</FieldLabel><Input name="url" required /></Field>
            <Field><FieldLabel>Tags</FieldLabel><Input name="tags" placeholder="hero, testimonial, gallery" /></Field>
          </div>
          <Button type="submit" className="w-fit">Save Media Asset</Button>
        </form>
      </CardContent>
    </Card>
  )
}

function MediaTable({ rows }: { rows: Array<{ id: string; title: string; url: string; type: string; tags: string[] }> }) {
  return (
    <Card>
      <CardHeader><CardTitle>Media Assets</CardTitle></CardHeader>
      <CardContent>
        <Table>
          <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Type</TableHead><TableHead>Tags</TableHead><TableHead>Action</TableHead></TableRow></TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.title}</TableCell>
                <TableCell>{row.type}</TableCell>
                <TableCell>{row.tags.join(", ")}</TableCell>
                <TableCell>
                  <form action={deleteMediaAsset}>
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
