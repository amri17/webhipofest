'use client'
import Link from 'next/link'

export default function Sidebar() {
  return (
    <nav className="fixed left-0 top-0 z-10 h-screen w-60 bg-teal-500">
      <ul className="text-white px-4 py-6 space-y-4">
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/about">Data Pendaki</Link>
        </li>
        <li>
          <Link href="/about/peta">Peta</Link>
        </li>
      </ul>
    </nav>
  )
}
