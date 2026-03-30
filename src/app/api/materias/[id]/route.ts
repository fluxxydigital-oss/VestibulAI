import { NextRequest } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { handleError, successResponse } from "@/lib/api-error";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    const topicLibrary: Record<string, Array<{ id: string; title: string; duration: string; type: string }>> = {
      "Matemática": [
        { id: "mat-1", title: "Razão, proporção e porcentagem", duration: "50 min", type: "intro" },
        { id: "mat-2", title: "Funções e interpretação de gráficos", duration: "1h 10m", type: "lesson" },
        { id: "mat-3", title: "Geometria plana aplicada", duration: "55 min", type: "lesson" },
        { id: "mat-4", title: "Lista comentada de questões do ENEM", duration: "1h 15m", type: "boss" },
      ],
      "Português": [
        { id: "por-1", title: "Leitura e interpretação textual", duration: "45 min", type: "intro" },
        { id: "por-2", title: "Coesão, coerência e conectivos", duration: "1h 00m", type: "lesson" },
        { id: "por-3", title: "Figuras de linguagem e sentido", duration: "50 min", type: "lesson" },
        { id: "por-4", title: "Questões comentadas de linguagens", duration: "1h 10m", type: "boss" },
      ],
      "Biologia": [
        { id: "bio-1", title: "Citologia e metabolismo celular", duration: "50 min", type: "intro" },
        { id: "bio-2", title: "Genética básica", duration: "1h 05m", type: "lesson" },
        { id: "bio-3", title: "Ecologia e impactos ambientais", duration: "55 min", type: "lesson" },
        { id: "bio-4", title: "Questões comentadas de natureza", duration: "1h 10m", type: "boss" },
      ],
      "História": [
        { id: "hist-1", title: "Brasil Colônia e Império", duration: "50 min", type: "intro" },
        { id: "hist-2", title: "República e cidadania", duration: "1h 00m", type: "lesson" },
        { id: "hist-3", title: "Mundo contemporâneo", duration: "55 min", type: "lesson" },
        { id: "hist-4", title: "Revisão por competências", duration: "1h 10m", type: "boss" },
      ],
      "Física": [
        { id: "fis-1", title: "Cinemática e movimento uniforme", duration: "50 min", type: "intro" },
        { id: "fis-2", title: "Leis de Newton e dinâmica", duration: "1h 05m", type: "lesson" },
        { id: "fis-3", title: "Energia e trabalho", duration: "55 min", type: "lesson" },
        { id: "fis-4", title: "Exercícios orientados do ENEM", duration: "1h 15m", type: "boss" },
      ],
    };

    const generateTopics = (name: string) => {
      return topicLibrary[name] || [
        { id: "geral-1", title: `Fundamentos de ${name}`, duration: "45 min", type: "intro" },
        { id: "geral-2", title: `Teoria central de ${name}`, duration: "1h 00m", type: "lesson" },
        { id: "geral-3", title: `Aplicações práticas em ${name}`, duration: "50 min", type: "lesson" },
        { id: "geral-4", title: `Revisão orientada de ${name}`, duration: "1h 10m", type: "boss" },
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

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session?.userId) throw new Error("Não autorizado");

    const prisma = getPrisma();
    const { id } = await params;

    const currentProgress = await prisma.userProgress.findUnique({
      where: { userId_subjectId: { userId: session.userId, subjectId: id } }
    });

    const nextQuestionsAnswered = (currentProgress?.questionsAnswered ?? 0) + 1;
    const nextCorrectAnswers = Math.min(nextQuestionsAnswered, (currentProgress?.correctAnswers ?? 0) + 1);
    const nextEstimatedLevel = Math.min(5, Number(((currentProgress?.estimatedLevel ?? 1) + 0.1).toFixed(2)));

    await prisma.user.update({
      where: { id: session.userId },
      data: { xp: { increment: 30 } }
    });

    const prog = await prisma.userProgress.upsert({
      where: { userId_subjectId: { userId: session.userId, subjectId: id } },
      update: {
        questionsAnswered: nextQuestionsAnswered,
        correctAnswers: nextCorrectAnswers,
        estimatedLevel: nextEstimatedLevel,
        lastActivityAt: new Date()
      },
      create: {
        userId: session.userId,
        subjectId: id,
        questionsAnswered: 1,
        correctAnswers: 1,
        estimatedLevel: 1.1,
        lastActivityAt: new Date()
      }
    });

    return successResponse({ success: true, newProg: prog, message: "Sessão de estudo registrada com sucesso." }, 200);
  } catch(error) {
    return handleError(error);
  }
}
