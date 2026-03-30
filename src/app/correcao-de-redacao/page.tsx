import Link from "next/link";
import { PenTool, BrainCircuit, ArrowLeft, FileText, CheckCircle2, TrendingUp, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function CorrecaoDeRedacao() {
  return (
    <div className="min-h-screen bg-background flex flex-col py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-12 flex items-center justify-between border-b border-border/40 pb-6">
          <Link className="flex items-center font-bold text-2xl tracking-tight" href="/">
            <BrainCircuit className="h-6 w-6 mr-2 text-primary" />
            <span>Vestibul<span className="text-primary">AI</span></span>
          </Link>
          <Button variant="ghost" render={<Link href="/" />}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Início
          </Button>
        </div>

        <section className="mb-16 text-center">
          <Badge className="mb-4 bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-500/20">Correção Automatizada</Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
            Correção de Redação <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">Guiada por IA</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Envie sua redação e receba uma análise automatizada inspirada nas competências cobradas nos principais vestibulares, com feedback prático para revisão.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start mb-20">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-pink-500/20 rounded-3xl blur-2xl -z-10"></div>
            <div className="bg-card border border-border/50 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-16 w-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-[2px]">
                  <div className="h-full w-full bg-card rounded-full flex items-center justify-center">
                    <span className="font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">920</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold">Exemplo de relatório</h3>
                  <p className="text-sm text-muted-foreground">Referência de análise inspirada nos critérios do ENEM</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Avaliação por Competências</h4>
                {[
                  { name: "C1: Domínio da Norma Padrão", score: 160, desc: "Alguns desvios gramaticais pontuais." },
                  { name: "C2: Compreensão da Proposta", score: 200, desc: "Excelente abordagem do tema." },
                  { name: "C3: Argumentação", score: 160, desc: "Argumentos bons, mas faltou aprofundamento." },
                  { name: "C4: Coesão", score: 200, desc: "Uso impecável de conectivos." },
                  { name: "C5: Proposta de Intervenção", score: 200, desc: "Proposta completa (agente, ação, meio, finalidade e detalhamento)." }
                ].map((comp, i) => (
                  <div key={i} className="bg-muted/30 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-sm">{comp.name}</span>
                      <span className="font-bold text-primary">{comp.score}/200</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{comp.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-500/10 p-2 rounded-lg text-purple-500">
                  <FileText className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold">Como a IA avalia seu texto?</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-6">
                A análise combina critérios estruturais de redação, organização argumentativa, coesão textual e presença de proposta de intervenção.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-purple-500 shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Identifica erros gramaticais, de ortografia e concordância com precisão.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-purple-500 shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Avalia a estrutura argumentativa e o repertório sociocultural.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-purple-500 shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Verifica se os 5 elementos da proposta de intervenção estão presentes (para o padrão ENEM).</span>
                </li>
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-pink-500/10 p-2 rounded-lg text-pink-500">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold">Reescrita Inteligente</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Além de apontar os erros, a plataforma sugere melhorias estruturais para frases confusas, mostra sinônimos mais adequados e te ensina a melhorar a coesão do seu texto parágrafo por parágrafo.
              </p>
            </div>
            
            <Button size="lg" className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white gap-2 mt-4" render={<Link href="/register" />}>
              <PenTool className="h-4 w-4" />
              Enviar minha primeira redação
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
