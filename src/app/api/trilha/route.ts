import { NextRequest } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { handleError, successResponse, throwAuthenticationError } from "@/lib/api-error";

/**
 * GET /api/trilha
 * Retorna a trilha de estudos (StudyPlan) do usuário logado.
 * Se o usuário não tiver uma trilha, gera uma básica padrão (Mock AI).
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      throwAuthenticationError("Não autorizado");
    }

    const prisma = getPrisma();
    const userId = session.userId;

    // 1. Busca a trilha existente
    let trilha = await prisma.studyPlan.findMany({
      where: { userId },
      orderBy: { date: 'asc' },
      include: {
        subject: {
          select: { name: true }
        }
      }
    });

    // 2. Se não existir, gera uma trilha inicial (Simulando a IA)
    if (trilha.length === 0) {
      // Busca a matéria de Matemática e Português para criar a trilha
      const math = await prisma.subject.findUnique({ where: { name: 'Matemática' } });
      const port = await prisma.subject.findUnique({ where: { name: 'Português' } });

      if (math && port) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        await prisma.studyPlan.createMany({
          data: [
            {
              userId,
              subjectId: math.id,
              title: "Fundamentos de Matemática",
              type: "intro",
              xpReward: 100,
              date: today,
              durationMin: 60,
              status: "COMPLETED"
            },
            {
              userId,
              subjectId: math.id,
              title: "Funções e Gráficos",
              type: "lesson",
              xpReward: 150,
              date: today,
              durationMin: 90,
              status: "PENDING"
            },
            {
              userId,
              subjectId: port.id,
              title: "Interpretação de Texto Avançada",
              type: "lesson",
              xpReward: 200,
              date: tomorrow,
              durationMin: 60,
              status: "PENDING"
            },
            {
              userId,
              subjectId: math.id,
              title: "Desafio Semanal: Lógica",
              type: "boss",
              xpReward: 500,
              date: tomorrow,
              durationMin: 120,
              status: "PENDING"
            }
          ]
        });

    // Busca novamente após criar
        trilha = await prisma.studyPlan.findMany({
          where: { userId },
          orderBy: { date: 'asc' },
          include: {
            subject: { select: { name: true, id: true } }
          }
        });
      }
    }

    // 3. Busca o progresso real do usuário para o "Raio-X da IA"
    const userProgress = await prisma.userProgress.findMany({
      where: { userId },
      include: {
        subject: { select: { name: true, id: true } }
      }
    });

    return successResponse({ trilha, progress: userProgress }, 200);
  } catch (error) {
    return handleError(error);
  }
}
