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
    <html lang="en" className="h-full overflow-hidden">
      <body className="m-0 h-full w-full overflow-hidden bg-[#0a0a0a] p-0 font-['Inter',system-ui,-apple-system,sans-serif] text-[#e5e5e5]">
        {children}
      </body>
    </html>
  )
}
