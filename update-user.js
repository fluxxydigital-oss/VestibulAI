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

async function updateUser() {
  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Update the user's password hash
    const result = await client.query(
      'UPDATE "User" SET passwordHash = $1 WHERE email = $2',
      ['$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewfLkI0qQcO8K3m', 'joana.silva@email.com']
    );

    console.log(`Updated ${result.rowCount} user(s)`);

    await client.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

updateUser();