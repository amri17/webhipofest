'use client'

import Sidebar from "../sidebar";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TambahPendakiPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [successMessage, setSuccessMessage] = useState(""); // Menyimpan pesan sukses setelah simpan
    const [showSuccess, setShowSuccess] = useState(false); // State untuk menampilkan pesan sukses

    // Form data state
    const [formData, setFormData] = useState({
        nama_pendaki: "",
        jenis_kelamin: "",
        nomor_hp: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        console.log(name, value); // Debugging
        setFormData((prev) => ({ ...prev, [name]: value }));
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setSuccessMessage(""); // Reset pesan sebelumnya

        try {
            const res = await fetch("/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                const data = await res.json();
                // Reset form setelah data berhasil disimpan
                setFormData({
                    nama_pendaki: "",
                    jenis_kelamin: "",
                    nomor_hp: "",
                });
                // Tampilkan pesan sukses
                setSuccessMessage("Data berhasil tersimpan!");
                setShowSuccess(true); // Menampilkan pesan sukses

                // Menutup pesan sukses dan redirect setelah 1,5 detik
                setTimeout(() => {
                    setShowSuccess(false); // Menyembunyikan pesan sukses setelah 1,5 detik
                    router.push(`/pendaki/${data.id}`);
                }, 1500); // 1.5 detik delay sebelum redirect
            } else {
                console.error("Gagal menyimpan data");
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex w-full min-h-screen absolute inset-0 ml-0 p-6 md:px-2 full-screen">
            {/* Sidebar */}
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            {/* Konten Utama */}
            <div
                className={`flex flex-col transition-all duration-300 w-full p-6 px-4 py-3 overflow-y-auto ${
                    isSidebarOpen ? "md:ml-60" : "md:ml-16"
                }`}
            >
                <h1 className="text-2xl font-bold mb-6">Tambah Pendaki</h1>

                {/* Pesan sukses */}
                {showSuccess && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="p-8 bg-green-500 text-white text-xl font-bold rounded-lg shadow-lg">
                            {successMessage}
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6 w-full">
                    {/* Card Nama */}
                    <div className="border border-gray-300 bg-teal-600/60 rounded-lg p-4 shadow-sm">
                        <label className="block text-sm font-medium mb-2">Nama</label>
                        <input
                            type="text"
                            name="nama_pendaki"
                            value={formData.nama_pendaki}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                            maxLength={100}
                            required
                        />
                    </div>

                    {/* Card Jenis Kelamin */}
                    <div className="border border-gray-300 bg-teal-600/60 px-4 py-3 rounded-lg p-4 shadow-sm">
                        <label className="block text-sm font-medium mb-2">Jenis Kelamin</label>
                        <select
                            name="jenis_kelamin"
                            value={formData.jenis_kelamin}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                            required
                        >
                            <option value="">Pilih Jenis Kelamin</option>
                            <option value="L">L</option>
                            <option value="P">P</option>
                        </select>
                    </div>

                    {/* Card Nomor Handphone */}
                    <div className="border border-gray-300 bg-teal-600/60 rounded-lg p-4 shadow-sm">
                        <label className="block text-sm font-medium mb-2">Nomor Handphone</label>
                        <input
                            type="text"
                            name="nomor_hp"
                            value={formData.nomor_hp}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                            maxLength={15}  // Membatasi panjang nomor HP sesuai dengan VARCHAR(15)
                            pattern="[0-9]{10,15}"  // Validasi agar hanya angka dan panjang antara 10-15 digit
                            required
                        />
                    </div>

                    {/* Tombol Kembali dan Simpan */}
                    <div className="flex justify-between mt-6">
                        <button
                            type="button"
                            onClick={() => router.push("/pendaki/data")}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                            disabled={isLoading}
                        >
                            Kembali
                        </button>

                        <button
                            type="submit"
                            className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 disabled:bg-teal-400"
                            disabled={isLoading}
                        >
                            {isLoading ? "Menyimpan..." : "Simpan Data Pendaki"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
