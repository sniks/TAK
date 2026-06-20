# TAAKSHVI Solution Hub Platform

Next.js application for the TAAKSHVI Solution Hub website, lead routing, CMS, and admin dashboard.

## Prerequisites

Install these before running the project:

- Node.js 20 or newer
- npm
- PostgreSQL 15 or newer
- Git

## 1. Clone the Repository

```bash
git clone <repository-url>
cd TAK
```

Replace `<repository-url>` with the GitHub repository URL.

## 2. Install Libraries

Install all project dependencies from `package-lock.json`:

```bash
npm install
```

## 3. Create Environment File

Copy the example environment file:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Update `.env` with your local values:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/taakshvi"
AUTH_SECRET="replace-with-strong-random-secret"
AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

Optional services such as Resend, S3, Google Analytics, GTM, and Meta Pixel can stay empty for local development unless you are testing those integrations.

## 4. Create the Database

Create a PostgreSQL database named `taakshvi`.

Example using `psql`:

```bash
createdb taakshvi
```

If your PostgreSQL username, password, host, or port are different, update `DATABASE_URL` in `.env`.

## 5. Generate Prisma Client

```bash
npm run prisma:generate
```

## 6. Run Database Migrations

```bash
npm run prisma:migrate
```

This applies the Prisma migrations from `prisma/migrations`.

## 7. Seed Demo Data

```bash 
npm run prisma:seed
```

The seed script creates services, routing rules, CMS content, testimonials, and an admin user.

Seeded admin login:

```text
Email: admin@taakshvisolutionhub.com
Password: ChangeMe@12345
```

Change this password before using the app in production.

## 8. Run the Development Server

```bash
 npm run dev
```

Open:

```text
http://localhost:3000
```

Admin pages:

```text
http://localhost:3000/admin/login
http://localhost:3000/admin
```

## Useful Commands

```bash
npm run dev              # Start local development server
npm run build            # Build production app
npm run start            # Start production build
npm run lint             # Run ESLint
npm run typecheck        # Run TypeScript checks
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Apply local database migrations
npm run prisma:seed      # Seed local database
```

## Deploy On Vercel

This project is a full Next.js app, so Vercel can deploy it directly from the repo root.

1. Push the repository to GitHub, GitLab, or Bitbucket.
2. In Vercel, create a new project and import this repository.
3. Leave the root directory as the repo root unless you move the app elsewhere.
4. Set these environment variables in Vercel for Production and Preview:
   - `DATABASE_URL`
   - `AUTH_SECRET`
   - `NEXT_PUBLIC_SITE_URL`
   - `AUTH_URL` if you want to pin the auth base URL explicitly
   - Any optional integrations you are using, such as `RESEND_API_KEY`, `S3_*`, or analytics IDs
5. Make sure the production database already has the Prisma schema applied.
6. Deploy.

Notes:

- Vercel automatically detects Next.js build settings for this project.
- The app already builds successfully with `npm run build` in this workspace.
- On Vercel, Auth.js can infer the host automatically, so `AUTH_URL` is often optional, but keeping it set to your production domain is fine.
- After changing environment variables in Vercel, you must redeploy for the new values to take effect.

## Project Structure

```text
src/app/          Next.js routes and pages
src/components/   UI, marketing, and admin components
src/lib/          Shared utilities, content, database, and routing logic
src/server/       Server actions
prisma/           Prisma schema, migrations, and seed script
public/brand/     Brand assets
docs/             Architecture and planning documents
qa/               QA screenshots and Playwright checks
```

## Documentation

More project documentation is available in `docs/`:

- `docs/folder-structure.md`
- `docs/database-er.md`
- `docs/api-documentation.md`
- `docs/component-architecture.md`
- `docs/deployment-architecture.md`
- `docs/security-plan.md`
- `docs/seo-strategy.md`
- `docs/development-roadmap.md`

## Troubleshooting

If Prisma cannot connect to the database, confirm PostgreSQL is running and `DATABASE_URL` is correct.

If the Prisma client is missing or outdated, run:

```bash
npm run prisma:generate
```

If dependencies are inconsistent, remove `node_modules` and reinstall:

```bash
rm -rf node_modules
npm install
```

On Windows PowerShell:

```powershell
Remove-Item -Recurse -Force node_modules
npm install
```
:;
::