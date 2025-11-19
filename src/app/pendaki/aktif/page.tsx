'use client'

import Link from "next/link"
import Sidebar from "../../sidebar"; 
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaCircle, FaMapMarkerAlt, FaStop } from "react-icons/fa";
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

// ✅ KOMPONEN LAMPU STATUS YANG DIPERBAIKI
function LampuStatus({ status }: { status: string }) {
    let warna = "text-green-500"; // default: normal
    
    if (status === "ringan") {
        warna = "text-yellow-500";
    } else if (status === "sedang") {
        warna = "text-orange-500";
    } else if (status === "berat") {
        warna = "text-red-500";
    } else if (status === "selesai") {
        warna = "text-gray-400";
    }
    
    return <FaCircle size={20} className={warna} />;
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
        const res = await fetch(`/api/pendaki/aktif`);
        const data: ApiResponse = await res.json();
        console.log("🔍 DATA MENTAH DARI API:", data);
        
        if (data.success && data.data) {
        // Process koordinat_lokasi to extract latitude and longitude
// Process koordinat_lokasi to extract latitude and longitude
// Process koordinat_lokasi to extract latitude and longitude - GUNAKAN KEMBALI PARSING ASLI
const processedData = data.data.map((item, index) => {
    console.log(`🔍 Item ${index} - koordinat_lokasi:`, item.koordinat_lokasi);
    
    let latitude: number | undefined = undefined;
    let longitude: number | undefined = undefined;
    
// Dalam useEffect, ganti hanya bagian parsing:
if (item.koordinat_lokasi && item.koordinat_lokasi !== 'undefined') {
    try {
        // ✅ HAPUS KURUNG jika ada
        let cleanCoord = item.koordinat_lokasi.trim();
        
        // Hapus kurung buka dan tutup
        if (cleanCoord.startsWith('(') && cleanCoord.endsWith(')')) {
            cleanCoord = cleanCoord.slice(1, -1).trim(); // Hapus kurung pertama dan terakhir
        }
        
        console.log(`🔍 Setelah hapus kurung: '${cleanCoord}'`);
        
        const coords = cleanCoord.split(',');
        
        if (coords.length === 2) {
            const latStr = coords[0].trim();
            const lngStr = coords[1].trim();
            
            console.log(`🔍 Parsing: '${latStr}' , '${lngStr}'`);
            
            if (latStr !== 'undefined' && latStr !== '' && !isNaN(parseFloat(latStr))) {
                latitude = parseFloat(latStr);
            }
            if (lngStr !== 'undefined' && lngStr !== '' && !isNaN(parseFloat(lngStr))) {
                longitude = parseFloat(lngStr);
            }
        }
    } catch (error) {
        console.error("❌ Error parsing coordinates:", error);
    }
}
    
    const result = {
        ...item,
        latitude,
        longitude
    };
    
    console.log(`✅ Result ${index}: lat=${latitude}, lng=${longitude}`);
    return result;
});

        setPendakiList(processedData);
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    } finally {
        setLoading(false);
    }
    }
    fetchData();
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
    // ✅ FUNGSI UNTUK WARNA BACKGROUND BERDASARKAN STATUS
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'normal':
                return 'bg-green-100 border-green-300';
            case 'ringan':
                return 'bg-yellow-100 border-yellow-300';
            case 'sedang':
                return 'bg-orange-100 border-orange-300';
            case 'berat':
                return 'bg-red-100 border-red-300';
            case 'selesai':
                return 'bg-gray-100 border-gray-300';
            default:
                return 'bg-white border-gray-300';
        }
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
                <div 
                    key={item.id_pendakian} 
                    className={`border-2 rounded-lg px-4 py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-md ${getStatusColor(item.level_hipotermia)}`}
                >
                    <div className="flex-1">
                    <p className="text-lg font-semibold text-gray-800"> Nama Pendaki: {item.nama_pendaki}</p>
                    <p className="text-sm text-gray-600">ID Pendakian: {item.id_pendakian}</p>
                    <p className="text-sm font-medium">
                        Status: <span className={`font-bold ${
                            item.level_hipotermia === 'normal' ? 'text-green-600' :
                            item.level_hipotermia === 'ringan' ? 'text-yellow-600' :
                            item.level_hipotermia === 'sedang' ? 'text-orange-600' :
                            item.level_hipotermia === 'berat' ? 'text-red-600' :
                            'text-gray-600'
                        }`}>
                        {formatStatus(item.level_hipotermia)}
                        </span>
                    </p>
                    <p className="text-sm text-gray-600">Terakhir update: {new Date(item.perangko_waktu).toLocaleString('id-ID')}</p>
                    <p className="text-sm text-gray-600">Lokasi: {item.koordinat_lokasi}</p>
                    </div>
                    <div className="flex flex-col items-center">
                    <p className={`text-2xl font-bold ${
                        item.level_hipotermia === 'berat' ? 'text-red-600' :
                        item.level_hipotermia === 'sedang' ? 'text-orange-600' :
                        item.level_hipotermia === 'ringan' ? 'text-yellow-600' :
                        'text-green-600'
                    }`}>
                        {item.suhu_tubuh}°C
                    </p>
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
                    {/* ✅ LAMPU STATUS YANG SUDAH DIPERBAIKI */}
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