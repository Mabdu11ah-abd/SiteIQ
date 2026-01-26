import { ClerkProvider } from '@clerk/nextjs';
import "./globals.css"
import { Inter } from "next/font/google"
import { ReactNode } from "react"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { QueryProvider } from "@/components/providers/query-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: 'SiteIQ - AI-Powered SEO Analysis & Recommendations',
  description: "Boost SEO with SiteIQ's AI-driven tools and insights",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en"  className="">
        <body className={inter.className}>
          <QueryProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              {children}
            </TooltipProvider>
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}