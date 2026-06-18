# Folder Structure

```text
src/app                  Next.js App Router routes, metadata, SEO files
src/app/(public)         Public marketing and SEO landing pages
src/app/admin            Protected CRM, CMS, analytics, and settings screens
src/components           Shared composed components
src/components/ui        shadcn/ui source components
src/lib                  Domain constants, validation, auth, db, integrations
src/server               Server actions and route handlers
prisma                   Production database schema and migrations
public/brand             Logo, design concept, and approved brand assets
docs                     Architecture and delivery documentation
```

The first implementation keeps public, admin, and domain logic separated so CRM/CMS permissions can grow without mixing marketing-page concerns into operational screens.
