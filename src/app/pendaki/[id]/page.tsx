'use client'

import Sidebar from "../../sidebar";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { FaBell } from "react-icons/fa";
import { motion } from "framer-motion";
import Link from "next/link";



export default function DataPendakiDetailPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id;

const [pendakiData, setPendakiData] = useState<{
    id_pendaki?: number;
    nama_pendaki?: string;
    jenis_kelamin?: string;
    nomor_hp?: string;
} | null>(null);
    const [notifCount] = useState(3);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect (() => {
    const fetchData = async () => {
        try {
                const res = await fetch(`/api/pendaki/${id}`);
                console.log("Fetch response status:", res.status);
                
                if (!res.ok) {
                    throw new Error(`HTTP ${res.status}`);
                }
                const data = await res.json();
                console.log("Data received:", data);
                setPendakiData(data);
            
            } catch (error) {
                console.log("Error:", error);
                setPendakiData(null);
            }
        }; 
            if (id) {
                console.log("Fetching data for ID:", id);
        fetchData();
        }
    },
    [id]);

    const handleEditPendaki = () => {
        router.push(`/pendaki/edit/${id}`);
    };
        console.log("Current state - pendakiData:", pendakiData);
    console.log("Current state - id:", id);

    if (!pendakiData) {
        return (
            <div className="flex w-full min-h-screen absolute bg-gray-100">
                <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen}/>
                <div className={`flex-1 p-6 transition-all duration-300 ${
                    isSidebarOpen ? "md:ml-64" : "md:ml-16"
                }`}>
                </div>
            </div>
        );
    }

    return (
        <div className=" absolute inset-0 flex h-screen bg-gray-100">
            {/* Sidebar */}
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen}/>

            {/* Konten Utama */}
            <div className={`flex flex-col flex-1 transition-all duration-300 p-6 overflow-y-auto ${
                isSidebarOpen ? "md:ml-64" : "md:ml-16"
            }`}>
                {/* Header notifikasi */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold">Detail Data Pendaki</h1>
                        <p className="text-gray-600">Informasi lengkap data pendaki</p>
                        <p className="text-gray-600">ID: {id}</p>
                    </div>
                    <motion.div
                        whileTap={{ scale: 1.3 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                        <div className="relative cursor-pointer">
                            <FaBell size={28} color="black" />
                            
                            {/* Badge notifikasi */}
                            {notifCount > 0 && 
                                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                                    {notifCount}
                                </span>
                            }
                        </div>
                    </motion.div>
                </div>
                
                {/* Menampilkan data pendaki */}
                <div className="space-y-6">
                    <div className="border border-gray-300 bg-teal-600/60 rounded-lg p-4 shadow-sm">
                        <p className="block text-sm font-medium mb-2">Nama:</p>
                        <p className="text-lg">{pendakiData.nama_pendaki}</p>
                    </div>

                    <div className="border border-gray-300 bg-teal-600/60 px-4 py-3 rounded-lg p-4 shadow-sm">
                        <p className="block text-sm font-medium mb-2">Jenis Kelamin:</p>
                        <p className="text-lg">{pendakiData.jenis_kelamin}</p>
                    </div>

                    <div className="border border-gray-300 bg-teal-600/60 rounded-lg p-4 shadow-sm">
                        <p className="block text-sm font-medium mb-2">Nomor Handphone:</p>
                        <p className="text-lg">{pendakiData.nomor_hp}</p>
                    </div>
                </div>

                <div className="flex justify-between mt-6">
                    <Link
                        href="/pendaki/riwayat"
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                        Kembali
                    </Link>

                    <button
                        type="button"
                        onClick={handleEditPendaki}
                        className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
                    >
                        Edit Data Pendaki
                    </button>
                </div>
            </div>
        </div>
    );
}