import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Crimora - AI Crime Prediction System',
  description: 'AI-powered crime intelligence platform for crime hotspot visualization, crime prediction, safe navigation, and emergency safety alerts.',
  generator: 'v0.app',
  icons: {
    icon: '/crimora-logo.png',
    apple: '/crimora-logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
