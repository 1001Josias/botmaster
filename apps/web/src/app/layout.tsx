'use client'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { Toaster } from '@/components/ui/toaster'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Header } from '@/components/Header'
import './globals.css'
import { Sidebar } from '@/components/sidebar'
import { useSidebarStore } from '@/lib/store/sidebar-store'

const inter = Inter({ subsets: ['latin'] })

// export const metadata: Metadata = {
//   title: 'Home | BotMaster',
//   keywords: 'botmaster, bot orchestration, platform, bots, ai agents',
//   description: 'A bot orchestration platform',
// }

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { collapsed } = useSidebarStore()
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
          <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div
              className="flex flex-col flex-1 overflow-hidden transition-all duration-75"
              style={{ marginLeft: collapsed ? '4rem' : '16rem' }}
            >
              <Header />
              <main className="flex-1 overflow-auto p-6">{children}</main>
            </div>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
