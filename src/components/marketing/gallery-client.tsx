"use client"

import { useMemo, useState } from "react"
import { XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

type GalleryItem = {
  title: string
  category: string
  type: string
  url: string
}

export function GalleryClient({ items }: { items: GalleryItem[] }) {
  const [category, setCategory] = useState("All")
  const [active, setActive] = useState<GalleryItem | null>(null)

  const categories = ["All", "Events", "Travel", "Wellness", "Real Estate", "Photography"]
  const visible = useMemo(
    () => (category === "All" ? items : items.filter((item) => item.category === category)),
    [category, items]
  )

  return (
    <div className="grid gap-8">
      <div className="flex flex-wrap gap-2">
        {categories.map((item) => (
          <Button key={item} variant={item === category ? "default" : "outline"} onClick={() => setCategory(item)}>
            {item}
          </Button>
        ))}
      </div>

      {visible.length ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((item) => (
            <button
              key={`${item.category}-${item.title}`}
              className="group overflow-hidden rounded-2xl border border-border bg-card text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              onClick={() => setActive(item)}
              type="button"
            >
              <div
                className="aspect-[4/3] bg-cover bg-center transition group-hover:scale-[1.03]"
                style={{ backgroundImage: `url(${item.url})` }}
              />
              <div className="p-4">
                <div className="font-semibold text-[var(--brand-navy)]">{item.title}</div>
                <div className="text-sm text-muted-foreground">{item.category} - {item.type}</div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-muted p-8 text-muted-foreground">
          Fresh gallery highlights will appear here as new work and experiences are published.
        </div>
      )}

      {active ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur">
          <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-background shadow-2xl">
            <button
              className="absolute right-4 top-4 z-10 rounded-full bg-background p-2"
              onClick={() => setActive(null)}
              type="button"
            >
              <XIcon />
            </button>
            <div className="aspect-video bg-cover bg-center" style={{ backgroundImage: `url(${active.url})` }} />
            <div className="p-5">
              <div className="text-xl font-semibold text-[var(--brand-navy)]">{active.title}</div>
              <div className="text-muted-foreground">{active.category}</div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
