import { NextResponse } from "next/server";
import { Pool } from "pg";

// Setup koneksi ke PostgreSQL
const pool = new Pool({
  user: "postgres",  // Username PostgreSQL
  host: "DATABASE_URL", // Host tempat database berada
  database: "Hipovest", // Nama database
  password: "1234",  // Password untuk user PostgreSQL
  port: 5432,        // Port default PostgreSQL
});

// HANYA SATU FUNGSI GET - HAPUS YANG DUPLICATE!
export async function GET() {
  let client;
  
  try {
    console.log("Connecting to database...");
    client = await pool.connect();
    
    console.log("Executing query: SELECT * FROM data_pendaki");
    const result = await client.query(`
      SELECT 
        dp.*,
        CASE 
          WHEN EXISTS (
            SELECT 1 FROM status_pendakian sp 
            WHERE sp.id_pendaki = dp.id_pendaki 
            AND sp.sedang_mendaki = 'berjalan' 
            AND sp.waktu_selesai IS NULL
          ) THEN true 
          ELSE false 
        END as is_active
      FROM data_pendaki dp
      ORDER BY dp.id_pendaki DESC
    `);
    console.log(`Found ${result.rows.length} records`);
    
    // Log sample data untuk debugging
    if (result.rows.length > 0) {
      console.log("Sample data:", result.rows[0]);
    }

    // Kembalikan data ke frontend
    return NextResponse.json(result.rows);
    
  } catch (error) {
    console.error("Error:", error.message);
    return NextResponse.json(
      { error: "Database error: " + error.message },
      { status: 500 }
    );
  } finally {
    if (client) {
      client.release();
    }
  }
}

// POST - Tambah Data Pendaki (bukan sensor)
export async function POST(request) {

  try {
    const body = await request.json();
    const client = await pool.connect();
    
    const result = await client.query(
      "INSERT INTO data_pendaki (nama_pendaki, jenis_kelamin, nomor_hp) VALUES ($1, $2, $3) RETURNING *",
      [body.nama_pendaki, body.jenis_kelamin, body.nomor_hp]
    );
    
    client.release();
    console.log("New pendaki added:", result.rows[0]);
    
    return NextResponse.json(result.rows[0]);
    
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

