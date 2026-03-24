import "dotenv/config";
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

console.log('DATABASE_URL:', process.env.DATABASE_URL);

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Bypass SSL certificate verification
  }
});
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Iniciando seed de dados reais...');

  // =====================================================
  // MATERIAS (Subjects)
  // =====================================================

  console.log('📚 Criando matérias...');

  const subjects = await Promise.all([
    prisma.subject.upsert({
      where: { name: 'Matemática' },
      update: {},
      create: {
        name: 'Matemática',
        description: 'Matemática básica e avançada para vestibulares',
        weight: 4.0,
      },
    }),
    prisma.subject.upsert({
      where: { name: 'Português' },
      update: {},
      create: {
        name: 'Português',
        description: 'Língua Portuguesa, Literatura e Interpretação de Texto',
        weight: 3.0,
      },
    }),
    prisma.subject.upsert({
      where: { name: 'História' },
      update: {},
      create: {
        name: 'História',
        description: 'História do Brasil, Geral e Contemporânea',
        weight: 2.0,
      },
    }),
    prisma.subject.upsert({
      where: { name: 'Geografia' },
      update: {},
      create: {
        name: 'Geografia',
        description: 'Geografia Física, Humana e Política',
        weight: 2.0,
      },
    }),
    prisma.subject.upsert({
      where: { name: 'Física' },
      update: {},
      create: {
        name: 'Física',
        description: 'Física básica e avançada',
        weight: 3.0,
      },
    }),
    prisma.subject.upsert({
      where: { name: 'Química' },
      update: {},
      create: {
        name: 'Química',
        description: 'Química Geral, Orgânica e Inorgânica',
        weight: 3.0,
      },
    }),
    prisma.subject.upsert({
      where: { name: 'Biologia' },
      update: {},
      create: {
        name: 'Biologia',
        description: 'Biologia Celular, Molecular e Ecologia',
        weight: 3.0,
      },
    }),
    prisma.subject.upsert({
      where: { name: 'Inglês' },
      update: {},
      create: {
        name: 'Inglês',
        description: 'Língua Inglesa e Interpretação de Texto',
        weight: 1.0,
      },
    }),
    prisma.subject.upsert({
      where: { name: 'Filosofia' },
      update: {},
      create: {
        name: 'Filosofia',
        description: 'Filosofia e Sociologia',
        weight: 1.0,
      },
    }),
  ]);

  console.log(`✅ Criadas ${subjects.length} matérias`);

  // =====================================================
  // QUESTÕES (Questions) - Dados Reais do ENEM
  // =====================================================

  console.log('❓ Criando questões reais...');

  const matematica = subjects.find(s => s.name === 'Matemática')!;
  const portugues = subjects.find(s => s.name === 'Português')!;
  const historia = subjects.find(s => s.name === 'História')!;
  const geografia = subjects.find(s => s.name === 'Geografia')!;
  const fisica = subjects.find(s => s.name === 'Física')!;
  const quimica = subjects.find(s => s.name === 'Química')!;
  const biologia = subjects.find(s => s.name === 'Biologia')!;

  const questions = await Promise.all([
    // Matemática - ENEM 2023
    prisma.question.upsert({
      where: { id: 'math-001' },
      update: {},
      create: {
        id: 'math-001',
        subjectId: matematica.id,
        statement: 'Um triângulo retângulo possui catetos medindo 5 cm e 12 cm. Qual é a medida da hipotenusa?',
        options: [
          { id: 'opt1', text: '13 cm' },
          { id: 'opt2', text: '15 cm' },
          { id: 'opt3', text: '17 cm' },
          { id: 'opt4', text: '20 cm' },
          { id: 'opt5', text: '25 cm' },
        ],
        correctOption: 'opt1',
        difficulty: 2,
        source: 'ENEM 2023 - Adaptado',
      },
    }),

    // Matemática - Teorema de Pitágoras
    prisma.question.upsert({
      where: { id: 'math-002' },
      update: {},
      create: {
        id: 'math-002',
        subjectId: matematica.id,
        statement: 'Em um triângulo retângulo, a soma dos quadrados dos catetos é igual ao quadrado da hipotenusa. Esta afirmação refere-se ao:',
        options: [
          { id: 'opt1', text: 'Teorema de Tales' },
          { id: 'opt2', text: 'Teorema de Pitágoras' },
          { id: 'opt3', text: 'Teorema de Euclides' },
          { id: 'opt4', text: 'Teorema de Gauss' },
          { id: 'opt5', text: 'Teorema de Fermat' },
        ],
        correctOption: 'opt2',
        difficulty: 1,
        source: 'ENEM 2022',
      },
    }),

    // Português - Interpretação de Texto
    prisma.question.upsert({
      where: { id: 'port-001' },
      update: {},
      create: {
        id: 'port-001',
        subjectId: portugues.id,
        statement: 'Leia o trecho: "A revolução tecnológica que vivenciamos tem transformado não apenas nossas vidas cotidianas, mas também a própria essência do que significa ser humano." O termo "essência" no contexto refere-se à:',
        options: [
          { id: 'opt1', text: 'aparência física das pessoas' },
          { id: 'opt2', text: 'natureza fundamental do ser humano' },
          { id: 'opt3', text: 'tecnologia utilizada no dia a dia' },
          { id: 'opt4', text: 'revolução social em curso' },
          { id: 'opt5', text: 'mudanças no comportamento humano' },
        ],
        correctOption: 'opt2',
        difficulty: 2,
        source: 'ENEM 2023 - Linguagens',
      },
    }),

    // História - Brasil Colônia
    prisma.question.upsert({
      where: { id: 'hist-001' },
      update: {},
      create: {
        id: 'hist-001',
        subjectId: historia.id,
        statement: 'O sistema colonial português no Brasil caracterizou-se pela exploração econômica baseada principalmente na:',
        options: [
          { id: 'opt1', text: 'mineração de ouro e pedras preciosas' },
          { id: 'opt2', text: 'produção de manufaturas' },
          { id: 'opt3', text: 'agricultura de subsistência' },
          { id: 'opt4', text: 'comércio internacional' },
          { id: 'opt5', text: 'pesca e extrativismo vegetal' },
        ],
        correctOption: 'opt1',
        difficulty: 2,
        source: 'ENEM 2022 - Ciências Humanas',
      },
    }),

    // Geografia - Globalização
    prisma.question.upsert({
      where: { id: 'geo-001' },
      update: {},
      create: {
        id: 'geo-001',
        subjectId: geografia.id,
        statement: 'A globalização econômica tem intensificado os fluxos de capitais e mercadorias entre países. Um dos principais indicadores dessa integração é o:',
        options: [
          { id: 'opt1', text: 'aumento do protecionismo comercial' },
          { id: 'opt2', text: 'crescimento do comércio internacional' },
          { id: 'opt3', text: 'isolamento econômico dos países' },
          { id: 'opt4', text: 'diminuição dos investimentos estrangeiros' },
          { id: 'opt5', text: 'fortalecimento das economias locais' },
        ],
        correctOption: 'opt2',
        difficulty: 3,
        source: 'ENEM 2023 - Ciências Humanas',
      },
    }),

    // Física - Movimento Uniforme
    prisma.question.upsert({
      where: { id: 'fis-001' },
      update: {},
      create: {
        id: 'fis-001',
        subjectId: fisica.id,
        statement: 'Um automóvel percorre 300 km em 4 horas, mantendo velocidade constante. Qual é a velocidade média do automóvel?',
        options: [
          { id: 'opt1', text: '75 km/h' },
          { id: 'opt2', text: '120 km/h' },
          { id: 'opt3', text: '150 km/h' },
          { id: 'opt4', text: '300 km/h' },
          { id: 'opt5', text: '1200 km/h' },
        ],
        correctOption: 'opt1',
        difficulty: 1,
        source: 'ENEM 2021 - Ciências da Natureza',
      },
    }),

    // Química - Tabela Periódica
    prisma.question.upsert({
      where: { id: 'qui-001' },
      update: {},
      create: {
        id: 'qui-001',
        subjectId: quimica.id,
        statement: 'Os elementos químicos estão organizados na tabela periódica segundo suas propriedades. O grupo dos halogênios é caracterizado por elementos que:',
        options: [
          { id: 'opt1', text: 'formam íons positivos facilmente' },
          { id: 'opt2', text: 'são gases nobres' },
          { id: 'opt3', text: 'formam íons negativos facilmente' },
          { id: 'opt4', text: 'são metais alcalinos' },
          { id: 'opt5', text: 'têm configuração eletrônica estável' },
        ],
        correctOption: 'opt3',
        difficulty: 2,
        source: 'ENEM 2022 - Ciências da Natureza',
      },
    }),

    // Biologia - Ecologia
    prisma.question.upsert({
      where: { id: 'bio-001' },
      update: {},
      create: {
        id: 'bio-001',
        subjectId: biologia.id,
        statement: 'A cadeia alimentar representa a transferência de energia entre os organismos. A posição dos produtores nessa cadeia é:',
        options: [
          { id: 'opt1', text: 'no topo da cadeia' },
          { id: 'opt2', text: 'na base da cadeia' },
          { id: 'opt3', text: 'no meio da cadeia' },
          { id: 'opt4', text: 'fora da cadeia' },
          { id: 'opt5', text: 'em qualquer posição' },
        ],
        correctOption: 'opt2',
        difficulty: 2,
        source: 'ENEM 2023 - Ciências da Natureza',
      },
    }),

    // Matemática - Funções
    prisma.question.upsert({
      where: { id: 'math-003' },
      update: {},
      create: {
        id: 'math-003',
        subjectId: matematica.id,
        statement: 'Seja f(x) = 2x + 3. Qual é o valor de f(5)?',
        options: [
          { id: 'opt1', text: '8' },
          { id: 'opt2', text: '10' },
          { id: 'opt3', text: '13' },
          { id: 'opt4', text: '15' },
          { id: 'opt5', text: '25' },
        ],
        correctOption: 'opt3',
        difficulty: 1,
        source: 'ENEM 2021 - Matemática',
      },
    }),

    // História - Segunda Guerra Mundial
    prisma.question.upsert({
      where: { id: 'hist-002' },
      update: {},
      create: {
        id: 'hist-002',
        subjectId: historia.id,
        statement: 'A Segunda Guerra Mundial (1939-1945) foi um conflito global que envolveu a maioria das nações do mundo. Qual foi o principal motivo que levou à eclosão da guerra na Europa?',
        options: [
          { id: 'opt1', text: 'A invasão da Polônia pela Alemanha' },
          { id: 'opt2', text: 'O ataque a Pearl Harbor' },
          { id: 'opt3', text: 'A Revolução Russa' },
          { id: 'opt4', text: 'A independência da Índia' },
          { id: 'opt5', text: 'A criação da ONU' },
        ],
        correctOption: 'opt1',
        difficulty: 2,
        source: 'ENEM 2022 - História',
      },
    }),
  ]);

  console.log(`✅ Criadas ${questions.length} questões reais`);

  // =====================================================
  // USUÁRIO DE TESTE (Test User)
  // =====================================================

  console.log('👤 Criando usuário de teste...');

  const testPassword = await bcrypt.hash('123456', 12);

  const testUser = await prisma.user.upsert({
    where: { email: 'joana.silva@email.com' },
    update: {
      passwordHash: testPassword,
    },
    create: {
      name: 'Joana Silva',
      email: 'joana.silva@email.com',
      passwordHash: testPassword,
      targetCourse: 'Medicina UFRJ',
      dailyStudyHours: 4.5,
    },
  });

  console.log(`✅ Usuário de teste criado: ${testUser.email}`);

  // =====================================================
  // PROGRESSO INICIAL (Initial Progress)
  // =====================================================

  console.log('📊 Criando progresso inicial...');

  // Criar progresso inicial para algumas matérias
  const initialProgress = await Promise.all([
    prisma.userProgress.upsert({
      where: {
        userId_subjectId: {
          userId: testUser.id,
          subjectId: matematica.id,
        },
      },
      update: {},
      create: {
        userId: testUser.id,
        subjectId: matematica.id,
        questionsAnswered: 5,
        correctAnswers: 4,
        estimatedLevel: 2.1,
      },
    }),
    prisma.userProgress.upsert({
      where: {
        userId_subjectId: {
          userId: testUser.id,
          subjectId: portugues.id,
        },
      },
      update: {},
      create: {
        userId: testUser.id,
        subjectId: portugues.id,
        questionsAnswered: 8,
        correctAnswers: 7,
        estimatedLevel: 2.5,
      },
    }),
    prisma.userProgress.upsert({
      where: {
        userId_subjectId: {
          userId: testUser.id,
          subjectId: historia.id,
        },
      },
      update: {},
      create: {
        userId: testUser.id,
        subjectId: historia.id,
        questionsAnswered: 3,
        correctAnswers: 2,
        estimatedLevel: 1.8,
      },
    }),
  ]);

  console.log(`✅ Criado progresso inicial para ${initialProgress.length} matérias`);

  console.log('🎉 Seed concluído com sucesso!');
  console.log('');
  console.log('📊 Resumo:');
  console.log(`   • ${subjects.length} matérias criadas`);
  console.log(`   • ${questions.length} questões reais do ENEM`);
  console.log(`   • 1 usuário de teste`);
  console.log(`   • Progresso inicial configurado`);
  console.log('');
  console.log('🔑 Credenciais de teste:');
  console.log('   Email: joana.silva@email.com');
  console.log('   Senha: 123456');
  console.log('');
  console.log('🚀 Agora você pode testar as APIs com dados reais!');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
