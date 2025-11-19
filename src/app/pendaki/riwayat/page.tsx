'use client'

import { useState, useEffect} from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../sidebar"; 
import { FaPlay, FaStop } from "react-icons/fa";
import { motion } from "framer-motion";
import Link from "next/link"

export default function DataPendaki() {
    const [pendakiList, setPendakiList] = useState([]);
    const router = useRouter();
    const [activeProcesses, setActiveProcesses] = useState<{[key: number]: boolean}>({});
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

        // Ambil data dari API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/pendaki");
                const data = await res.json();
                setPendakiList(data);

                // Set activeProcesses berdasarkan data dari backend
                const activeStatus: {[key: number]: boolean} = {};
                data.forEach(item => {
                    activeStatus[item.id_pendaki] = item.is_active || false;
                });
                setActiveProcesses(activeStatus);
                
                console.log("Active processes loaded:", activeStatus);
            } catch (error) {
                console.log("Error:", error);
                setPendakiList([
                    { 
                        id_pendaki: 1,
                        nama_pendaki: "Contoh Data", 
                        jenis_kelamin: "Laki-laki", 
                        nomor_hp: "08123456789",
                        is_active: false
                    }
                ]);
            }
        }
        fetchData();
    }, []);

    // Fungsi untuk memulai proses
    const handleStart = async (idPendaki) => {
        try {
            const response = await fetch('/api/pendaki/status', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    id_pendaki: idPendaki,
                    action: 'start' 
                }),
            });

            const result = await response.json();
            
            if (result.success) {
                setActiveProcesses(prev => ({ ...prev, [idPendaki]: true }));
                alert(`✅ Proses dimulai untuk ${result.data?.nama_pendaki || 'pendaki'}`);
            } else {
                alert(`❌ Gagal memulai proses: ${result.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('❌ Gagal memulai proses');
        }
    };

    // Fungsi untuk menghentikan proses
    const handleStop = async (idPendaki) => {
        try {
            const response = await fetch('/api/pendaki/status', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    id_pendaki: idPendaki,
                    action: 'stop' 
                }),
            });

            const result = await response.json();
            
            if (result.success) {
                setActiveProcesses(prev => ({ ...prev, [idPendaki]: false }));
                alert(`Proses dihentikan untuk ${result.data?.nama_pendaki || 'pendaki'}`);
            } else {
                alert(`Gagal menghentikan proses: ${result.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Gagal menghentikan proses');
        }
    };

    return (
        <div className="absolute inset-0 flex h-screen bg-gray-100">
            {/* Sidebar */}
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen}/>

            {/* Konten Utama */}
            <div className={`flex flex-col flex-1 transition-all duration-300 p-6 overflow-y-auto ${
                isSidebarOpen ? "md:ml-64" : "md:ml-16"
            }`}>

                {/* Daftar Pendaki */}
                <div className="space-y-4">
                    {pendakiList.map(item => (
                        <div key={item.id_pendaki} className="bg-white p-4 rounded-lg shadow border">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-lg">{item.nama_pendaki}</p>
                                    <p className="text-gray-600">Jenis Kelamin: {item.jenis_kelamin}</p>
                                    <p className="text-gray-600">Nomor HP: {item.nomor_hp}</p>
                                    <p className="text-xs text-gray-400">ID: {item.id_pendaki}</p> {/* Tampilkan ID */}
                                </div>

                                {/* Container untuk button Mulai/Selesai dan Lihat Detail */}
                                <div className="flex items-center gap-3">
                                    {/* Button Mulai/Selesai */}
                                    {activeProcesses[item.id_pendaki] ? (
                                        <motion.button
                                            onClick={() => handleStop(item.id_pendaki)}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                                        >
                                            <FaStop />
                                            Selesai
                                        </motion.button>
                                    ) : (
                                        <motion.button
                                            onClick={() => handleStart(item.id_pendaki)}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                                        >
                                            <FaPlay />
                                            Mulai
                                        </motion.button>
                                    )}
                                <button 
                                    onClick={() => {
                                        console.log("Tombol diklik!"); // ✅ DEBUG
                                        console.log("Item data:", item); // ✅ DEBUG  
                                        console.log("URL:", `/pendaki/${item.id_pendaki}`); // ✅ DEBUG
                                        router.push(`/pendaki/${item.id_pendaki}`);
                                    }}
                                    className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
                                >
                                    Lihat Detail
                                </button>
                            </div>
                        </div>
                                                    {/* Status Indicator */}
                            {activeProcesses[item.id_pendaki] && (
                                <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded">
                                    <p className="text-green-700 text-sm flex items-center gap-2">
                                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                        Proses sedang berjalan...
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Tombol tambah */}
                <Link
                    href="/pendaftaran"
                    className="fixed bottom-6 right-6 bg-teal-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-teal-700 flex items-center justify-center z-50"
                >
                    + Tambah Anggota
                </Link>
            </div>
        </div>
    );
}