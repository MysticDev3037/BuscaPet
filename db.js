const { Pool } = require('pg');

// Cria a conexão baseada na variável de ambiente (Render) ou local
const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    })
  : new Pool({
      user: 'postgres',
      host: 'localhost',
      database: 'buscapet_db',
      password: '33467065',
      port: 5432,
    });

module.exports = pool;