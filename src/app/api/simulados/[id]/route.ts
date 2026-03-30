import { NextRequest } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { handleError, successResponse, throwAuthenticationError, throwNotFoundError } from "@/lib/api-error";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getSession();
    if (!session) throwAuthenticationError();

    const prisma = getPrisma();
    const exam = await prisma.mockExam.findUnique({
      where: { id }
    });

    if (!exam || exam.userId !== session.userId) {
      throwNotFoundError("Simulado não encontrado");
    }

    const questions = await prisma.question.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        subject: { select: { name: true } }
      }
    });

    return successResponse({ exam, questions }, 200);
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getSession();
    if (!session) throwAuthenticationError();

    const body = await request.json();
    const { timeSpent, answers } = body; 
    
    const prisma = getPrisma();
    const existing = await prisma.mockExam.findUnique({ where: { id } });
    
    if (!existing || existing.userId !== session.userId) throwNotFoundError();

    // Estimativa de desempenho com base nas respostas enviadas
    
    let correctCount = 0;
    const allQuestions = await prisma.question.findMany({
       where: { id: { in: Object.keys(answers) } }
    });

    allQuestions.forEach(q => {
      if (answers[q.id] === q.correctOption) {
        correctCount++;
      }
    });

    const score = allQuestions.length > 0 
      ? Math.round(200 + (correctCount / allQuestions.length) * 800)
      : 0;

    const exam = await prisma.mockExam.update({
      where: { id },
      data: {
        status: "COMPLETED",
        score,
        timeSpent
      }
    });

    await prisma.user.update({
      where: { id: session.userId },
      data: { xp: { increment: Math.max(150, correctCount * 60) } }
    });

    return successResponse({ exam, correctCount, total: allQuestions.length }, 200);
  } catch (error) {
    return handleError(error);
  }
}
