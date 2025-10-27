// app/api/pendaki/[id]/route.js - BUAT FILE INI
import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
    user: "postgres",
    host: "localhost", 
    database: "Hipovest",
    password: "1234",
    port: 5432,
});

export async function GET(request, { params }) {
    const { id } = params;
    let client;
    try {
    console.log(`🎯 [BACKEND 2] Fetching data for ID: ${id}`);
    client = await pool.connect();
    
    const result = await client.query(
      "SELECT * FROM data_pendaki WHERE id_pendaki = $1",
    [id]
    );
    
    if (result.rows.length === 0) {
    return NextResponse.json(
        { error: "Data tidak ditemukan" },
        { status: 404 }
        );
    }
    
    console.log("✅ [BACKEND 2] Data found:", result.rows[0]);
    return NextResponse.json(result.rows[0]);
    
    } catch (error) {
    console.error("❌ [BACKEND 2] Error:", error);
    return NextResponse.json(
    { error: error.message },
    { status: 500 }
    );
    } finally {
    if (client) client.release();
    }
}