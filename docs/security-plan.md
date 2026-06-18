# Security Plan

- Use NextAuth for authenticated admin sessions.
- Enforce role-based permissions for Super Admin, Admin, and Content Manager.
- Validate all input with Zod before persistence.
- Store private lead fields only in CRM views; public recent-enquiry widgets must use masked names and never expose mobile, email, or company data.
- Add rate limiting to public lead and contact routes before launch.
- Record audit logs for login, lead status changes, assignment changes, CMS publishes, exports, and settings changes.
- Use CSRF-safe server actions and same-site session cookies.
- Sanitize rich CMS content before rendering.
- Keep S3 uploads private by default and serve through signed URLs when needed.
