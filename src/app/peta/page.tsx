'use client'

import Sidebar from "../sidebar";
import { useState } from "react";
import { FaBell } from "react-icons/fa";
import { motion } from "framer-motion";
import Map from '../components/maps/Map';


export default function PetaPage() {
const [notifCount] = useState(3); // contoh jumlah notifikasi
const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
    // Data palsu untuk tampilan awal
  return (
    <main className="container mx-auto p-4 px-4 flex flex-col w-full">
      {/* Sidebar */}
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
 {/* Konten Utama */}
            <div
                className={`transition-all absolute inset-0 duration-300 w-full p-6 px-4 py-3 ml-0 full-screen overflow-y-auto ${
                    isSidebarOpen ? "md:ml-60" : "md:ml-16"
                }`} 
            >
      <header className="absolute top-2 right-2 z-50 bg-transparent text-white px-4 py-4">
              <motion.div
        whileTap={{ scale: 1.3 }} // membesar saat klik
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
      <div className="relative cursor-pointer">
        <FaBell size={28} color="black" />
        
        {/* Badge notifikasi */}
        {notifCount > 0 && (
          <span className="absolute -top-1 right-0 bg-red-600 text-black text-xs px-1.5 py-0.5 rounded-full">
            {notifCount}
          </span>
        )}
      </div>
      </motion.div>
      </header>
      <h1 className="text-3xl font-bold mb-6">Peta Interaktif</h1>
      <div className="rounded-lg overflow-hidden shadow-lg border h-full w-full">
        <Map 
          center={[-6.2088, 106.8456]} 
          height="600px" 
        />
      </div>
      </div>
    </main>
  );
}