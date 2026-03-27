import { NextRequest } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/schemas";
import {
  hashPassword,
  createSession,
  validatePasswordStrength,
} from "@/lib/auth";
import {
  handleError,
  successResponse,
  throwValidationError,
  throwConflictError,
} from "@/lib/api-error";

/**
 * POST /api/auth/register
 * Register a new user
 */
export async function POST(request: NextRequest) {
  try {
    const prisma = getPrisma();
    const body = await request.json();

    // ✅ Validate input
    const validatedData = registerSchema.parse(body);

    // ✅ Check password strength
    const passwordStrength = validatePasswordStrength(validatedData.password);
    if (!passwordStrength.isValid) {
      throwValidationError(
        "Senha fraca",
        {
          password: passwordStrength.errors,
        }
      );
    }

    // ✅ Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email.toLowerCase() },
    });

    if (existingUser) {
      throwConflictError("Este email já está registrado");
    }

    // ✅ Hash password
    const passwordHash = await hashPassword(validatedData.password);

    // ✅ Create user in database
    const newUser = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email.toLowerCase(),
        passwordHash,
        targetCourse: validatedData.targetCourse,
      },
      select: {
        id: true,
        name: true,
        email: true,
        targetCourse: true,
        createdAt: true,
      },
    });

    // ✅ Create session (generate tokens and set cookies)
    const session = await createSession(newUser.id, newUser.email);

    // ✅ Return success response
    const response = successResponse(
      {
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          targetCourse: newUser.targetCourse,
        },
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
      },
      201
    );

    // ✅ Explicitly set cookies on the response object
    response.cookies.set("auth_token", session.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: parseInt(process.env.JWT_EXPIRATION || "86400"),
    });

    response.cookies.set("refresh_token", session.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: parseInt(process.env.REFRESH_TOKEN_EXPIRATION || "2592000"),
    });

    return response;
  } catch (error) {
    return handleError(error);
  }
}
