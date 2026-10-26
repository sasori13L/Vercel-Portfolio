import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Workspace Access — Tenant Isolation Demo',
  description: 'A multi-tenant workspace demo protected by Supabase Row Level Security.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
