# API Documentation

## Server Actions

### `createLead`

Creates a lead from a public enquiry form.

Input is validated with `leadFormSchema`. The action masks public recent-enquiry output, assigns the lead owner through the lead routing engine, stores the full private lead, records an audit activity, and sends notifications when provider keys are configured.

### `updateLeadStatus`

Protected admin action. Requires CRM permission. Updates lead status and appends status history.

### `createFollowup`

Protected admin action. Creates follow-up reminders with date, time, notes, and owner.

## Route Handlers

| Route | Method | Purpose |
| --- | --- | --- |
| `/api/health` | GET | Deployment health probe |
| `/sitemap.xml` | GET | Next.js sitemap generation |
| `/robots.txt` | GET | Indexing rules |

All write operations must use schema validation, rate limiting, audit logging, and permission checks.
