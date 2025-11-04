import type { Metadata } from 'next'
import '../styles/index.css'

export const metadata: Metadata = {
  title: 'Phusic',
  description: 'Phusic Game',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
