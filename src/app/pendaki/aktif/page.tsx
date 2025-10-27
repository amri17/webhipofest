'use client'

import Link from "next/link"
import Sidebar from "../../sidebar"; 
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaBell, FaCircle, FaMapMarkerAlt, FaStop } from "react-icons/fa";
import { motion } from "framer-motion";

// Define TypeScript interfaces
interface Pendaki {
    id_status: number;
    id_pendakian: number;
    level_hipotermia: string;
    suhu_tubuh: number;
    koordinat_lokasi: string;
    perangko_waktu: string;
    nama_pendaki: string;
    latitude?: number;
    longitude?: number;
}

interface ApiResponse {
    success: boolean;
    data: Pendaki[];
    total: number;
}

interface StopResponse {
    success: boolean;
    message: string;
    data?: {
    id_pendakian: number;
    };
}

// Komponen lampu sesuai status
function LampuStatus({ status }: { status: string }) {
    let  warna = "text-green-500";
    if (status === "2") warna = "text-yellow-500";
    else if (status === "3") warna = "text-red-500";
    return <FaCircle size={20} className={warna}/>;
}

export default function DataPendakiAktif() {
    const [pendakiList, setPendakiList] = useState<Pendaki[]>([])
    const router = useRouter()
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const [loading, setLoading] = useState(false)

  // Ambil data awal dari API
    useEffect(() => {
    const fetchData = async () => {
        try {
        setLoading(true);
        const res = await fetch(`/api/pendaki/aktif`); // ✅ PERBAIKAN: endpoint yang benar
        const data: ApiResponse = await res.json();
        console.log("Data dari API:", data);
        
        if (data.success && data.data) {
          // Process koordinat_lokasi to extract latitude and longitude
            const processedData = data.data.map((item) => {
            const [latitude, longitude] = item.koordinat_lokasi.split(',').map((coord) => parseFloat(coord.trim()));
            return {
                ...item,
        // Tambahkan field untuk kompatibilitas dengan frontend lama
            latitude: isNaN(latitude) ? -7.455 : latitude,
            longitude: isNaN(longitude) ? 110.438 : longitude
            };
        });

        // Set data yang sudah diproses ke state
        setPendakiList(processedData);
        console.log("Data processed:", processedData);
        } else {
        console.error("API returned error:", data);
        setPendakiList([]);
        }
        } catch (error) {
        console.error("Error fetching data:", error);
        setPendakiList([]);
        } finally {
        setLoading(false);
        }
    }
    fetchData();

    // Auto-refresh data setiap 30 detik
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
    }, []);

    // Fungsi untuk menghentikan proses
    const handleStop = async (idPendakian: number) => {
    console.log("🟡 Menghentikan pendakian dengan ID:", idPendakian);
    
    if (!confirm(`Apakah Anda yakin ingin menghentikan monitoring untuk pendakian #${idPendakian}?`)) {
        return;
    }

    try {
        const requestBody = { 
        id_pendakian: idPendakian,
        action: 'stop' 
        };
        console.log("🟡 Request body:", requestBody);

      const response = await fetch('/api/pendaki/aktif', { // ✅ PERBAIKAN: endpoint yang benar
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        });

        const result: StopResponse = await response.json();
        console.log("🟡 Response dari API:", result);
        
        if (result.success) {
        // Hapus dari state
        setPendakiList(prev => prev.filter(item => item.id_pendakian !== idPendakian));
        alert('✅ Monitoring dihentikan');
        } else {
        alert(`❌ Gagal: ${result.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Gagal menghentikan monitoring');
    }
    };

  // Format status untuk tampilan yang lebih baik
    const formatStatus = (status: string) => {
    const statusMap: { [key: string]: string } = {
    'normal': 'Normal',
    'ringan': 'Hipotermia Ringan',
    'sedang': 'Hipotermia Sedang', 
    'berat': 'Hipotermia Berat',
    'selesai': 'Selesai'
    };
    return statusMap[status] || status;
    };

    if (loading) {
    return (
        <div className="absolute inset-0 flex h-screen bg-gray-100">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen}/>
        <div className={`flex flex-col flex-1 transition-all duration-300 p-6 overflow-y-auto ${
        isSidebarOpen ? "md:ml-64" : "md:ml-16"
        }`}>
        <div className="flex justify-center items-center h-64">
            <p className="text-gray-600">Memuat data...</p>
        </div>
        </div>
    </div>
    );
    }

    return (
    <div className="absolute inset-0 flex h-screen bg-gray-100">
      {/* Sidebar */}
        < Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen}/>

      {/* Konten Utama */}
        <div className={`flex flex-col flex-1 transition-all duration-300 p-6 overflow-y-auto ${
        isSidebarOpen ? "md:ml-64" : "md:ml-16"
        }`}>
        {/* Header notifikasi */}
        <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-2xl font-bold">Monitoring Pendaki Aktif</h1>
            <p className="text-gray-600">Total: {pendakiList.length} pendaki sedang dimonitor</p>
        </div>
        <motion.div
            whileTap={{ scale: 1.3 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
            <div className="relative cursor-pointer">
            <FaBell size={28} color="black" />
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                {pendakiList.length}
                </span>
            </div>
            </motion.div>
        </div>

        <div className="space-y-4">
            {pendakiList.length === 0 ? (
            <div className="text-center py-10">
                <p className="text-gray-600 mb-6">Tidak ada pendaki yang sedang dimonitor.</p>
                <button 
                onClick={() => router.push("/pendaki")} 
                className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700"
                >
                Lihat Data Pendaki
                </button>
            </div>
            ) : (
            <div className="space-y-4 pb-20">
                {pendakiList.map((item) => (
                <div key={item.id_pendakian} className="border border-gray-300 bg-white shadow-md rounded-lg px-4 py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex-1">
                    <p className="text-lg font-semibold text-gray-800">{item.nama_pendaki}</p>
                    <p className="text-sm text-gray-600">ID Pendakian: {item.id_pendakian}</p>
                    <p className="text-sm text-gray-600">Status: {formatStatus(item.level_hipotermia)}</p>
                    <p className="text-sm text-gray-600">Terakhir update: {new Date(item.perangko_waktu).toLocaleString('id-ID')}</p>
                    <p className="text-sm text-gray-600">Lokasi: {item.koordinat_lokasi}</p>
                    </div>
                    <div className="flex flex-col items-center">
                    <p className="text-2xl font-bold text-red-600">{item.suhu_tubuh}°C</p>
                    <span className="text-sm text-gray-500">Suhu Tubuh</span>
                    </div>
                    <div className="flex items-center gap-2">
                    <a
                        href={`https://www.google.com/maps?q=${item.latitude},${item.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-1"
                    >
                        <FaMapMarkerAlt /> GPS
                    </a>
                    <LampuStatus status={item.level_hipotermia} />
                    <button 
                    onClick={() => router.push(`monitoring/${item.id_pendakian}`)}  // ✅ Path yang benar
                    className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
                    >
                        Detail Monitoring
                    </button>
                    {/* Button Selesai */}
                    <motion.button
                    onClick={() => handleStop(item.id_pendakian)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                    >
                    <FaStop />
                    Selesai
                    </motion.button>
                    </div>
                </div>
                ))}
            </div>
            )}
        </div>

        <Link
            href="/pendaki/riwayat"
            className="fixed bottom-6 right-6 bg-teal-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-teal-700 flex items-center justify-center z-50"
        >
            Kembali ke Data Pendaki
        </Link>
        </div>
    </div>
    )
}