import { NextRequest } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { handleError, successResponse, throwAuthenticationError } from "@/lib/api-error";

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) throwAuthenticationError();

    const body = await request.json();
    const { name, phone, birthDate, targetCourse, dailyStudyHours, image } = body;

    const prisma = getPrisma();
    
    // Convert logic if needed
    const hours = dailyStudyHours ? parseFloat(dailyStudyHours) : undefined;

    const updatedUser = await prisma.user.update({
      where: { id: session.userId },
      data: {
        ...(name && { name }),
        ...(targetCourse && { targetCourse }),
        ...(hours !== undefined && { dailyStudyHours: hours }),
        ...(phone && { phone }),
        ...(birthDate && { birthDate }),
        ...(image !== undefined && { image })
      }
    });

    return successResponse({
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        targetCourse: updatedUser.targetCourse,
        dailyStudyHours: updatedUser.dailyStudyHours,
        phone: updatedUser.phone,
        birthDate: updatedUser.birthDate,
        image: updatedUser.image,
        plan: updatedUser.plan,
        xp: updatedUser.xp,
      },
      message: "Perfil atualizado com sucesso!"
    }, 200);

  } catch (error) {
    return handleError(error);
  }
}
