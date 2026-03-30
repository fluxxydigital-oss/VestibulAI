import { NextRequest } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { handleError, successResponse, throwAuthenticationError } from "@/lib/api-error";

const CURATED_THEMES = [
  { id: "theme-1", title: "Caminhos para ampliar o cuidado com a saúde mental de jovens no Brasil", tag: "Sociedade", xp: 900 },
  { id: "theme-2", title: "Desafios para o uso ético da inteligência artificial na educação", tag: "Tecnologia", xp: 950 },
  { id: "theme-3", title: "Segurança alimentar e os impactos das mudanças climáticas", tag: "Meio Ambiente", xp: 1000 },
  { id: "theme-4", title: "Participação cidadã e fortalecimento da democracia brasileira", tag: "Política", xp: 920 }
];

function formatSuggestionWindow(offset: number) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return `até ${date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}`;
}

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

    const suggestions = CURATED_THEMES.map((theme, index) => ({
      ...theme,
      deadline: formatSuggestionWindow((index + 1) * 2),
    }));

    return successResponse({ 
      essays,
      suggestions
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
