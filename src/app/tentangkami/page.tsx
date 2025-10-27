'use client'
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="relative w-full min-h-screen">
      {/* Background Image */}
      <Image
        src="/images/istockphoto-181928587-612x612.jpg"   // gambar ada di folder public
        alt="Background"
        fill
        className="object-cover -z-10" // biar background tetap di belakang
        priority
      />

      {/* Hero Section */}
      <div className="relative flex flex-col items-center justify-center text-white bg-black/40 min-h-screen">
        <h1 className="text-4xl font-bold text-center">
          Nikmati Pendakian Aman dengan HIPOFEST
        </h1>
        <p className="mt-2 text-lg text-center max-w-2xl">
          Ini adalah halaman Home Page dengan background image
        </p>
        <p className="mt-6 max-w-3xl text-center leading-relaxed">
          Selamat datang di <span className="font-semibold">HIPOFEST</span>! 
          Kami adalah platform yang dibuat untuk mendukung kegiatan pendakian gunung di Indonesia, 
          khususnya dalam hal <span className="font-medium">pendataan pendaki, keselamatan, dan pelestarian alam</span>. 
          Dengan sistem ini, kami berharap dapat memberikan pengalaman pendakian yang lebih aman, nyaman, dan terorganisir.
        </p>
      </div>

      {/* Konten Scrollable */}
      <main className="relative container mx-auto px-6 py-12 text-gray-800 bg-white/90">
        <h1 className="text-4xl font-bold mb-6 text-teal-700">Tentang Kami</h1>

        <p className="mb-6 leading-relaxed">
          Selamat datang di <span className="font-semibold">HIPOFEST</span>! 
          Kami adalah platform yang dibuat untuk mendukung kegiatan pendakian gunung di Indonesia, 
          khususnya dalam hal <span className="font-medium">pendataan pendaki, keselamatan, dan pelestarian alam</span>. 
          Dengan sistem ini, kami berharap dapat memberikan pengalaman pendakian yang lebih aman, nyaman, dan terorganisir.
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3">Visi</h2>
          <p className="mb-6">
            Menjadi platform terpercaya dalam <span className="font-medium">pendataan pendaki gunung</span> 
            yang berkontribusi pada keamanan dan keberlanjutan ekosistem pendakian.
          </p>

          <h2 className="text-2xl font-semibold mb-3">Misi</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Menyediakan sistem pendataan pendaki yang cepat dan efisien.</li>
            <li>Mendukung keselamatan pendaki melalui informasi real-time.</li>
            <li>Berperan aktif dalam menjaga kelestarian alam gunung Indonesia.</li>
            <li>Membangun komunitas pendaki yang saling peduli dan berbagi.</li>
          </ul>
        </section>

        <section className="mb-20">
          <h2 className="text-2xl font-semibold mb-3">Tim Kami</h2>
          <p>
            Tim HIPOFEST terdiri dari para pecinta alam, pengembang teknologi, dan relawan 
            yang memiliki tujuan sama: <span className="font-medium">mendukung pendakian yang aman dan berkelanjutan</span>.
          </p>
        </section>

        <footer className="mt-20 text-center text-gray-500">
          © 2025 HIPOFEST. Semua Hak Dilindungi.
        </footer>
      </main>
    </div>
  );
}
       