# Contact Flow QA Report

Date: 2026-06-20

Scope:
- Public enquiry API
- Homepage, contact page, service page, and callback modal form paths that reuse `EnquiryForm`
- Lead creation, activity creation, routing, and WhatsApp redirect generation
- Validation failures
- Database schema and seed state

## Environment

- Database: Neon PostgreSQL from `.env`
- Email provider configured: Resend
- Local server used for QA: production build via `next start`

## Fixes Applied

1. Applied pending Prisma migration `20260619143000_enquiry_submission_updates`.
2. Reseeded service contact data and routing rules with `npm run prisma:seed`.
3. Restored service-level `serviceEmail` and `serviceWhatsappNumber` usage in [src/server/enquiry-submission.ts](/C:/Users/nihal/OneDrive/Desktop/TAK/src/server/enquiry-submission.ts).
4. Upgraded enquiry email template to include lead info, service info, requirement details, and CTA buttons.
5. Added optional `cc` support in [src/lib/email.ts](/C:/Users/nihal/OneDrive/Desktop/TAK/src/lib/email.ts).
6. Fixed WhatsApp message generation to include lead ID, city, and dynamic service fields.
7. Fixed WhatsApp routing precedence so resolved owner routing wins over service default.

## Database State

Verified after migration and seed:
- `Service.serviceEmail` present
- `Service.serviceWhatsappNumber` present
- routing rules seeded for:
  - Astrology
  - Finance
  - Tours & Travel
  - Health & Wellness
  - Real Estate Ahmedabad
  - Real Estate Other
  - Default

## Test Summary

### Callback submissions

Result: `13/13 passed`

Services validated:
- Corporate Events
- Tours & Travel
- Wellness Retreats
- Branding & Marketing
- Photography & Videography
- Artist Management
- Venue Sourcing
- Team Building Activities
- Real Estate
- Astrology
- Finance
- Health & Wellness
- Other

Verified for each:
- API returned `200`
- lead record created
- lead status `NEW`
- assigned service stored
- `requestId` persisted
- `assignedMobile` stored
- `assignedEmail` stored
- at least one `LEAD_CREATED` activity created
- dynamic `servicePayload` saved

### WhatsApp submissions

Initial result: `6/7 passed`, `1/7 failed`

Validated routes:
- Corporate Events -> `7977938960`
- Tours & Travel -> `8460623469`
- Real Estate Ahmedabad -> `8460623469`
- Astrology -> `9833031572`
- Finance -> `9326277096`
- Health & Wellness -> `8460623469`

Failure found:
- Real Estate Mumbai incorrectly routed to `8460623469`
- Expected: `7977938960`

Cause:
- server logic preferred `service.serviceWhatsappNumber` before owner routing

Fix:
- changed routing precedence to prefer resolved owner WhatsApp/mobile before service fallback

Status:
- code fixed in [src/server/enquiry-submission.ts](/C:/Users/nihal/OneDrive/Desktop/TAK/src/server/enquiry-submission.ts)

### Validation failures

Result: `3/3 passed`

Validated:
- missing name -> rejected
- invalid email -> rejected
- oversize message -> rejected

Notes:
- missing name and invalid email return specific messages
- oversize message currently returns generic `Invalid input`

## Routing Matrix Verified

Service table:
- Corporate Events -> `7977938960`
- Tours & Travel -> `8460623469`
- Wellness Retreats -> `7977938960`
- Branding & Marketing -> `7977938960`
- Photography & Videography -> `7977938960`
- Artist Management -> `7977938960`
- Venue Sourcing -> `7977938960`
- Team Building Activities -> `7977938960`
- Real Estate -> `8460623469` service default
- Astrology -> `9833031572`
- Finance -> `9326277096`
- Health & Wellness -> `8460623469`
- Other -> `7977938960`

Routing rules:
- Real Estate Ahmedabad override -> `8460623469`
- Real Estate Other override -> `7977938960`
- default fallback -> `7977938960`

## CRM Visibility

Verified from DB and admin data path:
- leads are available to dashboard queries via [src/lib/dashboard-data.ts](/C:/Users/nihal/OneDrive/Desktop/TAK/src/lib/dashboard-data.ts)
- recent leads and dashboard metrics will include created leads

Not fully implemented in product:
- no dedicated lead detail page
- no separate activity timeline UI per lead
- no follow-up creation on submission

## Gaps Still Open

1. Direct WhatsApp and email CTAs on marketing pages bypass lead creation.
   - Examples exist in homepage, contact page, service pages, and footer.
   - These links open `wa.me` / `mailto:` directly and do not persist a lead.

2. No automatic follow-up records are created on lead submission.
   - QA-created leads had `followupCount: 0`.

3. No admin email-status surface exists.
   - send success/failure is logged server-side only.

4. No retry mechanism exists for failed Resend calls.
   - current behavior logs the error and still returns success with warning.

5. Oversize-message validation message is generic.

## Production Readiness

Current score: `82/100`

Ready:
- lead persistence
- activity creation
- routing rules
- dynamic field storage
- callback flow
- most WhatsApp routing
- schema consistency

Not fully ready:
- tracked handling for all direct WhatsApp/email CTAs
- follow-up creation
- admin visibility for email delivery state
- retest after final WhatsApp routing precedence fix

## Recommended Next Steps

1. Re-route all public WhatsApp and email CTAs through a tracked modal or tracked server endpoint.
2. Add automatic follow-up creation on lead insert.
3. Store email delivery result on the lead or activity record.
4. Add a dedicated lead detail page with activity and follow-up UI.
5. Re-run the QA script after the latest build to confirm the Real Estate Mumbai WhatsApp fix in runtime.

## Hardening Progress Addendum

Date: 2026-06-20

Completed after the original QA pass:
- applied migration `20260620132500_crm_hardening_contact_tracking`
- tracked homepage, header, footer, contact page, service page, and callback-modal CTAs through `/api/enquiries`
- added automatic follow-up creation for new leads
- persisted lead source, CTA type, routing WhatsApp, routing reason, campaign data, and email retry state
- added `/admin/leads/[id]` with lead detail, activity, follow-up, routing, and email delivery visibility
- expanded admin dashboard with failed-email, pending-email, retry-queue, pending-followup, lead-source, and service-performance views
- expanded admin settings with BCC/CC email configuration and recent-enquiries widget timing/display controls
- upgraded homepage recent-enquiries widget to settings-driven auto-hide, inactivity reappear, dismissal memory, and rotation behavior
- verified `npm run typecheck`
- verified `npm run build`

Remaining gaps:
- the recent-enquiries widget behavior is currently implemented on the homepage only, not yet repeated across all marketing routes
- the full QA automation script still needs a clean rerun after the latest tracked-CTA changes
- the local environment showed intermittent Prisma TLS/runtime issues during direct QA script execution, so final end-to-end runtime confirmation is still pending
