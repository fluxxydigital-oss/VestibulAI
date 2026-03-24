const { Client } = require('pg');

const connectionString = "postgresql://postgres:Ghostttoxic811326@db.sqknhkzdwepvqqomuron.supabase.co:5432/postgres?schema=public&sslmode=require";

console.log("\n=== TESTE DE CONEXÃO SUPABASE (COM SSL FIX) ===\n");

const client = new Client({ 
  connectionString,
  // Bypass SSL certificate chain validation (temporary for debugging)
  rejectUnauthorized: false
});

client.connect()
  .then(() => {
    console.log("✅ CONECTADO COM SUCESSO!\n");
    return client.query('SELECT NOW() as server_time;');
  })
  .then(result => {
    console.log("✅ Query Executada:");
    console.log("   Hora do Servidor:", result.rows[0].server_time);
    return client.end();
  })
  .then(() => {
    console.log("\n✅ Desconectado com sucesso");
    console.log("\n🔧 SOLUÇÃO PARA PRODUÇÃO:");
    console.log("   Remover 'rejectUnauthorized: false' após verificar certificado");
    process.exit(0);
  })
  .catch(err => {
    console.error("\n❌ ERRO:", err.message);
    process.exit(1);
  });
