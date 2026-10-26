const { Pool } = require('pg');

let pool;

if (process.env.DATABASE_URL) {
  // Se estiver no Render (ou tiver a variável), usa a URL do banco online
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
} else {
  // Se estiver no seu PC, usa o banco local
  pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'buscapet_db',
    password: '33467065',
    port: 5432,
  });
}

module.exports = pool;