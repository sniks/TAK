import { Header } from "@/components/marketing/header"
import { SiteFooter } from "@/components/marketing/site-footer"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type SimplePageProps = {
  title: string
  description: string
  points: string[]
}

export function SimplePage({ title, description, points }: SimplePageProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-semibold text-[var(--brand-navy)]">{title}</h1>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">{description}</p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {points.map((point) => (
            <Card key={point}>
              <CardHeader>
                <CardTitle>{point}</CardTitle>
                <CardDescription>Taakshvi aims to keep this experience clear, respectful, and easy to understand.</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
