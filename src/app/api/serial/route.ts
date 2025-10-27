
import { Pool } from "pg";
import SerialPort from "serialport";  // Gunakan default import
import { ReadlineParser } from "@serialport/parser-readline";

// Setup koneksi ke PostgreSQL
const pool = new Pool({
  user: "postgres",  // Username PostgreSQL
  host: "localhost", // Host tempat database berada
  database: "Hipovest", // Nama database
  password: "1234",  // Password untuk user PostgreSQL
  port: 5432,        // Port default PostgreSQL
});

// Setup Serial Port untuk membaca data dari ST-Link
const port = new SerialPort("COM3", {
baudRate: 9600,
});
const parser = port.pipe(new ReadlineParser({ delimiter: "\n" }));

// Fungsi untuk membaca data serial dan menyimpannya ke PostgreSQL
async function readAndSaveData() {
    parser.on("data", async (data) => {
    try {
// Data datang dalam format string, konversi ke array byte
const buffer = Buffer.from(data, "hex");
        
// Konversi data menggunakan struct.unpack (seperti di Python)
const suhu = buffer.readUInt16LE(0) / 10.0; // suhu (2 byte)
const level = buffer[2]; // level (1 byte)
const latitude = buffer.readFloatLE(3); // latitude (4 byte)
const longitude = buffer.readFloatLE(7); // longitude (4 byte)

// Masukkan data ke dalam database PostgreSQL
const result = await pool.query(
"INSERT INTO pendaki (suhu, level, latitude, longitude) VALUES ($1, $2, $3, $4) RETURNING *",
[suhu, level, latitude, longitude]
);
        
    console.log("Data berhasil disimpan:", result.rows[0]);
} catch (err) {
    console.error("Error menyimpan data:", err);
}
    });
}

// Panggil fungsi untuk membaca data serial
readAndSaveData();