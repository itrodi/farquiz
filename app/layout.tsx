import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Header } from "@/components/header"
import { MobileNav } from "@/components/mobile-nav"
import { AuthProvider } from "@/contexts/auth-context" // Make sure this import is here
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })
// At the top of your layout file, add this for debugging:
if (typeof window !== 'undefined') {
  console.log("---- BrainCast Debug Info ----");
  console.log("App Version: 1.0.0");
  console.log("URL:", window.location.href);
  console.log("User Agent:", navigator.userAgent);
  console.log("------------------------------");
}


export const metadata: Metadata = {
  title: "BrainCast - The Ultimate Quiz Experience",
  description: "Test your knowledge and compete with friends on the premier quiz platform",
  openGraph: {
    title: "BrainCast - The Ultimate Quiz Experience",
    description: "Test your knowledge and compete with friends on the premier quiz platform",
    images: [`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/og-image.png`],
  },
  other: {
    "fc:frame": JSON.stringify({
      version: "next",
      imageUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/og-image.png`,
      button: {
        title: "Start Quizzing",
        action: {
          type: "launch_frame",
          name: "BrainCast",
          url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}`,
          splashImageUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/logo.png`,
          splashBackgroundColor: "#1e293b"
        }
      }
    })
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className={`${inter.className} bg-slate-900 text-white`}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <AuthProvider>
            <Header />
            <main className="pb-16 md:pb-0">{children}</main>
            <MobileNav />
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}