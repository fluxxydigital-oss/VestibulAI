import { NextRequest } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import {
  handleError,
  successResponse,
  throwAuthenticationError,
} from "@/lib/api-error";

/**
 * GET /api/auth/me
 * Get current authenticated user data
 */
export async function GET(request: NextRequest) {
  try {
    const prisma = getPrisma();
    // ✅ Get session from token
    const session = await getSession();

    if (!session) {
      throwAuthenticationError("Token não fornecido ou inválido");
    }

    // ✅ Get user from database
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        name: true,
        email: true,
        targetCourse: true,
        dailyStudyHours: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throwAuthenticationError("Usuário não encontrado");
    }

    // ✅ Return success response
    return successResponse({ user }, 200);
  } catch (error) {
    return handleError(error);
  }
}

