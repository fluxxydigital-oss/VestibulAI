import { NextRequest } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { handleError, successResponse } from "@/lib/api-error";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.userId) throw new Error("Não autorizado");
    
    const body = await request.json();
    const { targetDate, skills } = body;
    // skills object looks like { "Matemática": { correct: 2, total: 5 }, "História": { correct: 4, total: 5 } }

    const prisma = getPrisma();
    const userId = session.userId;

    // 1. Atualizar Target Date no Usuário
    if (targetDate) {
      await prisma.user.update({
        where: { id: userId },
        data: { targetDate: new Date(targetDate) }
      });
    }

    // 2. Limpar Planos de Estudo (Trilha) antigas para recalcular
    await prisma.studyPlan.deleteMany({
      where: { userId }
    });

    // 3. Processar as respostas preenchendo o UserProgress real
    const subjects = await prisma.subject.findMany();
    const newPlans = [];

    // Para gerar dados de roadmap
    // Datas distribuídas a partir de amanhã
    const initialDate = new Date();
    initialDate.setDate(initialDate.getDate() + 1);

    for (const [subjectName, performance] of Object.entries(skills)) {
      const subject = subjects.find(s => s.name === subjectName);
      if (!subject) continue; // ignora se não achar a matéria
      
      const { correct, total } = performance as any;
      
      // Upsert do progresso
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

      // 4. Inteligência da Trilha: se o aluno foi mal (< 50%), colocar aula extra!
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
        initialDate.setDate(initialDate.getDate() + 1); // move 1 dia pra frente
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

    // Cria a nova trilha no DB
    if (newPlans.length > 0) {
      await prisma.studyPlan.createMany({
        data: newPlans
      });
    }

    return successResponse({ success: true, message: "Nivelamento processado com sucesso!" }, 200);

  } catch (error) {
    return handleError(error);
  }
}
