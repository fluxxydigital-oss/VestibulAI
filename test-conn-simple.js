const { Client } = require('pg');

const connectionString = "postgresql://postgres:Ghostttoxic811326@db.sqknhkzdwepvqqomuron.supabase.co:5432/postgres?schema=public&sslmode=require";

console.log("\n=== TESTE DE CONEXÃO SUPABASE ===\n");

// Parse connection string
const url = new URL(`postgresql://${connectionString.split('://')[1]}`);
const host = url.hostname;
const port = url.port || 5432;
const database = url.pathname.split('/')[1] || 'postgres';
const user = url.username;

console.log(`Host: ${host}`);
console.log(`Port: ${port}`);
console.log(`Database: ${database}`);
console.log(`User: ${user}`);
console.log();

const client = new Client({ 
  connectionString 
});

client.connect()
  .then(() => {
    console.log("✅ CONECTADO COM SUCESSO!\n");
    return client.query('SELECT NOW() as server_time, version() as db_version LIMIT 1;');
  })
  .then(result => {
    console.log("✅ Query Executada:");
    console.log("   Hora do Servidor:", result.rows[0].server_time);
    console.log("   Versão:", result.rows[0].db_version.split(',')[0]);
    return client.end();
  })
  .then(() => {
    console.log("\n✅ Desconectado com sucesso");
    process.exit(0);
  })
  .catch(err => {
    console.error("\n❌ ERRO DE CONEXÃO:");
    console.error("   Código:", err.code);
    console.error("   Mensagem:", err.message);
    console.error();
    
    if (err.code === 'ENOTFOUND') {
      console.error("   → DNS não conseguiu resolver o host");
    } else if (err.code === 'ECONNREFUSED') {
      console.error("   → Conexão recusada (servidor não está acessível)");
    } else if (err.code === 'ETIMEDOUT') {
      console.error("   → Timeout na conexão (firewall?)");
    }
    
    process.exit(1);
  });
