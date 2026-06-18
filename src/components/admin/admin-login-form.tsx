"use client"

import { useState } from "react"
import Image from "next/image"
import { LoaderCircleIcon, LockKeyholeIcon } from "lucide-react"
import { signIn } from "next-auth/react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function AdminLoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [pending, setPending] = useState(false)
  const [error, setError] = useState("")

  return (
    <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,rgba(239,63,134,0.08),rgba(4,99,153,0.04),rgba(79,181,84,0.08))] px-4 py-10">
      <Card className="w-full max-w-md bg-white/92 shadow-2xl shadow-blue-950/10 backdrop-blur">
        <CardHeader className="items-center text-center">
          <Image
            src="/brand/taakshvi-logo.jpeg"
            alt="Taakshvi logo"
            width={72}
            height={72}
            className="size-16 rounded-xl object-contain"
          />
          <CardTitle className="mt-2 text-2xl text-[var(--brand-navy)]">Admin Login</CardTitle>
          <CardDescription>Sign in to manage enquiries, content, settings, and service owners.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="grid gap-5"
            onSubmit={async (event) => {
              event.preventDefault()
              setPending(true)
              setError("")

              const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
                callbackUrl: "/admin",
              })

              setPending(false)

              if (result?.error) {
                setError("Invalid email or password.")
                return
              }

              window.location.href = "/admin"
            }}
          >
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="admin-email">Email</FieldLabel>
                <Input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  placeholder="admin@taakshvisolutionhub.com"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="admin-password">Password</FieldLabel>
                <Input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  required
                />
              </Field>
            </FieldGroup>

            {error ? <div className="text-sm text-[var(--brand-pink)]">{error}</div> : null}

            <Button type="submit" disabled={pending} className="bg-[var(--brand-pink)] text-white">
              {pending ? <LoaderCircleIcon className="animate-spin" data-icon="inline-start" /> : <LockKeyholeIcon data-icon="inline-start" />}
              {pending ? "Signing In" : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
