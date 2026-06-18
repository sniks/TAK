# Component Architecture

```text
MarketingShell
  Header
  HeroSection
  ServiceGrid
  RecentEnquiries
  ContentPreview
  ContactSection
  Footer

EnquiryForm
  BaseFields
  ServiceQuestionFields
  ConsentControl
  SubmissionState

AdminShell
  AdminSidebar
  MetricCards
  LeadCharts
  LeadTable
  FollowupPanel
  CmsResourceTable
```

Components use shadcn/ui source primitives, semantic theme tokens, Framer Motion for reveal/transition behavior, and server actions for state-changing operations.
