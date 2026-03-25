import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Free Image Background Remover — Remove BG Online Instantly',
  description: 'Remove image background in seconds with AI. Free, no signup required. Upload JPG/PNG and download transparent PNG instantly.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
