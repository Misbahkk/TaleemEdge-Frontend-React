import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/components/auth-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Taleem Edge - Empowering Student Learning Journey",
  description:
    "A comprehensive learning management system by Rah e Ilahi, designed to provide centralized access to educational resources, mentorship programs, scholarships, and intelligent learning tools.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="w-full">
      <body className={`${inter.className} w-full max-w-full overflow-x-hidden`}>
        <AuthProvider>
          <div className="w-full max-w-full">{children}</div>
        </AuthProvider>
      </body>
    </html>
  )
}
