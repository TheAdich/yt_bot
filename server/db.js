import pg from 'pg'
const { Pool } = pg

//prod

const pool = new Pool({
    connectionString:process.env.DATABASE_URL,
    ssl:{rejectUnauthorized:false},
    max: 15,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
})

//dev
// const pool = new Pool({
//     user: 'postgres',
//     host: 'localhost',
//     database: 'youtube_bot_db',
//     password: 'aditya',
//     port: 5432,
//     max: 15,
//     idleTimeoutMillis: 30000,
//     connectionTimeoutMillis: 2000,
// })

pool.on('connect', () => {
    console.log('Connected to the database');
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

export default pool;
