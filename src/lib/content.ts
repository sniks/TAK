export function formatPublishDate(date: Date | null | undefined) {
  if (!date) return "Recently updated"

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date)
}

export function estimateReadTime(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length
  return `${Math.max(2, Math.ceil(words / 180))} min read`
}

export function toParagraphs(content: string) {
  return content
    .split("\n")
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
}

export function getNewsEmbed(url?: string | null) {
  if (!url) return null

  if (url.includes("youtu.be/")) {
    const id = url.split("youtu.be/")[1]?.split(/[?&]/)[0]
    return id ? `https://www.youtube.com/embed/${id}` : null
  }

  if (url.includes("youtube.com/watch")) {
    const match = url.match(/[?&]v=([^&]+)/)
    return match?.[1] ? `https://www.youtube.com/embed/${match[1]}` : null
  }

  return null
}
