// Simples teste de conexão Supabase
const connectionString = "postgresql://postgres:Ghostttoxic811326@db.sqknhkzdwepvqqomuron.supabase.co:5432/postgres?schema=public&sslmode=require";

console.log("=== Test Connection String ===");
console.log("Host:", connectionString.match(/@([^:/]+)/)?.[1]);
console.log("Port:", connectionString.match(/:(\d+)/)?.[1]);
console.log("Database:", connectionString.match(/\/([^?]+)/)?.[1]);
console.log("\n=== Tentando conexão ===");

// Dinamicamente import pg para evitar error se não estiver instalado
import('pg')
  .then(({ Client }) => {
    const client = new Client({ connectionString });
    client.connect()
      .then(() => {
        console.log("✅ CONECTADO COM SUCESSO!");
        return client.query('SELECT NOW()');
      })
      .then(res => {
        console.log("✅ Query executada:", res.rows[0]);
        return client.end();
      })
      .catch(err => {
        console.error("❌ Erro na query ou conexão:", err.message);
        process.exit(1);
      });
  })
  .catch(() => {
    console.log("⚠️ Módulo 'pg' não instalado. Use: npm install pg");
    process.exit(1);
  });
