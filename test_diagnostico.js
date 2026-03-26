const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  try {
    // Pegar o primeiro usuario
    const user = await prisma.user.findFirst();
    if (!user) {
      console.log('No user');
      return;
    }
    const userId = user.id;
    console.log('User id:', userId);

    const targetDate = '2026-11-10';
    const skills = {
      "Matemática": { correct: 0, total: 1 },
      "Biologia": { correct: 0, total: 1 },
      "História": { correct: 0, total: 1 },
      "Física": { correct: 0, total: 1 },
      "Português": { correct: 1, total: 1 }
    };

    console.log('Updating user...');
    await prisma.user.update({
      where: { id: userId },
      data: { targetDate: new Date(targetDate) }
    });

    console.log('Deleting plans...');
    await prisma.studyPlan.deleteMany({
      where: { userId }
    });

    console.log('Finding subjects...');
    const subjects = await prisma.subject.findMany();
    const newPlans = [];

    const initialDate = new Date();
    initialDate.setDate(initialDate.getDate() + 1);

    for (const [subjectName, performance] of Object.entries(skills)) {
      const subject = subjects.find(s => s.name === subjectName);
      if (!subject) {
        console.log('Subject not found:', subjectName);
        continue;
      }
      
      const { correct, total } = performance;
      
      console.log('Upserting progress for:', subjectName);
      await prisma.userProgress.upsert({
        where: { userId_subjectId: { userId, subjectId: subject.id } },
        update: {
          questionsAnswered: { increment: total },
          correctAnswers: { increment: correct }
        },
        create: {
          userId,
          subjectId: subject.id,
          questionsAnswered: total,
          correctAnswers: correct
        }
      });

      const ratio = correct / total;
      if (ratio < 0.5) {
        newPlans.push({
          userId,
          subjectId: subject.id,
          title: `Revisão Profunda: ${subjectName}`,
          type: "intro",
          xpReward: 150,
          date: new Date(initialDate),
          durationMin: 90,
          status: "PENDING"
        });
        initialDate.setDate(initialDate.getDate() + 1);
      } else {
        newPlans.push({
          userId,
          subjectId: subject.id,
          title: `Avançando em ${subjectName}`,
          type: "lesson",
          xpReward: 100,
          date: new Date(initialDate),
          durationMin: 60,
          status: "PENDING"
        });
        initialDate.setDate(initialDate.getDate() + 1);
      }
    }

    if (newPlans.length > 0) {
      console.log('Creating plans...', newPlans.length);
      await prisma.studyPlan.createMany({
        data: newPlans
      });
    }

    console.log('Success!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

run();
