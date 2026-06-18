# Database ER Diagram

```mermaid
erDiagram
  User ||--o{ Session : owns
  Role ||--o{ UserRole : grants
  Permission ||--o{ RolePermission : includes
  User ||--o{ LeadAssignment : receives
  Lead ||--o{ LeadAssignment : has
  Lead ||--o{ LeadActivity : records
  Lead ||--o{ LeadNote : contains
  Lead ||--o{ Followup : schedules
  Service ||--o{ Lead : requested_for
  Service ||--o{ LeadRoutingRule : routes
  Service ||--o{ GalleryItem : categorizes
  User ||--o{ BlogPost : authors
  User ||--o{ NewsPost : authors
  User ||--o{ CaseStudy : authors
  User ||--o{ SuccessStory : authors
  Setting ||--o{ LeadRoutingRule : configures
```

The Prisma schema in `prisma/schema.prisma` is the implementation source of truth. Query paths should index lead status, service, city, assignment owner, publish status, slug, and scheduled follow-up date.
