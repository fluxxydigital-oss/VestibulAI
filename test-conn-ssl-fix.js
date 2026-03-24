const { Client } = require('pg');

console.log("\n=== TESTE DE CONEXÃO SUPABASE (MÉTODO 2: SSL OBJECT) ===\n");

// Usar objetos de configuração em vez de connection string com SSL
const client = new Client({ 
  host: 'db.sqknhkzdwepvqqomuron.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'Ghostttoxic811326',
  ssl: {
    rejectUnauthorized: false  // Bypass SSL verification
  }
});

client.connect()
  .then(() => {
    console.log("✅ CONECTADO COM SUCESSO!\n");
    return client.query('SELECT NOW() as server_time, version() as db_version;');
  })
  .then(result => {
    console.log("✅ Query Executada:");
    console.log("   Hora do Servidor:", result.rows[0].server_time);
    console.log("   Versão DB:", result.rows[0].db_version.split(',')[0]);
    return client.end();
  })
  .then(() => {
    console.log("\n✅ Desconectado com sucesso");
    console.log("\n💾 PRÓXIMA FASE - Inicializar Base de Dados");
    process.exit(0);
  })
  .catch(err => {
    console.error("\n❌ ERRO:", err.code || err.message);
    if (err.code === 'SELF_SIGNED_CERT_IN_CHAIN') {
      console.error("   Problema: Certificado SSL");
    }
    process.exit(1);
  });
