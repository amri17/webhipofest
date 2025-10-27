// C:\Users\ASUS\webhipofest\src\app\lib\server\db.ts
import { Pool } from 'pg';

const pool = new Pool({
  user: "postgres",       // Username PostgreSQL
  host: "localhost",      // Host tempat database berada
  database: "Hipovest",   // Nama database
  password: "1234",       // Password untuk user postgres
  port: 5432,             // Port default PostgreSQL
});

export default pool;
