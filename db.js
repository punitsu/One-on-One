import pg from 'pg';
const {Pool} = pg;

let localPoolConfig = {
    user: "postgres",
    password: "postgrespw",
    host: "127.0.0.1",
    port: 32768,
    database: "1on1"
}

const poolConfig = process.env.DATABASE_URL ? 
    {connectionString:process.env.DATABASE_URL, 
    ssl:{ rejectUnauthrized: false}
}: localPoolConfig;

const pool = new Pool(poolConfig);
export default pool;
