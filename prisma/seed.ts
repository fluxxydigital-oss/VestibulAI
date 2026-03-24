import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { hashPassword } from "../src/lib/auth-utils.ts";

// Create a PostgreSQL connection pool with SSL bypass for Supabase
const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ 
  connectionString,
  ssl: {
    rejectUnauthorized: false  // Required for Supabase self-signed certs
  }
});
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...");

  // =====================================================
  // Clear existing data (optional)
  // =====================================================
  // await prisma.$executeRawUnsafe("TRUNCATE TABLE \"Question\" CASCADE");
  // await prisma.$executeRawUnsafe("TRUNCATE TABLE \"Subject\" CASCADE");
  // await prisma.$executeRawUnsafe("TRUNCATE TABLE \"User\" CASCADE");

  // =====================================================
  // Create Subjects
  // =====================================================
  console.log("📚 Criando matérias...");

  const subjects = await Promise.all([
    prisma.subject.upsert({
      where: { name: "Matemática" },
      update: {},
      create: {
        name: "Matemática",
        description: "Sua preparação em Matemática para o ENEM",
        weight: 1.2,
      },
    }),
    prisma.subject.upsert({
      where: { name: "Português" },
      update: {},
      create: {
        name: "Português",
        description: "Sua preparação em Português para o ENEM",
        weight: 1.1,
      },
    }),
    prisma.subject.upsert({
      where: { name: "Biologia" },
      update: {},
      create: {
        name: "Biologia",
        description: "Sua preparação em Biologia para o ENEM",
        weight: 1.0,
      },
    }),
    prisma.subject.upsert({
      where: { name: "História" },
      update: {},
      create: {
        name: "História",
        description: "Sua preparação em História para o ENEM",
        weight: 0.9,
      },
    }),
    prisma.subject.upsert({
      where: { name: "Física" },
      update: {},
      create: {
        name: "Física",
        description: "Sua preparação em Física para o ENEM",
        weight: 1.1,
      },
    }),
  ]);

  console.log(`✅ ${subjects.length} matérias criadas`);

  // =====================================================
  // Create Sample Questions
  // =====================================================
  console.log("❓ Criando questões de exemplo...");

  const mathSubject = subjects[0]; // Matemática

  const questions = await Promise.all([
    prisma.question.create({
      data: {
        subjectId: mathSubject.id,
        statement:
          "Qual é o resultado de 2 + 2?",
        options: JSON.stringify([
          { id: "a", text: "3" },
          { id: "b", text: "4" },
          { id: "c", text: "5" },
          { id: "d", text: "6" },
        ]),
        correctOption: "b",
        difficulty: 1,
        source: "AI Generated",
      },
    }),
    prisma.question.create({
      data: {
        subjectId: mathSubject.id,
        statement:
          "Resolva a equação: x² - 5x + 6 = 0",
        options: JSON.stringify([
          { id: "a", text: "x = 1 ou x = 6" },
          { id: "b", text: "x = 2 ou x = 3" },
          { id: "c", text: "x = 0 ou x = 5" },
          { id: "d", text: "x = -2 ou x = -3" },
        ]),
        correctOption: "b",
        difficulty: 2,
        source: "ENEM 2023",
      },
    }),
    prisma.question.create({
      data: {
        subjectId: mathSubject.id,
        statement:
          "Qual é a derivada de f(x) = 3x² + 2x + 1?",
        options: JSON.stringify([
          { id: "a", text: "f'(x) = 6x + 2" },
          { id: "b", text: "f'(x) = 3x + 2" },
          { id: "c", text: "f'(x) = 6x" },
          { id: "d", text: "f'(x) = x + 2" },
        ]),
        correctOption: "a",
        difficulty: 4,
        source: "AI Generated",
      },
    }),
  ]);

  console.log(`✅ ${questions.length} questões criadas`);

  // =====================================================
  // Create Test User
  // =====================================================
  console.log("👤 Criando usuário de teste...");

  const testUserPassword = await hashPassword("TestPassword123!");

  const testUser = await prisma.user.upsert({
    where: { email: "teste@vestibulai.com" },
    update: {
      passwordHash: testUserPassword,
    },
    create: {
      name: "Usuário Teste",
      email: "teste@vestibulai.com",
      passwordHash: testUserPassword,
      targetCourse: "Medicina",
      dailyStudyHours: 4.5,
    },
  });

  console.log(`✅ Usuário criado: ${testUser.email}`);
  console.log(`   Senha: TestPassword123!`);

  // =====================================================
  // Create User Progress
  // =====================================================
  console.log("📊 Criando progresso de usuário...");

  const userProgress = await Promise.all([
    prisma.userProgress.create({
      data: {
        userId: testUser.id,
        subjectId: subjects[0].id, // Matemática
        questionsAnswered: 15,
        correctAnswers: 12,
        estimatedLevel: 3.5,
      },
    }),
    prisma.userProgress.create({
      data: {
        userId: testUser.id,
        subjectId: subjects[1].id, // Português
        questionsAnswered: 10,
        correctAnswers: 8,
        estimatedLevel: 3.0,
      },
    }),
  ]);

  console.log(`✅ ${userProgress.length} progresso de usuário criados`);

  // =====================================================
  // Create Study Plan
  // =====================================================
  console.log("📅 Criando plano de estudos...");

  const studyPlan = await prisma.studyPlan.create({
    data: {
      userId: testUser.id,
      subjectId: subjects[0].id,
      date: new Date("2026-03-25"),
      durationMin: 120,
      status: "PENDING",
    },
  });

  console.log(`✅ Plano de estudo criado`);

  // =====================================================
  // Summary
  // =====================================================
  console.log("\n" + "=".repeat(50));
  console.log("🎉 Seed executado com sucesso!");
  console.log("=".repeat(50));
  console.log(`
📊 Dados criados:
  ✓ ${subjects.length} matérias
  ✓ ${questions.length} questões
  ✓ 1 usuário de teste
  ✓ ${userProgress.length} registros de progresso
  ✓ 1 plano de estudo

🧪 Teste com:
  Email: teste@vestibulai.com
  Senha: TestPassword123!

📝 As IDs foram geradas automaticamente e salvas no banco.
`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error("❌ Erro ao executar seed:", e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
