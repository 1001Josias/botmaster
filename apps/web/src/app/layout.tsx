import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { Toaster } from '@/components/ui/toaster'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Header } from '@/components/Header'
import './globals.css'
import { Sidebar } from '@/components/sidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Home | BotMaster',
  keywords: 'botmaster, bot orchestration, platform, bots, ai agents',
  description: 'A bot orchestration platform',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <Header></Header>
          <Sidebar />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
