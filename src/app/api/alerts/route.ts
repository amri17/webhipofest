import { NextResponse } from 'next/server';
import { Pool } from "pg";

const pool = new Pool({
    user: "postgres",
    host: "localhost", 
    database: "Hipovest",
    password: "1234",
    port: 5432,
});

// GET: Ambil notifikasi dengan prioritas, tapi emergency terkunci
export async function GET() {
    let client;
    
    try {
        client = await pool.connect();

        console.log("Checking for highest priority alert...");

        // Ambil alert dengan prioritas tertinggi
        const result = await client.query(
            `SELECT 
                id_pendakian, 
                nama_pendaki,
                send_help,
                level_hipotermia,
                suhu_tubuh,
                perangko_waktu
             FROM status_hipotermia 
             WHERE send_help = 1 
                OR level_hipotermia IN ('ringan', 'sedang', 'berat')
             ORDER BY 
                 CASE 
                     WHEN send_help = 1 THEN 1        -- Priority 1: Emergency (TERKUNCI)
                     WHEN level_hipotermia = 'berat' THEN 2  -- Priority 2: Berat
                     WHEN level_hipotermia = 'sedang' THEN 3 -- Priority 3: Sedang
                     WHEN level_hipotermia = 'ringan' THEN 4 -- Priority 4: Ringan
                 END
             LIMIT 1`
        );

        const currentAlert = result.rows[0] || null;
        
        // ✅ CEK APAKAH PERLU UPDATE NOTIFIKASI YANG SEDANG AKTIF
        if (currentAlert) {
            // Jika ada emergency, langsung return (TERKUNCI)
            if (currentAlert.send_help === 1) {
                console.log(`🚨 EMERGENCY LOCKED: ${currentAlert.nama_pendaki}`);
                return NextResponse.json({
                    success: true,
                    alert: currentAlert,
                    hasAlert: true,
                    isLocked: true  // ✅ TANDAI TERKUNCI
                });
            }
            
            // Untuk hipotermia, bisa auto-update
            console.log(`🔄 HYPOTHERMIA ALERT: ${currentAlert.nama_pendaki} - ${currentAlert.level_hipotermia}`);
            return NextResponse.json({
                success: true,
                alert: currentAlert,
                hasAlert: true,
                isLocked: false  // ✅ BISA AUTO-UPDATE
            });
        }

        console.log("No active alerts");
        return NextResponse.json({
            success: true,
            alert: null,
            hasAlert: false,
            isLocked: false
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

// PUT: Update status ketika notifikasi ditutup
export async function PUT(request: Request) {
    let client;
    
    try {
        const { namaPendaki, alertType } = await request.json();
        
        if (!namaPendaki) {
            return NextResponse.json(
                { success: false, message: "namaPendaki is required" },
                { status: 400 }
            );
        }

        client = await pool.connect();

        console.log(`Resetting alert for: ${namaPendaki}, type: ${alertType}`);

        // ✅ PERBAIKAN: Hapus deklarasi result yang tidak perlu
        if (alertType === 'emergency') {
            // Reset emergency help
            await client.query(
                `UPDATE status_hipotermia 
                SET send_help = 0
                WHERE nama_pendaki = $1 AND send_help = 1`,
                [namaPendaki]
            );
        } else {
            // Reset hipotermia level
            await client.query(
                `UPDATE status_hipotermia 
                SET level_hipotermia = 'normal'
                WHERE nama_pendaki = $1 AND level_hipotermia IN ('ringan', 'sedang', 'berat')`,
                [namaPendaki]
            );
        }

        console.log(`Reset alert for ${namaPendaki}`);

        return NextResponse.json({
            success: true,
            message: `Alert for ${namaPendaki} has been resolved`
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