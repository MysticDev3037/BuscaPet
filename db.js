const { Pool } = require('pg');

// Verifica se estamos rodando no Render (online) ou localmente
const pool = process.env.DATABASE_URL 
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false } // O Render exige SSL
    })
  : new Pool({
      user: 'postgres',
      host: 'localhost',
      database: 'buscapet_db',
      password: '33467065', // Sua senha local
      port: 5432,
    });

module.exports = pool;