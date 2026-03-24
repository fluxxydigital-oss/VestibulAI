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

async function checkSchema() {
  try {
    await client.connect();
    console.log('✅ Connected to database');

    const result = await client.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'User'
      AND column_name ILIKE '%password%'
      ORDER BY column_name
    `);

    console.log('Password-related columns:');
    result.rows.forEach(row => console.log(` - ${row.column_name}: ${row.data_type}`));

    // Also check a sample row
    const userResult = await client.query('SELECT * FROM "User" WHERE email = $1 LIMIT 1', ['joana.silva@email.com']);
    if (userResult.rows.length > 0) {
      console.log('Sample user row keys:', Object.keys(userResult.rows[0]));
      console.log('Password field exists:', 'passwordHash' in userResult.rows[0]);
    }

    await client.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkSchema();