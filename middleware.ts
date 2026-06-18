import { NextResponse } from "next/server"

import { auth } from "@/auth"

export default auth((req) => {
  const { pathname } = req.nextUrl

  if (pathname.startsWith("/admin") && pathname !== "/admin/login" && !req.auth) {
    return NextResponse.redirect(new URL("/admin/login", req.nextUrl))
  }

  if (pathname === "/admin/login" && req.auth) {
    return NextResponse.redirect(new URL("/admin", req.nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/admin/:path*"],
}
