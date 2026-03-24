import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import {
  handleError,
  successResponse,
  throwAuthenticationError,
} from "@/lib/api-error";
import { getPrisma } from "@/lib/prisma";
import { z } from "zod";

/**
 * Request body validation
 */
const submitAnswerSchema = z.object({
  selectedOptionId: z.string().min(1, "Opção inválida"),
});

/**
 * POST /api/questions/[id]/answer
 * Submit answer to a question and update progress
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // ✅ Verify user is authenticated
    const session = await getSession();

    if (!session) {
      throwAuthenticationError("Não autenticado");
    }

    // ✅ Parse and validate request body
    const { selectedOptionId } = submitAnswerSchema.parse(
      await request.json()
    );

    // ✅ Get the question
    const prisma = getPrisma();
    const question = await prisma.question.findUnique({
      where: { id },
      include: {
        subject: true,
      },
    });

    if (!question) {
      return successResponse(
        { error: "Questão não encontrada" },
        404
      );
    }

    // ✅ Check if answer is correct
    const isCorrect = selectedOptionId === question.correctOption;

    // ✅ Update user progress
    const userProgress = await prisma.userProgress.upsert({
      where: {
        userId_subjectId: {
          userId: session.userId,
          subjectId: question.subjectId,
        },
      },
      update: {
        questionsAnswered: {
          increment: 1,
        },
        correctAnswers: isCorrect ? { increment: 1 } : undefined,
        lastActivityAt: new Date(),
      },
      create: {
        userId: session.userId,
        subjectId: question.subjectId,
        questionsAnswered: 1,
        correctAnswers: isCorrect ? 1 : 0,
      },
    });

    // ✅ Find the correct option details for response
    const correctOptionDetails = (question.options as any[])?.find(
      (opt: any) => opt.id === question.correctOption
    );

    // ✅ Return success response
    return successResponse({
      isCorrect,
      correctOptionId: question.correctOption,
      correctOptionText: correctOptionDetails?.text,
      explanation: question.source || "Resposta registrada",
      userProgress: {
        questionsAnswered: userProgress.questionsAnswered,
        correctAnswers: userProgress.correctAnswers,
        accuracy: (
          (userProgress.correctAnswers / userProgress.questionsAnswered) *
          100
        ).toFixed(1),
      },
    }, 200);
  } catch (error) {
    return handleError(error);
  }
}
