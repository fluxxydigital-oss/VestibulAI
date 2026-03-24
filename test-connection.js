const { Pool } = require('pg');

// Connection string from .env
const connectionString = 'postgresql://postgres:Ghostttoxic%40811326@db.dmxpajpjzkivhztrqskw.supabase.co:6543/postgres?schema=public&sslmode=require';

const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Connection Error:', err.message);
    process.exit(1);
  } else {
    console.log('✅ Connection Successful!');
    console.log('Database Time:', res.rows[0]);
    process.exit(0);
  }
});

pool.on('error', (err) => {
  console.error('❌ Pool Error:', err.message);
  process.exit(1);
});
