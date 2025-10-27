// app/api/pendaki/aktif/route.js
import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
    user: "postgres",
    host: "localhost", 
    database: "Hipovest",
    password: "1234",
    port: 5432,
});

export async function GET() {
    let client;
    
    try {
        client = await pool.connect();
        
        // Query dengan JOIN untuk hanya mengambil pendaki yang SEDANG BERJALAN
        const result = await client.query(`
            SELECT DISTINCT ON (sh.id_pendakian)
                sh.id_status,
                sh.id_pendakian,
                sh.level_hipotermia,
                sh.suhu_tubuh,
                sh.koordinat_lokasi,
                sh.perangko_waktu,
                sp.waktu_mulai
                
            FROM status_hipotermia sh
            INNER JOIN status_pendakian sp ON sh.id_pendakian = sp.id_pendakian
            WHERE sp.sedang_mendaki = $1
            ORDER BY sh.id_pendakian, sh.perangko_waktu DESC
        `, ['berjalan']); // ✅ Hanya yang statusnya 'berjalan'


        console.log(`✅ Data pendaki aktif berhasil diambil: ${result.rows.length} records`);

        return NextResponse.json({
            success: true,
            data: result.rows,
            total: result.rows.length
        });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        console.error("❌ Database error:", errorMessage);
        
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

export async function POST(request) {
    let client;
    
    try {
        const { id_pendakian, action } = await request.json();
        console.log(`🟢 Received ${action} for id_pendakian: ${id_pendakian}`);

        if (!id_pendakian) {
            return NextResponse.json(
                { success: false, message: "ID pendakian diperlukan" },
                { status: 400 }
            );
        }

        client = await pool.connect();
        await client.query('BEGIN');

        if (action === 'stop') {
            // STOP: Update status menjadi selesai di status_pendakian
            const pendakianResult = await client.query(
                `UPDATE status_pendakian 
                SET sedang_mendaki = $1, waktu_selesai = NOW() 
                WHERE id_pendakian = $2 AND sedang_mendaki = $3 
                RETURNING id_pendakian`,
                ['selesai', id_pendakian, 'berjalan'] // ✅ Ubah dari 'berjalan' ke 'selesai'
            );

            if (pendakianResult.rows.length === 0) {
                await client.query('ROLLBACK');
                return NextResponse.json({
                    success: false,
                    message: `Tidak ada pendakian aktif untuk ID pendakian: ${id_pendakian}`
                }, { status: 404 });
            }

            // UPDATE STATUS_HIPOTERMIA - set status menjadi selesai
            await client.query(
                `UPDATE status_hipotermia 
                SET level_hipotermia = $1, perangko_waktu = NOW()
                WHERE id_pendakian = $2`,
                ['selesai', id_pendakian]
            );

            await client.query('COMMIT');

            console.log(`✅ Pendakian dihentikan untuk id_pendakian: ${id_pendakian}`);

            return NextResponse.json({
                success: true,
                message: `Pendakian diselesaikan`,
                data: {
                    id_pendakian: id_pendakian,
                }
            });
        } else {
            await client.query('ROLLBACK');
            return NextResponse.json({
                success: false,
                message: 'Action tidak valid. Gunakan "stop"'
            }, { status: 400 });
        }

    } catch (error) {
        if (client) {
            await client.query('ROLLBACK');
        }
        
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        console.error("❌ Database error:", errorMessage);
        
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