import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "Hipovest", 
  password: "1234",
  port: 5432,
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
});

interface ErrorType {
  message: string;
}

interface PendakiRequestBody {
  nama_pendaki: string;
  jenis_kelamin: string;
  nomor_hp: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      const result = await pool.query(
        "SELECT * FROM data_pendaki WHERE id_pendaki = $1",
        [id]
      );
      if (result.rows.length === 0) {
        return NextResponse.json(
          { error: "Data tidak ditemukan" },
          { status: 404 }
        );
      }
      return NextResponse.json(result.rows[0]);
    } else {
      const result = await pool.query("SELECT * FROM data_pendaki");
      return NextResponse.json(result.rows);
    }
  } catch (err: unknown) {
    const error = err as ErrorType;
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body: PendakiRequestBody = await request.json();
    const { nama_pendaki, jenis_kelamin, nomor_hp } = body;

    if (!nama_pendaki || !jenis_kelamin || !nomor_hp) {
      return NextResponse.json(
        { error: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    if (!["L", "P"].includes(jenis_kelamin)) {
      return NextResponse.json(
        { error: "Jenis kelamin harus 'L' atau 'P'" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      "INSERT INTO data_pendaki (nama_pendaki, jenis_kelamin, nomor_hp) VALUES ($1, $2, $3) RETURNING *",
      [nama_pendaki, jenis_kelamin, nomor_hp]
    );

    return NextResponse.json(result.rows[0]);
  } catch (err: unknown) {
    const error = err as ErrorType;
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}