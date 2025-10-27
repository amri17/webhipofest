"use client";

import { useState } from "react";
import { FaBell } from "react-icons/fa";
import { motion } from "framer-motion";
import Link from "next/link"; // ✅ Import Link

export default function Navbar() {
const [notifCount] = useState(3);

return (
    <nav className="fixed top-0 left-0 w-full bg-teal-600 text-white shadow-md z-50">
    <div className="container mx-auto flex justify-between items-center px-6 py-3">
        {/* Logo */}
        <h1 className="text-xl font-bold">WebHipofest</h1>

        {/* Menu + Notifikasi */}
        <div className="flex items-center gap-6">
          {/* ✅ Ganti <a> dengan <Link> */}
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/peta">Peta</Link>

          {/* Notifikasi */}
        <motion.div
            whileTap={{ scale: 1.3 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="relative cursor-pointer"
        >
            <FaBell size={24} color="white" />
            {notifCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                {notifCount}
            </span>
            )}
        </motion.div>
        </div>
    </div>
    </nav>
);
}
