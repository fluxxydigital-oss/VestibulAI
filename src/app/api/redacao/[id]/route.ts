import { NextRequest } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { handleError, successResponse, throwAuthenticationError, throwNotFoundError } from "@/lib/api-error";

const CONNECTORS = ["portanto", "contudo", "além disso", "entretanto", "assim", "desse modo", "logo", "todavia", "por fim", "ademais"];
const INTERVENTION_TERMS = ["governo", "escola", "sociedade", "família", "políticas públicas", "campanhas", "educação", "mídia", "comunidade"];

function toEnemBand(value: number) {
  if (value >= 180) return 200;
  if (value >= 140) return 160;
  if (value >= 100) return 120;
  if (value >= 60) return 80;
  if (value >= 20) return 40;
  return 0;
}

function analyzeEssay(theme: string, content: string) {
  const normalized = content.trim();
  const lower = normalized.toLowerCase();
  const words = normalized.split(/\s+/).filter(Boolean);
  const paragraphs = normalized.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length || 1;
  const sentences = normalized.split(/[.!?]+/).filter((s) => s.trim().length > 0).length || 1;
  const averageSentenceLength = words.length / Math.max(sentences, 1);

  const connectorsUsed = CONNECTORS.filter((term) => lower.includes(term));
  const interventionUsed = INTERVENTION_TERMS.filter((term) => lower.includes(term));
  const themeKeywords = theme.toLowerCase().split(/\W+/).filter((word) => word.length > 3);
  const themeMatches = themeKeywords.filter((word) => lower.includes(word)).length;

  let c1Base = 70;
  if (words.length >= 160) c1Base += 40;
  if (words.length >= 220) c1Base += 20;
  if (averageSentenceLength >= 8 && averageSentenceLength <= 28) c1Base += 25;
  if (/[,:;]/.test(normalized)) c1Base += 15;

  let c2Base = 60 + Math.min(themeMatches * 25, 90);
  if (paragraphs >= 4) c2Base += 25;

  let c3Base = 60;
  if (paragraphs >= 3) c3Base += 35;
  if (words.length >= 180) c3Base += 25;
  if (connectorsUsed.length >= 2) c3Base += 20;

  let c4Base = 50 + Math.min(connectorsUsed.length * 30, 90);
  if (paragraphs >= 4) c4Base += 20;

  let c5Base = 40;
  if (/(deve|precisa|é necessário|é fundamental)/.test(lower)) c5Base += 35;
  if (interventionUsed.length >= 2) c5Base += 55;
  if (/(governo|escola|sociedade|família).*(deve|precisa|promover|garantir)/.test(lower)) c5Base += 35;

  const c1 = toEnemBand(c1Base);
  const c2 = toEnemBand(c2Base);
  const c3 = toEnemBand(c3Base);
  const c4 = toEnemBand(c4Base);
  const c5 = toEnemBand(c5Base);
  const total = c1 + c2 + c3 + c4 + c5;

  const strengths: string[] = [];
  const improvements: string[] = [];

  if (c1 >= 160) strengths.push("bom domínio da norma padrão");
  else improvements.push("revisar ortografia, pontuação e clareza frasal");

  if (c3 >= 160) strengths.push("boa organização argumentativa");
  else improvements.push("aprofundar a defesa dos argumentos com mais repertório e exemplos");

  if (c5 >= 160) strengths.push("proposta de intervenção consistente");
  else improvements.push("detalhar melhor quem executa, como e com qual finalidade a intervenção");

  const feedback = [
    `Texto analisado com ${words.length} palavras e ${paragraphs} parágrafo(s).`,
    strengths.length > 0 ? `Pontos fortes: ${strengths.join(", ")}.` : "Ainda há espaço para fortalecer a estrutura global do texto.",
    improvements.length > 0 ? `Próximos ajustes: ${improvements.join("; ")}.` : "O texto está consistente nos principais critérios avaliados.",
  ].join(" ");

  return {
    score: { c1, c2, c3, c4, c5, total, words: words.length, paragraphs },
    feedback,
  };
}

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
    const existing = await prisma.essay.findUnique({ where: { id } });
    if (!existing || existing.userId !== session.userId) throwNotFoundError();

    const dataToUpdate: any = { content };

    if (submit) {
      const analysis = analyzeEssay(existing.theme, content || "");
      dataToUpdate.status = "GRADED";
      dataToUpdate.score = analysis.score;
      dataToUpdate.feedback = analysis.feedback;

      await prisma.user.update({
        where: { id: session.userId },
        data: { xp: { increment: Math.max(200, Math.round(analysis.score.total * 0.35)) } }
      });
    }

    const essay = await prisma.essay.update({
      where: { id },
      data: dataToUpdate
    });

    return successResponse({ essay, message: submit ? "Redação enviada para correção automatizada." : "Rascunho salvo com sucesso." }, 200);
  } catch (error) {
    return handleError(error);
  }
}
