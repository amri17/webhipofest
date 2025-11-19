// components/NotificationBell.tsx - VERSI SIMPLE & FIX ERRORS
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from "framer-motion";
import { FaBell } from "react-icons/fa";
import { toast } from "sonner";

interface AlertData {
  id_pendakian: number;
  nama_pendaki: string;
  send_help: number;
  level_hipotermia: string;
  suhu_tubuh: number;
  perangko_waktu: string;
}

interface AlertResponse {
  success: boolean;
  alert: AlertData | null;
  hasAlert: boolean;
  isLocked: boolean;
}

export default function NotificationBell() {
  const [emergencyCount, setEmergencyCount] = useState(0);
  const [currentAlert, setCurrentAlert] = useState<AlertData | null>(null);
  const shownAlerts = useRef<string[]>([]);

  // ✅ HANDLE RESOLVE ALERT
  const handleResolve = async (alert: AlertData, alertType: string) => {
    try {
      await fetch('/api/alerts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          namaPendaki: alert.nama_pendaki,
          alertType: alertType
        })
      });
      
      setEmergencyCount(0);
      setCurrentAlert(null);
      const alertKey = `${alert.nama_pendaki}-${alert.send_help}-${alert.level_hipotermia}`;
      shownAlerts.current = shownAlerts.current.filter(key => key !== alertKey);
      
      toast.success(`${alert.nama_pendaki} ditandai selesai`, { duration: 3000 });
      
    } catch (error) {
      console.error('Error:', error);
      toast.error('Gagal menandai selesai');
    }
  };

  // ✅ SHOW NOTIFICATION
  const showNotification = useCallback((alert: AlertData) => {
    if (alert.send_help === 1) {
      // EMERGENCY HELP
      toast.custom((t) => (
        <div className="bg-white rounded-lg w-full max-w-md p-4 border-2 border-red-500 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="text-2xl">🚨</div>
            <h2 className="text-lg font-bold text-red-700">EMERGENCY ALERT</h2>
          </div>
          <div className="mb-4">
            <p className="text-gray-800 font-semibold">
              {alert.nama_pendaki} meminta bantuan darurat!
            </p>
            <p className="text-gray-600 text-sm mt-1">Suhu: {alert.suhu_tubuh}°C</p>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={async () => {
                await handleResolve(alert, 'emergency');
                toast.dismiss(t);
              }}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-medium"
            >
              Tandai Selesai
            </button>
            <button
              onClick={() => toast.dismiss(t)}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm font-medium"
            >
              Tutup
            </button>
          </div>
        </div>
      ), { duration: Infinity });
    } else {
      // HIPOTERMIA ALERT
      const levelConfig = {
        berat: { title: "🚑 HIPOTERMIA BERAT", color: "border-red-700", bgColor: "bg-red-100" },
        sedang: { title: "⚠️ HIPOTERMIA SEDANG", color: "border-orange-500", bgColor: "bg-orange-100" },
        ringan: { title: "🔔 HIPOTERMIA RINGAN", color: "border-yellow-500", bgColor: "bg-yellow-100" }
      };
      
      const config = levelConfig[alert.level_hipotermia as keyof typeof levelConfig] || levelConfig.ringan;
      
      toast.custom((t) => (
        <div className={`rounded-lg w-full max-w-md p-4 border-2 ${config.color} ${config.bgColor} shadow-lg`}>
          <div className="flex items-center gap-3 mb-3">
            <div className="text-2xl">{config.title.split(' ')[0]}</div>
            <h2 className="text-lg font-bold text-gray-800">{config.title}</h2>
          </div>
          <div className="mb-4">
            <p className="text-gray-800 font-semibold">
              {alert.nama_pendaki} mengalami hipotermia {alert.level_hipotermia.toUpperCase()}
            </p>
            <p className="text-gray-600 text-sm mt-1">Suhu: {alert.suhu_tubuh}°C</p>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={async () => {
                await handleResolve(alert, 'hipotermia');
                toast.dismiss(t);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
            >
              Tandai Selesai
            </button>
            <button
              onClick={() => toast.dismiss(t)}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm font-medium"
            >
              Tutup
            </button>
          </div>
        </div>
      ), { duration: 10000 });
    }
  }, []);

  // ✅ CHECK ALERTS
  const checkAlerts = useCallback(async () => {
    try {
      const response = await fetch('/api/alerts');
      if (!response.ok) return;
      
      const data: AlertResponse = await response.json();
      
      if (data.success && data.hasAlert && data.alert) {
        const alert = data.alert;
        const alertKey = `${alert.nama_pendaki}-${alert.send_help}-${alert.level_hipotermia}`;
        
        // Simpan alert saat ini
        setCurrentAlert(alert);
        
        // Cek alert baru
        if (!shownAlerts.current.includes(alertKey)) {
          shownAlerts.current.push(alertKey);
          showNotification(alert);
        }
        
        setEmergencyCount(1);
      } else {
        setEmergencyCount(0);
        setCurrentAlert(null);
      }
    } catch (error) {
      console.error('Error checking alerts:', error);
    }
  }, [showNotification]);

  // ✅ BELL CLICK HANDLER
  const handleBellClick = () => {
    if (currentAlert) {
      // Tampilkan notifikasi detail lagi
      showNotification(currentAlert);
    } else {
      toast.success("Tidak ada alert", {
        description: "Semua pendaki dalam kondisi normal",
        duration: 3000,
      });
    }
    checkAlerts(); // Refresh
  };

  // ✅ AUTO-CHECK
  useEffect(() => {
    checkAlerts();
    const interval = setInterval(checkAlerts, 10000);
    return () => clearInterval(interval);
  }, [checkAlerts]);

  return (
  <motion.div whileTap={{ scale: 1.3 }}>
    <div className="relative cursor-pointer" onClick={handleBellClick}>
      {/* 🔧 UBAH DI SINI: text-white → text-yellow-400 */}
      <FaBell size={28} className="text-yellow-400" />
      {emergencyCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">
          {emergencyCount}
        </span>
      )}
    </div>
  </motion.div>
);
}