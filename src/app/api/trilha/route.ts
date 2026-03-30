import { NextRequest } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { handleError, successResponse, throwAuthenticationError } from "@/lib/api-error";

/**
 * GET /api/trilha
 * Retorna a trilha de estudos (StudyPlan) real do usuário logado.
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      throwAuthenticationError("Não autorizado");
    }

    const prisma = getPrisma();
    const userId = session.userId;

    // 1. Busca a trilha existente
    const trilha = await prisma.studyPlan.findMany({
      where: { userId },
      orderBy: { date: 'asc' },
      include: {
        subject: {
          select: { name: true }
        }
      }
    });

    // 2. Trilha vazia: o frontend exibe o estado sem atividades.
    if (trilha.length === 0) {
      // Nenhuma trilha registrada para o usuário neste momento.
    }

    // 3. Busca o progresso real do usuário para o "Raio-X da IA"
    const userProgress = await prisma.userProgress.findMany({
      where: { userId },
      include: {
        subject: { select: { name: true, id: true } }
      }
    });

    return successResponse({ trilha, progress: userProgress }, 200);
  } catch (error) {
    return handleError(error);
  }
}
