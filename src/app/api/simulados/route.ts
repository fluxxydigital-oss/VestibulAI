import { NextRequest } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { handleError, successResponse, throwAuthenticationError } from "@/lib/api-error";

function formatDuration(questionCount: number) {
  const totalMinutes = Math.max(20, questionCount * 3);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) return `${totalMinutes} min`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}min`;
}

function getDifficultyLabel(avgDifficulty: number) {
  if (avgDifficulty >= 3.5) return "Alta";
  if (avgDifficulty >= 2.3) return "Média";
  return "Fundamental";
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) throwAuthenticationError();
    const userId = session.userId;

    const prisma = getPrisma();

    const [savedExams, questionPool] = await Promise.all([
      prisma.mockExam.findMany({
        where: { userId },
        orderBy: { updatedAt: 'desc' }
      }),
      prisma.question.findMany({
        select: {
          difficulty: true,
        }
      })
    ]);

    const availableQuestions = Math.min(questionPool.length, 10);
    const avgDifficulty = questionPool.length > 0
      ? questionPool.reduce((sum, question) => sum + question.difficulty, 0) / questionPool.length
      : 1;

    const templates = availableQuestions > 0 ? [
      {
        id: 'simulado-geral-real',
        title: 'Simulado Geral com Questões Reais',
        type: 'Geral',
        status: 'AVAILABLE',
        questions: availableQuestions,
        time: formatDuration(availableQuestions),
        diff: getDifficultyLabel(avgDifficulty),
        xp: Math.max(300, availableQuestions * 40),
        accent: 'border-primary/50 text-primary'
      }
    ] : [];

    const history = savedExams.map((exam) => ({
      ...exam,
      dbId: exam.id,
      questions: availableQuestions,
      time: formatDuration(Math.max(availableQuestions, 1)),
      diff: getDifficultyLabel(avgDifficulty),
      xp: Math.max(300, Math.max(availableQuestions, 1) * 40),
      accent: exam.status === 'COMPLETED'
        ? 'border-green-500/50 text-green-500'
        : exam.status === 'IN_PROGRESS'
          ? 'border-yellow-500/50 text-yellow-500'
          : 'border-primary/50 text-primary'
    }));

    const results = [...templates, ...history];
    const completed = history.filter((exam) => exam.status === "COMPLETED");
    const avgScore = completed.length > 0
      ? completed.reduce((acc, exam) => acc + (exam.score || 0), 0) / completed.length
      : 0;

    return successResponse({
      simulados: results,
      stats: {
        total: completed.length,
        avgScore: Math.round(avgScore)
      }
    }, 200);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
     const session = await getSession();
     if (!session) throwAuthenticationError();

     const body = await request.json();
     const { title, type } = body;

     const prisma = getPrisma();
     const exam = await prisma.mockExam.create({
       data: {
         userId: session.userId,
         title,
         type,
         status: "IN_PROGRESS"
       }
     });

     return successResponse({ exam }, 201);
  } catch (error) {
    return handleError(error);
  }
}
