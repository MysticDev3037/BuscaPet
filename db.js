require('dotenv').config(); // Carrega as variáveis do .env

const { Pool } = require('pg');

const pool = process.env.DATABASE_URL 
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    })
  : new Pool({
      user: 'postgres',
      host: 'localhost',
      database: 'buscapet_db',
      password: process.env.DB_PASSWORD, // <-- Agora lê do .env
      port: 5432,
    });

module.exports = pool;