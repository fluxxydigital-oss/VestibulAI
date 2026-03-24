import Link from "next/link";
import { BookOpen, BrainCircuit, ArrowLeft, CheckCircle2, Search, Filter, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function BancoDeQuestoes() {
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
          <Badge className="mb-4">Mais de 150.000 questões</Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
            O Maior e Mais Inteligente <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-400">Banco de Questões</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Esqueça as plataformas de questões desatualizadas. O VestibulAI oferece um acervo imenso, constantemente atualizado e com resoluções guiadas por Inteligência Artificial passo a passo.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="h-12 w-12 shrink-0 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                <Search className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Busca Inteligente</h3>
                <p className="text-muted-foreground">Busque questões não apenas por assunto ou banca, mas digitando o que você lembra do enunciado. Nossa busca semântica encontra exatamente o que você precisa.</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="h-12 w-12 shrink-0 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                <Filter className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Filtro de Dificuldade TRI</h3>
                <p className="text-muted-foreground">Filtre questões pelo nível de dificuldade real baseado na Teoria de Resposta ao Item, treinando a sua estratégia de prova com exatidão.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="h-12 w-12 shrink-0 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                <PlayCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Resolução em Vídeo e Texto</h3>
                <p className="text-muted-foreground">Não entendeu o gabarito? A nossa IA atua como uma tutora, desmembrando a resolução da questão linha por linha e tirando suas dúvidas no chat da questão.</p>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 to-yellow-400/20 rounded-3xl blur-2xl -z-10"></div>
            <div className="bg-card border border-border/50 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="bg-orange-500/10 text-orange-500 hover:bg-orange-500/20">Física</Badge>
                  <span className="text-sm text-muted-foreground">ENEM 2023</span>
                </div>
                <BookOpen className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-lg font-medium mb-6 leading-relaxed text-foreground">
                (ENEM 2023) Em uma indústria, há um reservatório de água com capacidade de...
              </p>
              <div className="space-y-3 mb-6">
                {['a) 150 litros', 'b) 200 litros', 'c) 250 litros', 'd) 300 litros', 'e) 350 litros'].map((alt, i) => (
                  <div key={i} className={`p-4 rounded-xl border flex items-center gap-3 transition-colors cursor-pointer ${i === 2 ? 'bg-green-500/10 border-green-500/50 text-green-600 dark:text-green-400 font-medium' : 'bg-background hover:bg-muted/50 border-border'}`}>
                    <div className={`h-5 w-5 rounded-full border flex items-center justify-center shrink-0 ${i === 2 ? 'border-green-500 bg-green-500 text-white' : 'border-muted-foreground'}`}>
                      {i === 2 && <CheckCircle2 className="h-3 w-3" />}
                    </div>
                    {alt}
                  </div>
                ))}
              </div>
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white gap-2" render={<Link href="/register" />}>
                <BrainCircuit className="h-4 w-4" />
                Pedir Explicação à IA
              </Button>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-6">Pronto para dominar os exames?</h2>
          <Button size="lg" className="rounded-full px-8 gap-2" render={<Link href="/register" />}>
            Comece a praticar grátis
            <ArrowLeft className="h-4 w-4 rotate-180" />
          </Button>
        </div>

      </div>
    </div>
  );
}
