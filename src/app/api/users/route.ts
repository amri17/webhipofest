import { NextResponse } from "next/server";
import { Pool } from "pg";

// Koneksi ke database PostgreSQL
const pool = new Pool({
  user: "postgres",       // Username PostgreSQL
  host: "localhost",      // Host tempat database berada
  database: "Hipovest",   // Nama database
  password: "1234",       // Password untuk user postgres
  port: 5432,             // Port default PostgreSQL
  connectionTimeoutMillis: 5000,  // Menetapkan batas waktu koneksi (dalam milidetik)
  idleTimeoutMillis: 30000, 
});

// Define error type
interface ErrorType {
  message: string;
}

// Define request body type for POST and PUT
interface PendakiRequestBody {
  nama_pendaki: string;
  jenis_kelamin: string;
  nomor_hp: string;
}


// Fungsi GET untuk mengambil data pendaki berdasarkan ID atau mengambil semua pendaki
export async function GET(req: Request, { params }: { params: { id?: string } }) {
  try {
    // Cek apakah ID ada di dalam params
    if (params.id) {
      // Ambil data berdasarkan ID
      const result = await pool.query("SELECT * FROM data_pendaki WHERE id_pendaki = $1", [params.id]);
      if (result.rows.length === 0) {
        return NextResponse.json({ error: "Data tidak ditemukan" }, { status: 404 });
      }
      return NextResponse.json(result.rows[0]);
    } else {
      // Jika tidak ada ID, ambil semua data pendaki
      const result = await pool.query("SELECT * FROM data_pendaki");
      if (result.rows.length === 0) {
        return NextResponse.json([]);  // Tidak ada data, kembalikan array kosong
      }
      return NextResponse.json(result.rows);  // Kembalikan data dari database
    }
  } catch (err: unknown) {
    const error = err as ErrorType;
    console.error("GET error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Fungsi POST untuk menambah data pendaki baru
export async function POST(req: Request) {
  try {
    const { nama_pendaki, jenis_kelamin, nomor_hp }: PendakiRequestBody = await req.json();

    // Menambahkan log tambahan untuk memeriksa data yang diterima
    console.log("Data yang diterima:", { nama_pendaki, jenis_kelamin, nomor_hp });
    
    // Validasi data yang diterima
    if (!nama_pendaki || !jenis_kelamin || !nomor_hp) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    // Memastikan jenis_kelamin hanya boleh 'L' atau 'P'
    if (!['L', 'P'].includes(jenis_kelamin)) {
      return NextResponse.json({ error: "Jenis kelamin harus 'L' atau 'P'" }, { status: 400 });
    }

    // Menambahkan log untuk memastikan query berjalan dengan benar
    console.log("Menyisipkan data ke tabel data_pendaki...");
    
    const result = await pool.query(
      "INSERT INTO data_pendaki (nama_pendaki, jenis_kelamin, nomor_hp) VALUES ($1, $2, $3) RETURNING *",
      [nama_pendaki, jenis_kelamin, nomor_hp]
    );

    console.log("Data berhasil disimpan:", result.rows[0]);
    return NextResponse.json(result.rows[0]); // Kembalikan data yang baru dimasukkan
  } catch (err: unknown) {
    const error = err as ErrorType; // Type assertion for error
    console.error("POST error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Fungsi PUT untuk memperbarui data pendaki berdasarkan ID
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { nama_pendaki, jenis_kelamin, nomor_hp }: PendakiRequestBody = await req.json();

    // Validasi data yang diterima
    if (!nama_pendaki || !jenis_kelamin || !nomor_hp) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    // Memastikan jenis_kelamin hanya boleh 'L' atau 'P'
    if (!['L', 'P'].includes(jenis_kelamin)) {
      return NextResponse.json({ error: "Jenis kelamin harus 'L' atau 'P'" }, { status: 400 });
    }

    // Menambahkan log untuk memeriksa apakah data yang diterima sudah benar
    console.log("Data yang diterima untuk update:", { nama_pendaki, jenis_kelamin, nomor_hp });

    // Update data berdasarkan ID
    const result = await pool.query(
      "UPDATE data_pendaki SET nama_pendaki = $1, jenis_kelamin = $2, nomor_hp = $3 WHERE id_pendaki = $4 RETURNING *",
      [nama_pendaki, jenis_kelamin, nomor_hp, params.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Data tidak ditemukan untuk diupdate" }, { status: 404 });
    }

    console.log("Data berhasil diperbarui:", result.rows[0]);
    return NextResponse.json(result.rows[0]); // Mengembalikan data yang diperbarui
  } catch (err: unknown) {
    const error = err as ErrorType; // Type assertion for error
    console.error("PUT error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
