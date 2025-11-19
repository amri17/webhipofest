'use client'

import Link from "next/link"
import { FaBars, FaHome, FaUsers, FaUserPlus } from "react-icons/fa"
import { GiHiking } from "react-icons/gi"

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  return (
    <>
      {/* Sidebar */}
      <nav className={`fixed left-0 top-0 z-10 h-full bg-teal-600 transition-all duration-300 ${isOpen ? "w-56" : "w-16"}`}>
        {/* Tombol buka/tutup */}
        <div className="flex justify-end p-2">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="bg-teal-700 w-8 h-8 rounded flex items-center justify-center text-white hover:bg-teal-800"
          >
            <FaBars />
          </button>
        </div>
        
        {/* Konten sidebar */}
        <ul className="text-white px-2 py-2  space-y-0">
          {isOpen && (
            <li className="text-center italic font-bold text-2xl">HIPOVEST</li>
          )}
          
          <li className="flex items-center hover:bg-teal-700 p-3 rounded transition-colors">
            <Link href="/" className="flex items-center w-full">
            <FaHome className="mr-2" />
            <span className={`transition-all duration-300 ${isOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}>
              Home
            </span>
            </Link>
          </li>
          
          <li className="flex items-center hover:bg-teal-700 p-2 rounded transition-colors">
            <Link href="/pendaftaran" className="flex items-center w-full">
            <FaUserPlus className="mr-2" />
            <span className={`transition-all duration-300 ${isOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}>
              Pendaftaran Pendaki
            </span>
            </Link>
          </li>
          
          <li className="flex items-center hover:bg-teal-700 p-2 rounded transition-colors">
            <Link href="/pendaki/riwayat" className="flex items-center w-full">
            <FaUsers className="mr-2" />
            <span className={`transition-all duration-300 ${isOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}>
              Data pendaki
            </span>
            </Link>
          </li>

                    <li className="flex items-center hover:bg-teal-700 p-2 rounded transition-colors">
            <Link href="/pendaki/aktif" className="flex items-center w-full">
            <GiHiking className="mr-2" />
            <span className={`transition-all duration-300 ${isOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}>
              Pendakian Aktif
            </span>
            </Link>
          </li>
          
          
        </ul>
      </nav>
            {/* Overlay untuk mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}