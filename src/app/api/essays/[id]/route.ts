import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import {
  handleError,
  successResponse,
  throwAuthenticationError,
  throwAuthorizationError,
} from "@/lib/api-error";
import { getPrisma } from "@/lib/prisma";

/**
 * GET /api/essays/[id]
 * Get essay details including feedback and score
 */
export async function GET(
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

    // ✅ Fetch essay
    const prisma = getPrisma();
    const essay = await prisma.essay.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!essay) {
      return successResponse(
        { error: "Redação não encontrada" },
        404
      );
    }

    // ✅ Verify user owns the essay
    if (essay.userId !== session.userId) {
      throwAuthorizationError("Você não tem permissão para acessar esta redação");
    }

    // ✅ Return success response
    return successResponse({
      essay: {
        id: essay.id,
        theme: essay.theme,
        content: essay.content,
        status: essay.status,
        score: essay.score,
        feedback: essay.feedback,
        createdAt: essay.createdAt,
        updatedAt: essay.updatedAt,
      },
    }, 200);
  } catch (error) {
    return handleError(error);
  }
}

/**
 * DELETE /api/essays/[id]
 * Delete an essay
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: essayId } = await params;
  try {
    // ✅ Verify user is authenticated
    const session = await getSession();

    if (!session) {
      throwAuthenticationError("Não autenticado");
    }

    // ✅ Fetch essay
    const prisma = getPrisma();
    const essay = await prisma.essay.findUnique({
      where: { id: essayId },
    });

    if (!essay) {
      return successResponse(
        { error: "Redação não encontrada" },
        404
      );
    }

    // ✅ Verify user owns the essay
    if (essay.userId !== session.userId) {
      throwAuthorizationError("Você não tem permissão para deletar esta redação");
    }

    // ✅ Delete essay
    await prisma.essay.delete({
      where: { id: essayId },
    });

    // ✅ Return success response
    return successResponse({
      message: "Redação deletada com sucesso",
    }, 200);
  } catch (error) {
    return handleError(error);
  }
}
