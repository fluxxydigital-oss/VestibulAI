// Insert seed data into Supabase
import { Client } from 'pg';
import { randomUUID } from 'crypto';

const connectionString = "postgresql://postgres:Ghostttoxic811326@db.sqknhkzdwepvqqomuron.supabase.co:5432/postgres?schema=public";

console.log("\n=== SEED DATA - SUPABASE ===\n");

const client = new Client({ 
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

async function seedData() {
  try {
    await client.connect();
    console.log("✅ Conectado ao Supabase\n");
    
    // Clear existing data (optional)
    console.log("🗑️  Limpando dados antigos...");
    await client.query('DELETE FROM "Essay"');
    await client.query('DELETE FROM "StudyPlan"');
    await client.query('DELETE FROM "UserProgress"');
    await client.query('DELETE FROM "Question"');
    await client.query('DELETE FROM "Subject"');
    await client.query('DELETE FROM "User"');
    
    // =====================================================
    // Insert Subjects
    // =====================================================
    console.log("\n📚 Criando Matérias...");
    
    // Generate UUIDs for subjects
    const mathId = randomUUID();
    const portugueseId = randomUUID();
    const biologyId = randomUUID();
    const historyId = randomUUID();
    const physicsId = randomUUID();
    
    await client.query(`
      INSERT INTO "Subject" (id, name, description, weight)
      VALUES
        ($1, 'Matemática', 'Cálculo, Álgebra, Geometria', 1.2),
        ($2, 'Português', 'Literatura, Gramática, Interpretação', 1.0),
        ($3, 'Biologia', 'Célula, Genética, Ecologia', 1.1),
        ($4, 'História', 'Brasil e Mundo', 0.9),
        ($5, 'Física', 'Mecânica, Eletromagnetismo', 1.2);
    `, [mathId, portugueseId, biologyId, historyId, physicsId]);
    
    console.log(`✅ 5 matérias criadas`);
    
    // =====================================================
    // Insert Test User
    // =====================================================
    console.log("\n👤 Criando Usuários de Teste...");
    
    const user1Id = randomUUID();
    const user2Id = randomUUID();
    const user3Id = randomUUID();
    
    await client.query(`
      INSERT INTO "User" (id, name, email, "passwordHash", "targetCourse", "dailyStudyHours", "createdAt", "updatedAt")
      VALUES
        ($1, 'Teste User', 'teste@vestibulai.com', '$2a$12$SomethingLikeAHashedPassword123456789012345678901234', 'Medicina', 4.5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ($2, 'João Silva', 'joao@vestibulai.com', '$2a$12$SomethingLikeAHashedPassword123456789012345678901234', 'Engenharia', 3.0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ($3, 'Maria Santos', 'maria@vestibulai.com', '$2a$12$SomethingLikeAHashedPassword123456789012345678901234', 'Direito', 2.5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
    `, [user1Id, user2Id, user3Id]);
    
    const userId = user1Id;
    console.log(`✅ ${3} usuários criados`);
    console.log(`   Teste: teste@vestibulai.com`);
    
    // =====================================================
    // Insert Sample Questions
    // =====================================================
    console.log("\n❓ Criando Questões de Exemplo...");
    
    const q1 = randomUUID();
    const q2 = randomUUID();
    const q3 = randomUUID();
    const q4 = randomUUID();
    
    await client.query(`
      INSERT INTO "Question" (
        id, "subjectId", 
        statement, 
        options, 
        "correctOption", 
        difficulty, 
        source
      ) VALUES
        ($1, $5, 'Qual é o resultado de 2 + 2?', 
         '[{"id": "a", "text": "3"}, {"id": "b", "text": "4"}, {"id": "c", "text": "5"}, {"id": "d", "text": "6"}]'::jsonb, 
         'b', 1, 'AI Generated'),
        
        ($2, $5, 'Resolva a equação: x² - 5x + 6 = 0',
         '[{"id": "a", "text": "x = 1 ou x = 6"}, {"id": "b", "text": "x = 2 ou x = 3"}, {"id": "c", "text": "x = -2 ou x = -3"}, {"id": "d", "text": "x = 0 ou x = 5"}]'::jsonb,
         'b', 3, 'AI Generated'),
        
        ($3, $6, 'Qual é o sujeito da oração: "O gato subiu no telhado"?',
         '[{"id": "a", "text": "O telhado"}, {"id": "b", "text": "O gato"}, {"id": "c", "text": "Subiu"}, {"id": "d", "text": "Indeterminado"}]'::jsonb,
         'b', 1, 'AI Generated'),
        
        ($4, $7, 'Qual organela é responsável pela fotossíntese?',
         '[{"id": "a", "text": "Mitocôndria"}, {"id": "b", "text": "Peroxissomo"}, {"id": "c", "text": "Cloroplasto"}, {"id": "d", "text": "Lisossomo"}]'::jsonb,
         'c', 2, 'AI Generated')
    `, [q1, q2, q3, q4, mathId, portugueseId, biologyId]);
    
    console.log(`✅ ${4} questões criadas`);
    
    // =====================================================
    // Insert User Progress
    // =====================================================
    console.log("\n📊 Criando Progresso do Usuário...");
    
    const progress1 = randomUUID();
    const progress2 = randomUUID();
    const progress3 = randomUUID();
    
    await client.query(`
      INSERT INTO "UserProgress" (
        id, "userId", 
        "subjectId", 
        "questionsAnswered", 
        "correctAnswers", 
        "estimatedLevel"
      ) VALUES
        ($1, $4, $5, 10, 8, 3.5),
        ($2, $4, $6, 15, 12, 3.0),
        ($3, $4, $7, 5, 3, 2.0);
    `, [progress1, progress2, progress3, userId, mathId, portugueseId, biologyId]);
    
    console.log(`✅ ${3} registros de progresso criados`);
    
    // =====================================================
    // Verify Data
    // =====================================================
    console.log("\n✅ DADOS INSERIDOS COM SUCESSO:\n");
    
    const userCount = await client.query('SELECT COUNT(*) as count FROM "User"');
    const subjectCount = await client.query('SELECT COUNT(*) as count FROM "Subject"');
    const questionCount = await client.query('SELECT COUNT(*) as count FROM "Question"');
    const progressCount = await client.query('SELECT COUNT(*) as count FROM "UserProgress"');
    
    console.log(`📊 Estatísticas:`);
    console.log(`   Usuários: ${userCount.rows[0].count}`);
    console.log(`   Matérias: ${subjectCount.rows[0].count}`);
    console.log(`   Questões: ${questionCount.rows[0].count}`);
    console.log(`   Progresso: ${progressCount.rows[0].count}`);
    
    console.log(`\n✅ Database pronta para TESTES!\n`);
    console.log(`📝 Teste com credenciais:`);
    console.log(`   Email: teste@vestibulai.com`);
    console.log(`   Password: (use bcryptjs para testar)\n`);
    
  } catch (err) {
    console.error("❌ Erro:", err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

seedData();
