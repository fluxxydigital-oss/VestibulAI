import { NextRequest } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { handleError, successResponse } from "@/lib/api-error";

/**
 * GET /api/materias
 * Retorna as matérias disponíveis e o progresso do usuário nelas.
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    const userId = session?.userId;
    const prisma = getPrisma();

    // Busca todas as matérias
    const subjects = await prisma.subject.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { questions: true } }
      }
    });

    const progressMap: Record<string, any> = {};

    if (userId) {
      // Busca progresso do usuário se logado
      const userProgress = await prisma.userProgress.findMany({
        where: { userId }
      });
      userProgress.forEach(p => {
        progressMap[p.subjectId] = {
          questionsAnswered: p.questionsAnswered,
          correctAnswers: p.correctAnswers,
          estimatedLevel: p.estimatedLevel,
          lastActivityAt: p.lastActivityAt
        };
      });
    }

    // Mescla dados
    const result = subjects.map(s => {
      const prog = progressMap[s.id] || { questionsAnswered: 0, correctAnswers: 0, estimatedLevel: 1.0 };
      // Calcula uma % de progresso rigorosa baseada em acertos gerais
      let progressPercent = 0;
      if (prog.questionsAnswered > 0) {
         progressPercent = Math.min(Math.round((prog.correctAnswers / prog.questionsAnswered) * 100), 100);
      }
      let area = "Exatas";
      if (['História', 'Geografia', 'Filosofia', 'Sociologia'].includes(s.name)) area = "Humanas";
      if (['Português', 'Inglês', 'Espanhol', 'Literatura'].includes(s.name)) area = "Linguagens";
      if (['Biologia'].includes(s.name)) area = "Biológicas";

      return {
        id: s.id,
        name: s.name,
        description: s.description,
        area,
        progress: progressPercent,
        lessons: s._count?.questions || 0, // Contagem real
        lastActivity: prog.lastActivityAt || null
      };
    });

    return successResponse({ materias: result }, 200);
  } catch (error) {
    return handleError(error);
  }
}
