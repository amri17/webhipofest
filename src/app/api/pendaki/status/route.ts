import { NextResponse } from "next/server";
import { Pool } from "pg";

// Setup koneksi ke PostgreSQL
const pool = new Pool({
    user: "postgres",
    host: "localhost", 
    database: "Hipovest",
    password: "1234",
    port: 5432,
});

// GET - Untuk cek status aktif semua pendaki (BARU)
export async function GET() {
    let client;
    
    try {
        
        client = await pool.connect();

        console.log("Checking active pendakian...");

        // Ambil semua pendaki yang sedang aktif mendaki
        const result = await client.query(
            `SELECT id_pendaki FROM status_pendakian 
            WHERE sedang_mendaki = 'berjalan' 
            AND waktu_selesai IS NULL`
        );

        console.log(`Found ${result.rows.length} active pendakian`);

        // Format menjadi object { id_pendaki: true }
        const activeStatus: Record<number, boolean> = {};
        result.rows.forEach((row: { id_pendaki: number }) => {
            activeStatus[row.id_pendaki] = true;
            console.log(`Active: ID ${row.id_pendaki}`);
        });
        
        return NextResponse.json({
            success: true,
            active_processes: activeStatus
        });

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        console.error("Database error:", errorMessage);
        
        return NextResponse.json(
            { 
                success: false, 
                message: "Database error: " + errorMessage 
            },
            { status: 500 }
        );
    } finally {
        if (client) {
            client.release();
        }
    }
}

// POST - Untuk start/stop pendakian (KODE AWAL ANDA)
export async function POST(request: Request) {
    let client;
    
    try {
        const { id_pendaki, action } = await request.json();
        console.log(`Received ${action} for id_pendaki: ${id_pendaki}`);

        if (!id_pendaki) {
            return NextResponse.json(
                { success: false, message: "ID pendaki diperlukan" },
                { status: 400 }
            );
        }

        client = await pool.connect();

        if (action === 'start') {

// 1. Hitung total pendakian untuk pendaki ini - ✅ TANPA SPLIT_PART
const countResult = await client.query(
        `SELECT COUNT(*) as total_global FROM status_pendakian`,
        []
    );

    const totalGlobal = parseInt(countResult.rows[0]?.total_global || '0');
    const urutanGlobal = totalGlobal + 1;
        
    
// ✅ GENERATE id_pendakian dengan format urutan global saja
const id_pendakian = urutanGlobal;
const result = await client.query(
    `INSERT INTO status_pendakian 
    (id_pendakian, id_pendaki, sedang_mendaki, waktu_mulai, waktu_selesai) 
    VALUES ($1, $2, $3, NOW(), NULL) 
     RETURNING *`,
    [id_pendakian, id_pendaki, 'berjalan']
);
    // 3. 🎯 TAMBAHKAN INSERT KE status_hipotermia - INI YANG HILANG
            await client.query(
                `INSERT INTO status_hipotermia 
                (id_pendakian, level_hipotermia, suhu_tubuh, koordinat_lokasi) 
                VALUES ($1, $2, $3, $4)`,
                [id_pendakian, 'normal', 36.5, '-6.200000,106.816666']
            );
    // 3. 🎯 TAMBAHKAN INSERT KE status_hipotermia - INI YANG HILANG
            await client.query(
                `INSERT INTO status_hipotermia 
                (id_pendakian, level_hipotermia, suhu_tubuh, koordinat_lokasi) 
                VALUES ($1, $2, $3, $4)`,
                [id_pendakian, 'normal', 36.5, '-6.200000,106.816666']
            );

    const idPendakianDisplay = `${id_pendaki} ${urutanGlobal}`;

    console.log(`Start process result: ${idPendakianDisplay} (DB ID: ${id_pendakian})`, result.rows[0]);
                return NextResponse.json({
        success: true,
        message: `Pendakian ${idPendakianDisplay} dimulai`,
        data: result.rows[0]
    });


        } else if (action === 'stop') {
            // STOP: Update status menjadi selesai
            const result = await client.query(
                `UPDATE status_pendakian 
                SET sedang_mendaki = $1, waktu_selesai = NOW() 
                WHERE id_pendaki = $2 AND sedang_mendaki = $3 
                 RETURNING *`,
                ['selesai', id_pendaki, 'berjalan']
            );

            console.log("Stop process result:", result.rows[0]);

            if (result.rows.length === 0) {
                return NextResponse.json({
                    success: false,
                    message: `Tidak ada pendakian aktif untuk ID: ${id_pendaki}`
                }, { status: 404 });
            }

            return NextResponse.json({
                success: true,
                message: `Pendakian diselesaikan untuk ID: ${id_pendaki}`,
                data: result.rows[0]
            });

        } else {
            return NextResponse.json({
                success: false,
                message: 'Action tidak valid. Gunakan "start" atau "stop"'
            }, { status: 400 });
        }

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        console.error("Database error:", errorMessage);
        return NextResponse.json(
            { 
                success: false, 
                message: "Database error: " + errorMessage 
            },
            { status: 500 }
        );
    } finally {
        if (client) {
            client.release();
        }
    }
}