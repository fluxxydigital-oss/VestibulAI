import { NextRequest } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { handleError, successResponse } from "@/lib/api-error";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    const userId = session?.userId;
    const prisma = getPrisma();
    const { id } = await params;

    const subject = await prisma.subject.findUnique({
      where: { id }
    });

    if (!subject) {
      throw new Error("Matéria não encontrada");
    }

    let progressData = { questionsAnswered: 0, correctAnswers: 0, estimatedLevel: 1.0 };
    if (userId) {
      const prog = await prisma.userProgress.findUnique({
        where: { userId_subjectId: { userId, subjectId: id } }
      });
      if (prog) progressData = prog;
    }

    let progressPercent = 0;
    if (progressData.questionsAnswered > 0) {
      progressPercent = Math.min(Math.round((progressData.correctAnswers / progressData.questionsAnswered) * 100), 100);
    }

    // Gerador rudimentar de Sylabus (Tópicos) baseado no nome para MVP
    const generateTopics = (name: string) => {
      const isExatas = ["Matemática", "Física", "Química"].includes(name);
      return [
        { id: "mod-1", title: "Fundamentos Pela Base", duration: "45 min", type: "intro" },
        { id: "mod-2", title: "Aprofundamento Teórico", duration: "1h 20m", type: "lesson" },
        { id: "mod-3", title: isExatas ? "Resolução de Cálculos" : "Leitura e Interpretação", duration: "50 min", type: "lesson" },
        { id: "mod-4", title: "Bateria de Exercícios (ENEM)", duration: "1h 00m", type: "boss" },
      ];
    };

    return successResponse({
      materia: subject,
      progress: progressPercent,
      stats: progressData,
      topics: generateTopics(subject.name)
    }, 200);

  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Rota simples para simular conclusão de uma aula nessa matéria e ganhar XP/Progresso
    const session = await getSession();
    if (!session?.userId) throw new Error("Não autorizado");
    
    const prisma = getPrisma();
    const { id } = await params;

    // Aumenta xp e progresso minimamente
    await prisma.user.update({
       where: { id: session.userId },
       data: { xp: { increment: 50 } }
    });

    const prog = await prisma.userProgress.upsert({
      where: { userId_subjectId: { userId: session.userId, subjectId: id } },
      update: { 
         questionsAnswered: { increment: 5 },
         correctAnswers: { increment: 4 }, // simula bom acerto
         lastActivityAt: new Date()
      },
      create: {
         userId: session.userId,
         subjectId: id,
         questionsAnswered: 5,
         correctAnswers: 4
      }
    });

    return successResponse({ success: true, newProg: prog }, 200);
  } catch(error) {
    return handleError(error);
  }
}
