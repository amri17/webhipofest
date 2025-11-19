'use client';

import Sidebar from "../app/sidebar";
import { useEffect, useState } from "react";
import Image from 'next/image';
import { FaChevronDown } from 'react-icons/fa';
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { Sun, Droplet, Wind } from "lucide-react";


// Definisikan tipe data yang lebih spesifik
interface WeatherData {
  time: string;
  temp: number;
}

interface CurrentWeather {
  temp: number;
  humidity: number;
  wind: number;
  condition: string;
}

export default function HomePage() {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather| null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);


  useEffect(() => {
    // Contoh data dummy
    setWeatherData([
      { time: "08:00", temp: 26 },
      { time: "10:00", temp: 28 },
      { time: "12:00", temp: 30 },
      { time: "14:00", temp: 32 },
      { time: "16:00", temp: 29 },
    ]);

    setCurrentWeather({
      temp: 28,
      humidity: 65,
      wind: 12,
      condition: "Cerah",
    });
  }, []);

  return (
    <div className="relative flex h-screen items-center overflow-hidden bg-black w-screen">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      {/* Konten Utama*/}
      <div className={`fixed flex-col w-screen items-center max-w-full top-0 left-0 right-0 h-full bg-black z-0 transition-all duration-300 ${isSidebarOpen ? "md:ml-40" : "md:ml-10"} overflow-y-auto`}>
          {/* Header Notifikasi */}
          
      <section className="relative flex h-screen w-screen overflow-hidden">
        <Image
          src="/images/volcano-3779159_1280.jpg"   // gambar ada di folder public
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay gelap */}
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center text-white px-6">
        
        {/* Overlay gradasi hitam ke bawah */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black"></div>

        {/* Judul */}
        <h1 className="text-6xl md:text-7xl font-extrabold italic bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500 drop-shadow-lg z-10 relative">
          HIPOVEST
        </h1>
        <h2 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-md z-10 relative mt-4">
          Your Hiking Buddy with Warning System
        </h2>

        {/* Deskripsi */}
        <p className="mt-6 max-w-3xl text-center text-white leading-relaxed drop-shadow-lg">
        Hipovest adalah platform monitoring keselamatan pendaki gunung berbasis teknologi mutakhir. Kami menyediakan sistem pendataan terintegrasi, pelacakan lokasi secara real-time, dan sistem peringatan dini yang dirancang khusus untuk mendeteksi tanda-tanda hipotermia. Setiap data dianalisis untuk memastikan keselamatan setiap pendaki dan memungkinkan respons yang cepat jika terjadi keadaan darurat.
        </p>

        {/* Ikon vektor */}
        <div className="relative z-20 flex justify-center items-center gap-8 mt-20">
          <div className="flex flex-col items-center w-40">
            <div className="relative cursor-pointer">
            <motion.div
            whileTap={{ scale: 1.3 }} // membesar saat klik
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
            <Image
              src="/images/KT.png"
              alt="Ventor Icon"
              width={120}
              height={120}
              className="mx-auto object-contain h-24 w-24 transform scale-150"
              />
              </motion.div>
              </div>
            <p className="mt-2 text-sm  text-white font-bold text-center">Smart Jacket Integration</p>
          </div>
          <div className="flex flex-col items-center w-40">
            <div className="relative cursor-pointer">
            <motion.div
            whileTap={{ scale: 1.3 }} // membesar saat klik
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
            <Image
              src="/images/10157255.png"
              alt="Ventor Icon"
              width={120}
              height={120}
              className="mx-auto object-contain h-24 w-24"
              />
              </motion.div>
            <p className="mt-2 text-sm text-white font-bold text-center">GPS Tracking & Emergency Response</p>
            </div>
          </div>
          <div className="flex flex-col items-center w-40">
            <div className="relative cursor-pointer">
            <motion.div
            whileTap={{ scale: 1.3 }} // membesar saat klik
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
            <Image
              src="/images/pngtree-ring-bell-notification-icon-png-image_6113828.png"
              alt="Ventor Icon"
              width={120}
              height={120}
              className="mx-auto object-contain h-24 w-24"
              />
              </motion.div>
            <p className="mt-2 text-sm text-white font-bold text-center">AI-Powered Hypothermia Alerts</p>
            </div>
          </div>
          <div className="flex flex-col items-center w-40">
            <div className="relative cursor-pointer">
            <motion.div
            whileTap={{ scale: 1.3 }} // membesar saat klik
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
            <Image
              src="/images/Real-time.png"
              alt="Ventor Icon"
              width={120}
              height={120}
              className="mx-auto object-contain h-24 w-24 transform scale-150"
              />
              </motion.div>
            <p className="mt-2 text-sm text-white font-bold text-center">Real-Time Biometric Monitoring:</p>
            </div>
          </div>
        
        </div>
                  {/* Tombol panah ke bawah */}
            <a
            href="#cuaca"
            className="animate-bounce text-white text-4xl mt-12 z-10 relative"
            >
            <FaChevronDown />
            </a>
      </div>
      </section>

        {/* Cuaca Realtime */}
        <section
        id="cuaca"
        className={`bg-black mx-0 p-6 flex flex-col items-center justify-center text-center w-full min-w-full transition-all duration-300 ${
          isSidebarOpen ? "md:ml-40" : "md:ml-10"  
        }overflow-y`}
        >
        <div className="flex flex-col items-center bg-black overflow-y-auto w-full max-w-full">
          <h2 className="text-xl font-semibold text-white mb-4 text-center">🌤️ Cuaca Saat Ini</h2>
          {currentWeather && (
          <>
            <Sun className="w-40 h-16 items-center text-yellow-400 mb-4" />
            <p className="text-4xl text-white font-bold">{currentWeather.temp}°C</p>
            <p className="text-lg text-gray-300 mb-4">{currentWeather.condition}</p>
            <div className="grid grid-cols-2 gap-6 mt-4 text-white text-sm">
              <div className="flex items-center text-white gap-2">
                <Droplet className="w-5 h-5 text-blue-400" />
                <span>{currentWeather.humidity}%</span>
              </div>
              <div className="flex items-center text-white gap-2">
                <Wind className="w-5 h-5 text-green-400"/>
                <span>{currentWeather.wind} km/h</span>
              </div>
            </div>
            </>
            )}
            </div>
          </section>
        
        {/* Grafik Perkiraan */}
        <section className="bg-black w-screen overflow-x-hidden">
        <div className="bg-black items-center p-4 flex flex-col w-full max-w-screen">
          <h2 className="text-xl text-center font-semibold text-white mb-4"> Perkiraan Suhu</h2>
            <div className="w-full justify-center h-[250px]">
            <ResponsiveContainer width="90%" height={250}>
            <LineChart data={weatherData} 
            margin={{ top: 20, right: 50, left: 50, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="time" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip />
              <Line type="monotone" dataKey="temp" stroke="#4fd1c5" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
          </div>
          </div>
          </section>
        <div className="flex bg-black items-center justify-center w-full pb-8">
          {/* Tombol panah ke bawah */}
          <a
          href="#about-section"
          className="animate-bounce text-white items-center justify-center text-4xl mt-12"
          >
          <FaChevronDown />
        </a>
        </div>


        {/* Konten Tentang Kami */}
        <section id="about-section" className="w-full min-w-full mx-0 bg-black px-6 py-1 text-white">
          {/* Garis pemisah dengan teks kecil */}
        <div className="flex items-center justify-center my-6">
        <div className="flex-grow border-t-4 border-dotted border-teal-700"></div>
          <span className="px-4  text-teal-700 text-center uppercase text-4xl font-bold">Tentang Kami</span>
        <div className="flex-grow border-t-4 border-dotted border-teal-700"></div>
        </div>
        <div className="shadow-sm py-0">
          <div className="max-w-4xl mx-auto text-center px-1 py-0">
            <h1 className="text-4xl text-white font-bold mb-1">Visi & Misi</h1>
          </div>
        </div>

        {/* Visi & Misi */}
        <div className="relative mb-10 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white border-b-4 italic border-teal-600 inline-block">Visi</h2>
          <p className="text-lg leading-relaxed text-white bg-black/60 p-0 rounded-lg shadow-sm mt-2">
            Menjadi platform terpercaya dalam <span className="font-medium">pendataan pendaki gunung</span> 
            yang berkontribusi pada keamanan dan keberlanjutan ekosistem pendakian.
          </p>

          <h2 className="text-3xl font-bold text-white b-4 border-b-4 italic border-teal-600 inline-block mt-6">Misi</h2>
          <ul className="list-disc list-inside text-lg leading-relaxed text-white bg-black/60 p-5 rounded-lg shadow-sm t-4">
            <li>Menyediakan sistem pendataan pendaki yang cepat dan efisien.</li>
            <li>Mendukung keselamatan pendaki melalui informasi real-time.</li>
            <li>Berperan aktif dalam menjaga kelestarian alam gunung Indonesia.</li>
            <li>Membangun komunitas pendaki yang saling peduli dan berbagi.</li>
          </ul>
        </div>

        {/* Tim */}
        <div className="w-screen bg-gradient-to-b from-black to-teal-900 flex flex-col items-center justify-center text-white py-12">
          <h2 className="text-4xl font-semibold  text-teal-700 text-center mb-12">Tim Kami</h2>
            <div className="w-full flex flex-wrap justify-center gap-8">
              <div className="w-40 h-40 relative">
                <Image
                  src="/images/Macaca_nigra_self-portrait.jpg"
                  alt="Photo 1"
                  fill
                  className="rounded-full object-cover border-4 border-white shadow-lg"
                />
              </div>
              <div className="w-40 h-40 aspect-square relative">
                <Image
                  src="/images/mnyt.jpg"
                  alt="Photo 2"
                  fill
                  className="rounded-full object-cover border-4 border-white shadow-lg"
                />
              </div>
              <div className="w-40 h-40 aspect-square relative">
                <Image
                  src="/images/images.jpg"
                  alt="Photo 3"
                  fill
                  className="rounded-full object-cover border-4 border-white shadow-lg"
                />
              </div>
              <div className="w-40 h-40 aspect-square relative">
                <Image
                  src="/images/Macaca_nigra_self-portrait_large.jpg"
                  alt="Photo 4"
                  fill
                  className="rounded-full object-cover border-4 border-white shadow-lg"
                />
              </div>
              <div className="w-40 h-40  aspect-square relative">
                <Image
                  src="/images/images-1.jpg"
                  alt="Photo 5"
                  fill
                  className="rounded-full object-cover border-4 border-white shadow-lg"
                />
              </div>
            </div> 
          </div>
        </section>
      </div>
      </div>
    );
  }