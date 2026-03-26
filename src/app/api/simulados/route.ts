import { NextRequest } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { handleError, successResponse, throwAuthenticationError } from "@/lib/api-error";

const DEFAULT_SIMULADOS = [
  { id: "sim-1", title: "ENEM 2024 - Mock 01", type: "Geral", questions: 5, time: "30min", diff: "Médio", xp: 2500, accent: "border-primary/50 text-primary" },
  { id: "sim-2", title: "FUVEST 1ª Fase 2024", type: "Completo", questions: 5, time: "45min", diff: "Difícil", xp: 3200, accent: "border-purple-500 text-purple-500" },
  { id: "sim-3", title: "Minisimulado: Exatas", type: "Pocket", questions: 5, time: "15min", diff: "Fácil", xp: 800, accent: "border-orange-500 text-orange-500" }
];

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) throwAuthenticationError();
    const userId = session.userId;

    const prisma = getPrisma();
    
    // Check user's mock exams
    const mockExams = await prisma.mockExam.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' }
    });

    const results = DEFAULT_SIMULADOS.map(sim => {
      const existing = mockExams.find(e => e.title === sim.title);
      if (existing) {
        return {
          ...sim,
          dbId: existing.id,
          status: existing.status, // IN_PROGRESS or COMPLETED
          score: existing.score
        };
      }
      return {
        ...sim,
        status: "AVAILABLE",
        score: null
      };
    });

    // Stats
    const completed = results.filter(r => r.status === "COMPLETED");
    const avgScore = completed.length > 0 
      ? completed.reduce((acc, r) => acc + (r.score || 0), 0) / completed.length 
      : 0;

    return successResponse({ 
      simulados: results,
      stats: {
        total: completed.length,
        avgScore: Math.round(avgScore)
      }
    }, 200);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
     const session = await getSession();
     if (!session) throwAuthenticationError();
     
     const body = await request.json();
     const { title, type } = body;

     const prisma = getPrisma();
     const exam = await prisma.mockExam.create({
       data: {
         userId: session.userId,
         title,
         type,
         status: "IN_PROGRESS"
       }
     });

     return successResponse({ exam }, 201);
  } catch (error) {
    return handleError(error);
  }
}
