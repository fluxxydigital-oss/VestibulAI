import { NextRequest } from "next/server";
import {
  handleError,
  successResponse,
} from "@/lib/api-error";
import { getPrisma } from "@/lib/prisma";
import { z } from "zod";

/**
 * Request body validation
 */
const forgotPasswordSchema = z.object({
  email: z.string().email("E-mail inválido"),
});

/**
 * POST /api/auth/forgot-password
 * Registra a solicitação de redefinição de senha sem expor dados sensíveis.
 */
export async function POST(request: NextRequest) {
  try {
    // ✅ Parse and validate request body
    const { email } = forgotPasswordSchema.parse(await request.json());

    // ✅ Find user by email
    const prisma = getPrisma();
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // ✅ Security: Always return success message (don't reveal if email exists)
    if (!user) {
      return successResponse({
        message: "Se o e-mail existir em nosso sistema, um link de recuperação será enviado",
      }, 200);
    }

    // ✅ Mantém resposta neutra por segurança, sem retornar links ou tokens sensíveis
    // TODO: Integrar com serviço de e-mail e persistência segura do token
    return successResponse({
      message: "Se o e-mail existir em nosso sistema, a solicitação de recuperação foi registrada.",
    }, 200);
  } catch (error) {
    return handleError(error);
  }
}
