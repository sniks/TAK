import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { siteConfig } from "@/lib/site";
import { CallbackProvider } from "@/components/marketing/callback-provider";
import { prisma } from "@/lib/db";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | Events, Travel, Branding, Wellness & More`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [{ url: "/brand/taakshvi-logo.jpeg", width: 1200, height: 1200 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: ["/brand/taakshvi-logo.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const routingRules = await prisma.leadRoutingRule.findMany({
    where: { isActive: true },
    include: { service: true },
    orderBy: { priority: "asc" },
  })

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <CallbackProvider
          routingRules={routingRules.map((rule) => ({
            serviceSlug: rule.service?.slug ?? null,
            city: rule.city,
            mobile: rule.assignedMobile,
            whatsapp: rule.assignedWhatsapp,
            email: rule.assignedEmail,
            ownerName: rule.ownerName,
            priority: rule.priority,
          }))}
        >
          {children}
        </CallbackProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
