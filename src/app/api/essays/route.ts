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
const submitEssaySchema = z.object({
  theme: z.string().min(10, "Tema deve ter no mínimo 10 caracteres"),
  content: z.string().min(100, "Redação deve ter no mínimo 100 caracteres"),
});

/**
 * POST /api/essays
 * Submit an essay for evaluation
 */
export async function POST(request: NextRequest) {
  try {
    // ✅ Verify user is authenticated
    const session = await getSession();

    if (!session) {
      throwAuthenticationError("Não autenticado");
    }

    // ✅ Parse and validate request body
    const { theme, content } = submitEssaySchema.parse(
      await request.json()
    );

    // ✅ Create essay record
    const prisma = getPrisma();
    const essay = await prisma.essay.create({
      data: {
        userId: session.userId,
        theme,
        content,
        status: "SUBMITTED",
      },
    });

    // ✅ Return success response
    return successResponse({
      essayId: essay.id,
      status: essay.status,
      createdAt: essay.createdAt,
      message: "Redação enviada com sucesso para avaliação",
    }, 201);
  } catch (error) {
    return handleError(error);
  }
}
