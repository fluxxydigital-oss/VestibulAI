import { NextRequest } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/schemas";
import { verifyPassword, createSession } from "@/lib/auth";
import {
  handleError,
  successResponse,
  throwAuthenticationError,
} from "@/lib/api-error";

/**
 * POST /api/auth/login
 * Authenticate user and return tokens
 */
export async function POST(request: NextRequest) {
  try {
    const prisma = getPrisma();
    const body = await request.json();

    // ✅ Validate input
    const validatedData = loginSchema.parse(body);

    // ✅ Find user by email
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email.toLowerCase() },
    });

    if (!user) {
      throwAuthenticationError("Email ou senha inválidos");
    }

    // ✅ Verify password
    const passwordValid = await verifyPassword(
      validatedData.password,
      user.passwordHash
    );

    if (!passwordValid) {
      throwAuthenticationError("Email ou senha inválidos");
    }

    // ✅ Create session (generate tokens and set cookies)
    const session = await createSession(user.id, user.email);

    // ✅ Return success response
    return successResponse(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          targetCourse: user.targetCourse,
        },
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
      },
      200
    );
  } catch (error) {
    return handleError(error);
  }
}
