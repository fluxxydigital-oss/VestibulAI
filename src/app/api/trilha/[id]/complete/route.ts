import { NextRequest } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { handleError, successResponse, throwAuthenticationError, throwNotFoundError } from "@/lib/api-error";

/**
 * PATCH /api/trilha/[id]/complete
 * Marca uma aula/sessão da trilha como concluída e adiciona XP ao usuário.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      throwAuthenticationError("Não autorizado");
    }

    const { id } = await params;
    const prisma = getPrisma();

    // 1. Verifica se a sessão existe e pertence ao usuário
    const plan = await prisma.studyPlan.findUnique({
      where: { id }
    });

    if (!plan || plan.userId !== session.userId) {
      throwNotFoundError("Sessão de estudo não encontrada");
    }

    if (plan.status === "COMPLETED") {
      return successResponse({ message: "Já estava concluída", plan }, 200);
    }

    // 2. Atualiza status e XP em transação
    const [updatedPlan, updatedUser] = await prisma.$transaction([
      prisma.studyPlan.update({
        where: { id },
        data: { status: "COMPLETED" }
      }),
      prisma.user.update({
        where: { id: session.userId },
        data: { xp: { increment: plan.xpReward } }
      })
    ]);

    return successResponse({ 
      message: "Sessão concluída com sucesso",
      plan: updatedPlan,
      newXpTotal: updatedUser.xp 
    }, 200);

  } catch (error) {
    return handleError(error);
  }
}
