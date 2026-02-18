import React from "react"
import type { Metadata, Viewport } from "next"
import { Orbitron } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './global.css'

const orbitron = Orbitron({ subsets: ["latin"], variable: '--font-orbitron' });

/** iPhone 12 (390×844) に最適化 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
}

export const metadata: Metadata = {
  title: 'CYBER_STUDENT // ポートフォリオ',
  description: 'サイバーパンク風学生ポートフォリオ - RPGスタイルのステータスと実績',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body className={`${orbitron.variable} font-sans antialiased min-h-screen bg-background text-foreground`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
