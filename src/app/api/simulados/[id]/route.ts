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

    // Fetch some real questions from the DB to act as the exam content
    // Limiting to 5 for the MVP engine
    const questions = await prisma.question.findMany({
      take: 5,
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

    // Calculate score (Simulated TRI calculation based on correct answers)
    // answers is an object like { questionId: "opt-id" }
    
    let correctCount = 0;
    const allQuestions = await prisma.question.findMany({
       where: { id: { in: Object.keys(answers) } }
    });

    allQuestions.forEach(q => {
      if (answers[q.id] === q.correctOption) {
        correctCount++;
      }
    });

    // Score from 0 to 1000
    const score = allQuestions.length > 0 
      ? Math.round((correctCount / allQuestions.length) * 1000) 
      : 0;

    const exam = await prisma.mockExam.update({
      where: { id },
      data: {
        status: "COMPLETED",
        score,
        timeSpent
      }
    });

    // Add XP
    await prisma.user.update({
      where: { id: session.userId },
      data: { xp: { increment: 2500 } }
    });

    return successResponse({ exam, correctCount, total: allQuestions.length }, 200);
  } catch (error) {
    return handleError(error);
  }
}
