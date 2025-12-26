import pg from 'pg'
const { Pool } = pg

const pool = new Pool({
    
    max: 15,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
})

pool.on('connect', () => {
    console.log('Connected to the database');
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

export default pool;
