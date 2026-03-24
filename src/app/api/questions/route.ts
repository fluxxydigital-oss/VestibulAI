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
 * Query params validation
 */
const questionQuerySchema = z.object({
  subjectId: z.string().optional(),
  difficulty: z.coerce.number().min(1).max(5).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});

/**
 * GET /api/questions
 * List questions with filters and pagination
 */
export async function GET(request: NextRequest) {
  try {
    // ✅ Verify user is authenticated
    const session = await getSession();

    if (!session) {
      throwAuthenticationError("Não autenticado");
    }

    // ✅ Parse and validate query parameters
    const queryParams = Object.fromEntries(request.nextUrl.searchParams.entries());
    const { subjectId, difficulty, page, limit } = questionQuerySchema.parse(queryParams);

    // ✅ Build where clause for filters
    const where: any = {};
    if (subjectId) {
      where.subjectId = subjectId;
    }
    if (difficulty) {
      where.difficulty = difficulty;
    }

    // ✅ Get total count for pagination
    const prisma = getPrisma();
    const total = await prisma.question.count({ where });

    // ✅ Fetch questions with pagination
    const questions = await prisma.question.findMany({
      where,
      include: {
        subject: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    const totalPages = Math.ceil(total / limit);

    // ✅ Return success response
    return successResponse({
      questions,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    }, 200);
  } catch (error) {
    return handleError(error);
  }
}
