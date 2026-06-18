"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { StarIcon } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type TestimonialItem = {
  id: string
  name: string
  company: string | null
  rating: number
  review: string
  photo?: string | null
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export function TestimonialsCarousel({ items }: { items: TestimonialItem[] }) {
  const [index, setIndex] = useState(0)
  const active = items[index]

  if (!items.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No testimonials published</CardTitle>
          <CardDescription>Testimonials will appear here once they are added.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="grid gap-6">
      <motion.div key={active.id} initial={{ opacity: 0.3, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }}>
        <Card className="overflow-hidden border-white/50 bg-white/78 shadow-2xl shadow-blue-950/10 backdrop-blur">
          <CardHeader className="gap-5 lg:grid lg:grid-cols-[auto_1fr] lg:items-start">
            <div className="flex items-start gap-4">
              <Avatar size="lg" className="size-16">
                {active.photo ? <AvatarImage src={active.photo} alt={active.name} /> : null}
                <AvatarFallback>{initials(active.name)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{active.name}</CardTitle>
                <CardDescription className="mt-1 text-sm text-muted-foreground">
                  {active.company ?? "Taakshvi Client"}
                </CardDescription>
                <div className="mt-3 flex gap-1 text-[var(--brand-pink)]">
                  {Array.from({ length: active.rating }).map((_, starIndex) => (
                    <StarIcon key={starIndex} className="size-4" fill="currentColor" />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-lg leading-8 text-foreground">{active.review}</p>
          </CardHeader>
        </Card>
      </motion.div>

      <div className="flex flex-wrap gap-2">
        {items.map((item, itemIndex) => (
          <Button
            key={item.id}
            variant={itemIndex === index ? "default" : "outline"}
            onClick={() => setIndex(itemIndex)}
            className={itemIndex === index ? "bg-[var(--brand-pink)] text-white" : ""}
          >
            {item.name}
          </Button>
        ))}
      </div>
    </div>
  )
}
