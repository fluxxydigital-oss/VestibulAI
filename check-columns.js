import { Client } from 'pg';

const client = new Client({
  host: 'db.sqknhkzdwepvqqomuron.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'Ghostttoxic811326',
  ssl: {
    rejectUnauthorized: false
  }
});

async function checkColumns() {
  try {
    await client.connect();
    console.log('✅ Connected to database');

    const result = await client.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'User'
      ORDER BY column_name
    `);

    console.log('Columns in User table:');
    result.rows.forEach(row => console.log(' -', row.column_name));

    await client.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkColumns();