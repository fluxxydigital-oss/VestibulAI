import { NextRequest } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { handleError, successResponse, throwAuthenticationError } from "@/lib/api-error";

const PREDEFINED_THEMES = [
  { id: "theme-1", title: "Inteligência Artificial na Educação do Século XXI", tag: "Tecnologia", xp: 1500, deadline: "Hoje" },
  { id: "theme-2", title: "Os desafios da saúde mental entre jovens brasileiros", tag: "Sociedade", xp: 1200, deadline: "2 dias" },
  { id: "theme-3", title: "Segurança alimentar e a crise hídrica", tag: "Meio Ambiente", xp: 1800, deadline: "Finalizada" },
  { id: "theme-4", title: "A importância do voto consciente para a democracia", tag: "Política", xp: 1100, deadline: "5 dias" }
];

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) throwAuthenticationError();
    const userId = session.userId;

    const prisma = getPrisma();
    const essays = await prisma.essay.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' }
    });

    return successResponse({ 
      essays,
      suggestions: PREDEFINED_THEMES 
    }, 200);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) throwAuthenticationError();
    const userId = session.userId;

    const body = await request.json();
    const { theme } = body;

    if (!theme) {
      return new Response(JSON.stringify({ error: "Tema é obrigatório" }), { status: 400 });
    }

    const prisma = getPrisma();
    const essay = await prisma.essay.create({
      data: {
        userId,
        theme,
        content: "",
        status: "DRAFT"
      }
    });

    return successResponse({ essay }, 201);
  } catch (error) {
    return handleError(error);
  }
}
