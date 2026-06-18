# Deployment Architecture

```mermaid
flowchart LR
  Git["Git Repository"] --> CI["CI: lint, typecheck, build"]
  CI --> Image["Docker Image"]
  Image --> VPS["VPS Runtime"]
  VPS --> Next["Next.js App"]
  Next --> Postgres["PostgreSQL"]
  Next --> S3["S3-Compatible Storage"]
  Next --> Resend["Resend Email"]
  Next --> Analytics["GA / GTM / Meta Pixel"]
```

The app is prepared for container deployment with environment-based provider configuration. Production should run behind a TLS reverse proxy, use managed or backed-up PostgreSQL, and store uploads outside the application filesystem.
