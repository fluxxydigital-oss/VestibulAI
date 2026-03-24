// Execute SQL script on Supabase
import { Client } from 'pg';
import fs from 'fs';
import path from 'path';

const connectionString = "postgresql://postgres:Ghostttoxic811326@db.sqknhkzdwepvqqomuron.supabase.co:5432/postgres?schema=public";

console.log("\n=== EXECUTAR SCHEMA SQL NO SUPABASE ===\n");

// Read SQL file
const sqlPath = path.join(process.cwd(), 'SUPABASE_SCHEMA.sql');
const sql = fs.readFileSync(sqlPath, 'utf-8');

const client = new Client({ 
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

async function executeSql() {
  try {
    await client.connect();
    console.log("✅ Conectado ao Supabase\n");
    
    // Execute full script
    console.log("📝 Executando schema SQL...");
    await client.query(sql);
    console.log("✅ Schema criado com sucesso!\n");
    
    // Verify tables
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    console.log("✅ Tabelas criadas:");
    result.rows.forEach(row => {
      console.log(`   - ${row.table_name}`);
    });
    
    // Count test data
    const userCount = await client.query('SELECT COUNT(*) FROM "User"');
    const subjectCount = await client.query('SELECT COUNT(*) FROM "Subject"');
    const questionCount = await client.query('SELECT COUNT(*) FROM "Question"');
    
    console.log("\n✅ Dados inseridos:");
    console.log(`   - Usuários: ${userCount.rows[0].count}`);
    console.log(`   - Matérias: ${subjectCount.rows[0].count}`);
    console.log(`   - Questões: ${questionCount.rows[0].count}`);
    
    console.log("\n✅ Database pronta para testes!\n");
    
  } catch (err) {
    console.error("❌ Erro:", err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

executeSql();
