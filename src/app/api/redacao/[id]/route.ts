import { NextRequest } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { handleError, successResponse, throwAuthenticationError, throwNotFoundError } from "@/lib/api-error";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getSession();
    if (!session) throwAuthenticationError();

    const prisma = getPrisma();
    const essay = await prisma.essay.findUnique({
      where: { id }
    });

    if (!essay || essay.userId !== session.userId) {
      throwNotFoundError("Redação não encontrada");
    }

    return successResponse({ essay }, 200);
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getSession();
    if (!session) throwAuthenticationError();

    const body = await request.json();
    const { content, submit } = body;
    
    const prisma = getPrisma();
    
    // Check if exists
    const existing = await prisma.essay.findUnique({ where: { id } });
    if (!existing || existing.userId !== session.userId) throwNotFoundError();

    let dataToUpdate: any = { content };

    if (submit) {
      dataToUpdate.status = "GRADED";
      // Simulate AI Score
      dataToUpdate.score = {
        competencia1: 180,
        competencia2: 200,
        competencia3: 160,
        competencia4: 200,
        competencia5: 180,
        total: 920
      };
      dataToUpdate.feedback = "Ótima redação! Seu domínio da norma culta foi excelente. Sugerimos apenas aprofundar a proposta de intervenção no próximo texto.";
      
      // Update XP
      await prisma.user.update({
        where: { id: session.userId },
        data: { xp: { increment: 1500 } } // Base XP for submitting an essay
      });
    }

    const essay = await prisma.essay.update({
      where: { id },
      data: dataToUpdate
    });

    return successResponse({ essay, message: submit ? "Redação enviada e corrigida pela IA!" : "Salvo como rascunho" }, 200);
  } catch (error) {
    return handleError(error);
  }
}
