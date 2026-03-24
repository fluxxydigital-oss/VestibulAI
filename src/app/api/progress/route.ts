import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import {
  handleError,
  successResponse,
  throwAuthenticationError,
} from "@/lib/api-error";
import { getPrisma } from "@/lib/prisma";

/**
 * GET /api/progress
 * Get user's complete progress by subject
 */
export async function GET(request: NextRequest) {
  try {
    // ✅ Verify user is authenticated
    const session = await getSession();

    if (!session) {
      throwAuthenticationError("Não autenticado");
    }

    // ✅ Fetch user progress for all subjects
    const prisma = getPrisma();
    const userProgress = await prisma.userProgress.findMany({
      where: { userId: session.userId },
      include: {
        subject: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
      orderBy: {
        subject: {
          name: "asc",
        },
      },
    });

    // ✅ Calculate statistics
    const bySubject = userProgress.map((progress: typeof userProgress[0]) => {
      const accuracy = progress.questionsAnswered > 0 
        ? (progress.correctAnswers / progress.questionsAnswered) * 100
        : 0;

      return {
        subjectId: progress.subject.id,
        subjectName: progress.subject.name,
        subjectDescription: progress.subject.description,
        questionsAnswered: progress.questionsAnswered,
        correctAnswers: progress.correctAnswers,
        accuracy: Number(accuracy.toFixed(1)),
        estimatedLevel: progress.estimatedLevel,
        lastActivityAt: progress.lastActivityAt,
      };
    });

    // ✅ Calculate overall statistics
    const totalQuestionsAnswered = userProgress.reduce(
      (sum: number, p: typeof userProgress[0]) => sum + p.questionsAnswered,
      0
    );
    const totalCorrectAnswers = userProgress.reduce(
      (sum: number, p: typeof userProgress[0]) => sum + p.correctAnswers,
      0
    );
    const overallAccuracy = totalQuestionsAnswered > 0 
      ? (totalCorrectAnswers / totalQuestionsAnswered) * 100
      : 0;

    const averageLevel = userProgress.length > 0
      ? userProgress.reduce((sum: number, p: typeof userProgress[0]) => sum + p.estimatedLevel, 0) /
        userProgress.length
      : 0;

    // ✅ Return success response
    return successResponse({
      bySubject,
      overall: {
        totalQuestionsAnswered,
        totalCorrectAnswers,
        overallAccuracy: Number(overallAccuracy.toFixed(1)),
        averageLevel: Number(averageLevel.toFixed(2)),
        subjectsWithProgress: userProgress.length,
      },
    }, 200);
  } catch (error) {
    return handleError(error);
  }
}
