import { NextResponse } from "next/server"

export function GET() {
  return NextResponse.json({
    ok: true,
    service: "taakshvi-platform",
    timestamp: new Date().toISOString(),
  })
}
