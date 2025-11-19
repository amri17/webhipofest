// src/app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'
import { Toaster } from "sonner";
import NotificationBell from "./components/notificationBell";

export const metadata: Metadata = {
  title: 'My App',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body>
        {/* Bell Notifikasi di semua halaman */}
        <div className="fixed top-4 right-4 z-50">
          <NotificationBell />
        </div>
        
        {/* Toaster Global */}
        <Toaster position="top-center" richColors />
        
        {children}
      </body>
    </html>
  )
}