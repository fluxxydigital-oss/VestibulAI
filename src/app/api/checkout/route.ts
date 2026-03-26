import { NextRequest } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { handleError, successResponse, throwAuthenticationError } from "@/lib/api-error";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) throwAuthenticationError();

    const body = await request.json();
    const { planName } = body;

    const prisma = getPrisma();
    
    // For MVP: instantly upgrade user to PRO
    // Real implementation would create Stripe checkout session and return URL
    const updatedUser = await prisma.user.update({
      where: { id: session.userId },
      data: {
        plan: "PRO" // "PREMIUM", etc based on planName
      }
    });

    return successResponse({ 
      user: {
        plan: updatedUser.plan
      },
      message: "Assinatura ativada com sucesso!" 
    }, 200);

  } catch (error) {
    return handleError(error);
  }
}
