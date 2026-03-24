import { NextRequest } from "next/server";
import {
  handleError,
  successResponse,
} from "@/lib/api-error";
import { getPrisma } from "@/lib/prisma";
import { generateToken } from "@/lib/auth";
import { z } from "zod";

/**
 * Request body validation
 */
const forgotPasswordSchema = z.object({
  email: z.string().email("E-mail inválido"),
});

/**
 * POST /api/auth/forgot-password
 * Initiate password reset process via email
 * Note: In this demo, we log the reset token. In production, send via email.
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

    // ✅ Generate password reset token (expires in 1 hour)
    const resetToken = generateToken(
      {
        userId: user.id,
        email: user.email,
      },
      false // Not a refresh token
    );

    // ✅ In a real application, send email with reset link
    // For demo purposes, we'll just log it
    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
    console.log(`[DEMO] Password reset link for ${email}: ${resetLink}`);

    // TODO: Integrate with email service (nodemailer, SendGrid, etc.)
    // TODO: Save reset token to database with expiration

    // ✅ Return success response
    return successResponse({
      message: "Se o e-mail existir em nosso sistema, um link de recuperação será enviado",
      // In production, remove this:
      demo: {
        resetLink,
      },
    }, 200);
  } catch (error) {
    return handleError(error);
  }
}
