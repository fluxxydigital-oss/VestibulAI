import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  BookOpen, 
  BrainCircuit, 
  Target, 
  PenTool, 
  Sparkles, 
  LineChart, 
  Zap, 
  CheckCircle2, 
  Star,
  Trophy,
  Clock
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[100dvh] overflow-x-hidden">
      {/* Navigation */}
      {/* Announcement Bar */}
      <div className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-2 px-4 text-center text-sm font-medium flex items-center justify-center gap-2 shadow-md z-50 relative">
        <Sparkles className="h-4 w-4 animate-pulse" />
        <span>Aproveite o bônus de lançamento: <strong className="font-bold text-white">7 dias grátis</strong> de plano adaptativo!</span>
        <ArrowRight className="h-3 w-3 ml-1" />
      </div>

      {/* Navigation */}
      <header className="px-4 lg:px-8 h-20 flex items-center border-b border-border/50 backdrop-blur-xl sticky top-0 z-50 bg-background/80 shadow-sm shadow-primary/10 transition-all duration-300">
        <Link className="flex items-center justify-center font-bold text-2xl tracking-tight group" href="#">
          <div className="bg-gradient-to-br from-primary/20 to-purple-500/20 p-2 rounded-xl mr-3 group-hover:scale-105 transition-transform border border-primary/20">
            <BrainCircuit className="h-6 w-6 text-primary" />
          </div>
          <span className="text-foreground">Vestibul<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 dark:from-blue-400 to-primary">AI</span></span>
        </Link>
        <nav className="hidden md:flex ml-10 gap-8">
          <Link className="text-base font-semibold text-foreground/90 hover:text-primary hover:underline underline-offset-4 decoration-primary/50 transition-all" href="#features">Recursos</Link>
          <Link className="text-base font-semibold text-foreground/90 hover:text-primary hover:underline underline-offset-4 decoration-primary/50 transition-all" href="#how-it-works">Como Funciona</Link>
          <Link className="text-base font-semibold text-foreground/90 hover:text-primary hover:underline underline-offset-4 decoration-primary/50 transition-all" href="#testimonials">Depoimentos</Link>
          <Link className="text-base font-semibold text-foreground/90 hover:text-primary hover:underline underline-offset-4 decoration-primary/50 transition-all" href="#faq">FAQ</Link>
        </nav>
        <div className="ml-auto flex gap-4 sm:gap-6 items-center">
          <ThemeToggle />
          <Link className="text-base font-semibold text-foreground/90 hover:text-primary transition-colors hidden sm:flex items-center" href="/login">
            Fazer Login
          </Link>
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-full blur opacity-50 group-hover:opacity-100 transition duration-500"></div>
            <Button size="default" className="relative rounded-full px-6 shadow-xl bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-all outline-none" render={<Link href="/register" />}>
              Começar Grátis
            </Button>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full pt-24 pb-20 md:pt-32 md:pb-32 lg:pt-40 lg:pb-32 flex items-center justify-center relative overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-20 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-blue-500 to-purple-600 blur-[100px] rounded-full mix-blend-screen" />
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-background to-transparent pointer-events-none" />
          
          <div className="container relative z-10 px-4 md:px-6">
            <div className="flex flex-col items-center space-y-10 text-center">
              
              <Badge variant="outline" className="px-4 py-1.5 rounded-full border-primary/30 bg-primary/5 text-primary backdrop-blur-sm shadow-sm gap-2">
                <Sparkles className="h-4 w-4" />
                <span>O futuro da preparação escolar chegou</span>
              </Badge>
              
              <div className="space-y-6 max-w-4xl mx-auto">
                <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
                  Sua aprovação moldada <br className="hidden md:block" /> pela <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-primary to-purple-500 animate-gradient">Inteligência Artificial</span>
                </h1>
                <p className="mx-auto max-w-[800px] text-muted-foreground md:text-xl lg:text-2xl leading-relaxed">
                  Pare de seguir cronogramas genéricos. O VestibulAI cria uma trilha de estudos adaptativa que evolui com você, corrigindo suas redações em segundos e focando nos seus pontos fracos.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto mt-8 items-center justify-center">
                <Button size="lg" className="h-14 px-10 text-lg group rounded-full shadow-xl shadow-primary/25 w-full sm:w-auto" render={<Link href="/register" />}>
                  Montar meu Cronograma Grátis
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1.5" />
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full w-full sm:w-auto border-muted-foreground/30 hover:bg-muted/50" render={<Link href="#how-it-works" />}>
                  Entenda como funciona
                </Button>
              </div>

            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-20 md:py-32 bg-slate-50/50 dark:bg-zinc-950/50 border-y border-border/50 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5 pointer-events-none"></div>
          <div className="container px-4 md:px-6 relative z-10 w-full max-w-7xl mx-auto">
            <div className="flex flex-col justify-center items-center space-y-4 text-center mb-16">
              <Badge variant="outline" className="border-primary/50 text-foreground bg-primary/10 px-4 py-1.5 animate-pulse text-sm">
                Plataforma All-in-One
              </Badge>
              <h2 className="text-3xl font-extrabold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/70">
                O ecossistema completo de aprovação
              </h2>
              <p className="max-w-[800px] mx-auto text-muted-foreground md:text-xl font-medium">
                Ferramentas de inteligência artificial que substituem cursinhos caros e otimizam cada minuto do seu tempo de estudo de forma cirúrgica.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
              
              {/* 1 - Trilha de Estudo */}
              <Card className="bg-background/80 backdrop-blur-sm border-border/50 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-500/10 overflow-hidden group text-center flex flex-col items-center p-8 relative">
                <div className="h-1 w-full absolute top-0 left-0 bg-gradient-to-r from-blue-500 to-cyan-400 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                <div className="absolute top-4 right-4 text-xs font-bold text-muted-foreground/30 user-select-none">01</div>
                <div className="h-20 w-20 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 text-blue-500 group-hover:scale-110 transition-transform duration-300 border border-blue-500/20 shadow-inner">
                  <Target className="h-10 w-10" />
                </div>
                <CardTitle className="text-2xl font-bold mb-4">Trilha de Estudo</CardTitle>
                <CardDescription className="text-base text-muted-foreground leading-relaxed">
                  A IA analisa suas horas livres, curso dos sonhos e desempenho em tempo real para recalcular seu cronograma todos os dias. Estude exatamente o que mais importa no momento certo.
                </CardDescription>
              </Card>
              
              {/* 2 - Correção de Redação IA */}
              <Card className="bg-background/80 backdrop-blur-sm border-border/50 hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-500/10 overflow-hidden group text-center flex flex-col items-center p-8 relative">
                <div className="h-1 w-full absolute top-0 left-0 bg-gradient-to-r from-purple-500 to-pink-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                <div className="absolute top-4 right-4 text-xs font-bold text-muted-foreground/30 user-select-none">02</div>
                <div className="h-20 w-20 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 text-purple-500 group-hover:scale-110 transition-transform duration-300 border border-purple-500/20 shadow-inner">
                  <PenTool className="h-10 w-10" />
                </div>
                <CardTitle className="text-2xl font-bold mb-4">Correção de Redação IA</CardTitle>
                <CardDescription className="text-base text-muted-foreground leading-relaxed">
                  Envie seu texto e receba uma análise automatizada pelas competências de redação, com observações práticas para revisar estrutura, coesão e proposta de intervenção.
                </CardDescription>
              </Card>

              {/* 3 - Simulados Reais */}
              <Card className="bg-background/80 backdrop-blur-sm border-border/50 hover:border-cyan-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-cyan-500/10 overflow-hidden group text-center flex flex-col items-center p-8 relative">
                <div className="h-1 w-full absolute top-0 left-0 bg-gradient-to-r from-cyan-500 to-teal-400 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                <div className="absolute top-4 right-4 text-xs font-bold text-muted-foreground/30 user-select-none">03</div>
                <div className="h-20 w-20 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-6 text-cyan-500 group-hover:scale-110 transition-transform duration-300 border border-cyan-500/20 shadow-inner">
                  <BrainCircuit className="h-10 w-10" />
                </div>
                <CardTitle className="text-2xl font-bold mb-4">Simulados Reais</CardTitle>
                <CardDescription className="text-base text-muted-foreground leading-relaxed">
                  Monte simulados com o banco atual de questões e acompanhe uma estimativa de desempenho inspirada na lógica de provas como o ENEM.
                </CardDescription>
              </Card>

              {/* 4 - Estudo Adaptativo */}
              <Card className="bg-background/80 backdrop-blur-sm border-border/50 hover:border-emerald-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-emerald-500/10 overflow-hidden group text-center flex flex-col items-center p-8 relative">
                <div className="h-1 w-full absolute top-0 left-0 bg-gradient-to-r from-emerald-500 to-green-400 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                <div className="absolute top-4 right-4 text-xs font-bold text-muted-foreground/30 user-select-none">04</div>
                <div className="h-20 w-20 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 text-emerald-500 group-hover:scale-110 transition-transform duration-300 border border-emerald-500/20 shadow-inner">
                  <LineChart className="h-10 w-10" />
                </div>
                <CardTitle className="text-2xl font-bold mb-4">Estudo Adaptativo</CardTitle>
                <CardDescription className="text-base text-muted-foreground leading-relaxed">
                  Enquanto você resolve as questões do banco, o algoritmo detecta padrões de micro-erros estruturais que você nem percebe e ajusta seus próximos exercícios automaticamente.
                </CardDescription>
              </Card>

              {/* 5 - Banco de Questões */}
              <Card className="bg-background/80 backdrop-blur-sm border-border/50 hover:border-orange-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-orange-500/10 overflow-hidden group text-center flex flex-col items-center p-8 relative">
                <div className="h-1 w-full absolute top-0 left-0 bg-gradient-to-r from-orange-500 to-yellow-400 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                <div className="absolute top-4 right-4 text-xs font-bold text-muted-foreground/30 user-select-none">05</div>
                <div className="h-20 w-20 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-6 text-orange-500 group-hover:scale-110 transition-transform duration-300 border border-orange-500/20 shadow-inner">
                  <BookOpen className="h-10 w-10" />
                </div>
                <CardTitle className="text-2xl font-bold mb-4">Banco de Questões</CardTitle>
                <CardDescription className="text-base text-muted-foreground leading-relaxed">
                  Acesse o banco de questões da plataforma com filtros por matéria, dificuldade e histórico de desempenho para revisar com mais foco.
                </CardDescription>
              </Card>
              
              {/* 6 - Dinâmica de Conquistas */}
              <Card className="bg-background/80 backdrop-blur-sm border-border/50 hover:border-rose-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-rose-500/10 overflow-hidden group text-center flex flex-col items-center p-8 relative">
                <div className="h-1 w-full absolute top-0 left-0 bg-gradient-to-r from-rose-500 to-red-400 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                <div className="absolute top-4 right-4 text-xs font-bold text-muted-foreground/30 user-select-none">06</div>
                <div className="h-20 w-20 rounded-2xl bg-rose-500/10 flex items-center justify-center mb-6 text-rose-500 group-hover:scale-110 transition-transform duration-300 border border-rose-500/20 shadow-inner">
                  <Trophy className="h-10 w-10" />
                </div>
                <CardTitle className="text-2xl font-bold mb-4">Dinâmica de Conquistas</CardTitle>
                <CardDescription className="text-base text-muted-foreground leading-relaxed">
                  Torne o estudo viciante. Ganhe experiência, suba de elo, desbloqueie conquistas e compare semanalmente seu desempenho real com estudantes dos mesmos concorridos cursos.
                </CardDescription>
              </Card>

            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="w-full py-20 md:py-32 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-primary/5 pointer-events-none"></div>
          <div className="container px-4 md:px-6 relative z-10 w-full max-w-7xl mx-auto">
            <div className="flex flex-col justify-center items-center text-center space-y-4 mb-16">
              <Badge variant="secondary" className="px-4 py-1.5 text-sm font-medium">O Processo</Badge>
              <h2 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/80">
                Como a mágica acontece
              </h2>
              <p className="max-w-[800px] mx-auto text-muted-foreground md:text-xl font-medium">
                Três passos simples para iniciar uma jornada de estudos desenhada cirurgicamente para a sua rotina e seus objetivos.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
              {/* Passo 1 */}
              <div className="bg-background/80 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 rounded-3xl p-8 lg:p-10 flex flex-col items-center text-center group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary font-bold text-2xl mb-6 shadow-inner group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 relative z-10">
                  1
                </div>
                <h3 className="text-2xl font-bold mb-4 relative z-10">Defina sua meta e rotina</h3>
                <p className="text-base text-muted-foreground leading-relaxed relative z-10">
                  Conte para a IA qual curso você quer, em qual universidade e quantas horas por dia (ou por semana) você consegue estudar.
                </p>
              </div>
              
              {/* Passo 2 */}
              <div className="bg-background/80 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 rounded-3xl p-8 lg:p-10 flex flex-col items-center text-center group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary font-bold text-2xl mb-6 shadow-inner group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 relative z-10">
                  2
                </div>
                <h3 className="text-2xl font-bold mb-4 relative z-10">Receba seu plano dinâmico</h3>
                <p className="text-base text-muted-foreground leading-relaxed relative z-10">
                  O sistema distribui as matérias baseado nos pesos do seu curso. Ele te dirá exatamente o que estudar, quando e por quanto tempo.
                </p>
              </div>
              
              {/* Passo 3 */}
              <div className="bg-background/80 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 rounded-3xl p-8 lg:p-10 flex flex-col items-center text-center group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary font-bold text-2xl mb-6 shadow-inner group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 relative z-10">
                  3
                </div>
                <h3 className="text-2xl font-bold mb-4 relative z-10">Pratique e evolua</h3>
                <p className="text-base text-muted-foreground leading-relaxed relative z-10">
                  Interaja com a plataforma resolvendo baterias de exercícios e redações. Conforme seus resultados, a IA recalibra o plano do dia seguinte.
                </p>
              </div>
            </div>
            
            {/* Elemento Visual Centralizado */}
            <div className="flex justify-center items-center w-full max-w-4xl mx-auto relative group mt-12 md:mt-24">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 via-purple-500/10 to-blue-500/30 rounded-3xl blur-3xl opacity-50 group-hover:opacity-80 transition-opacity duration-500" />
              <Card className="relative z-10 w-full border-border/50 bg-background/95 backdrop-blur-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden rounded-3xl group-hover:shadow-[0_20px_60px_-15px_rgba(var(--primary),0.2)] transition-all duration-500">
                <CardHeader className="bg-muted/30 border-b border-border/50 pb-5 pt-5 px-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                  </div>
                  <CardTitle className="mt-6 text-lg font-bold flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <span className="text-2xl">Plano Adaptativo de Hoje</span>
                    <Badge variant="outline" className="text-sm font-medium py-1 px-3 bg-background shadow-sm">Sexta-feira</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 md:p-8 space-y-6">
                  <div className="p-5 md:p-6 rounded-2xl border border-primary/20 bg-primary/5 flex items-start flex-col md:flex-row gap-5 hover:bg-primary/10 transition-colors">
                    <div className="bg-primary/20 p-3 rounded-xl text-primary mt-1 shadow-sm">
                      <BookOpen className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xl md:text-2xl">História: Era Vargas</h4>
                      <p className="text-base text-muted-foreground mt-2 font-medium">Revisão teórica interativa + Bateria de 15 exercícios ENEM inéditos</p>
                      <div className="flex items-center gap-2 mt-4 text-sm font-bold text-primary bg-primary/10 w-fit px-3 py-1.5 rounded-md">
                        <Clock className="h-4 w-4" /> 60 minutos
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-5 md:p-6 rounded-2xl border border-border bg-muted/20 flex items-start flex-col md:flex-row gap-5 opacity-80 hover:opacity-100 transition-opacity">
                    <div className="bg-muted p-3 rounded-xl text-muted-foreground mt-1 shadow-sm">
                      <PenTool className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xl md:text-2xl text-foreground/90">Redação</h4>
                      <p className="text-base text-muted-foreground mt-2 font-medium">Tema: Caminhos para combater a desinformação no Brasil</p>
                      <div className="flex items-center gap-2 mt-4 text-sm font-bold w-fit px-3 py-1.5 rounded-md bg-muted/50 text-muted-foreground">
                        <Clock className="h-4 w-4" /> 90 minutos
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="w-full py-20 md:py-32 bg-slate-50/50 dark:bg-zinc-950/50 border-t border-border/50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center text-center mb-16">
              <h2 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/80">Quem usou, aprovou.</h2>
              <p className="mt-4 text-muted-foreground md:text-xl font-medium max-w-[800px]">Histórias reais de estudantes que transformaram sua preparação com o VestibulAI.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                {
                  name: "Mariana Souza",
                  body: "O VestibulAI mudou meu jogo. Eu trabalhava de tarde e só tinha a noite para estudar. A IA calculou certinho meu tempo e consegui focar só no que eu errava de Exatas."
                },
                {
                  name: "Pedro Alves",
                  body: "A correção de redação é surreal de rápida e assertiva. Receber feedback imediato da competência 3 me fez pular de 760 para 940 em duas semanas treinando."
                },
                {
                  name: "Julia Costa",
                  body: "Nunca mais perdi 3 horas do meu domingo montando cronogramas no Excel que eu furava na terça. A plataforma recalcula quando eu atraso. É meu mentor particular."
                }
              ].map((testimonial, i) => (
                <Card key={i} className="bg-background/80 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 rounded-3xl p-8 lg:p-10 flex flex-col items-center justify-center text-center relative group overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <CardHeader className="p-0 pb-6 flex flex-col items-center justify-center relative z-10 w-full">
                    <CardTitle className="text-2xl font-bold text-foreground">{testimonial.name}</CardTitle>
                    <div className="w-12 h-1 bg-primary/20 mt-4 rounded-full group-hover:bg-primary/50 transition-colors duration-300"></div>
                  </CardHeader>
                  <CardContent className="p-0 flex-grow flex items-center justify-center relative z-10 w-full">
                    <p className="text-foreground/90 dark:text-zinc-100/90 text-xl font-medium leading-relaxed italic text-center w-full">"{testimonial.body}"</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="w-full py-20 md:py-32">
          <div className="container px-4 md:px-6 max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Perguntas Frequentes</h2>
              <p className="mt-4 text-muted-foreground md:text-lg">Tire suas dúvidas e comece hoje mesmo.</p>
            </div>
            
            <Accordion className="w-full text-left">
              <AccordionItem value="item-1" className="border-border/50">
                <AccordionTrigger className="text-lg hover:text-primary transition-colors">A IA substitui um cursinho presencial?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                  Para muitos alunos, sim! O VestibulAI foca no tripé da aprovação: resolução massiva de exercícios direcionados, autocorreção através de dados (análise de erros) e prática de redação com feedback rápido. É a forma mais eficiente de estudar ativa e autonomamente.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="border-border/50">
                <AccordionTrigger className="text-lg hover:text-primary transition-colors">Como funciona a correção de redação?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                  Utilizamos modelos avançados de linguagem treinados especificamente com as cartilhas oficiais do ENEM e manuais das estaduais (como UERJ / FUVEST). A IA analisa seu texto baseando-se nas 5 competências, detecta falhas estruturais, de coesão, gramaticais e de projeto de texto, retornando uma nota e dicas práticas de melhoria.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="border-border/50">
                <AccordionTrigger className="text-lg hover:text-primary transition-colors">O que acontece se eu não conseguir cumprir o cronograma do dia?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                  O cronograma do VestibulAI é "vivo". Se você não conseguir estudar um dia, basta marcar no sistema. A Inteligência Artificial irá recalcular o peso das matérias e reagendar os conteúdos prioritários para os próximos dias, sem que você precise reorganizar nada manualmente.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4" className="border-border/50">
                <AccordionTrigger className="text-lg hover:text-primary transition-colors">Tem material teórico (videoaulas ou PDFs)?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                  A filosofia principal da plataforma é o **estudo ativo** (questões e prática). Fornecemos resumos teóricos direto ao ponto integrados às resoluções de questões, criados por IA, para que você tire dúvidas imediatamente após errar um exercício. Para conteúdos muito extensos, recomendamos buscar a teoria pontualmente e voltar para praticar conosco.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-20 md:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 dark:bg-primary/10"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[300px] bg-primary/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none"></div>
          
          <div className="container mx-auto relative z-10 px-4 md:px-6 flex flex-col items-center justify-center text-center">
            <h2 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl mb-6 text-foreground">
              Pronto para hackear sua aprovação?
            </h2>
            <p className="max-w-[700px] mx-auto text-foreground/90 dark:text-zinc-100/90 text-lg sm:text-xl md:text-2xl font-medium mb-10 leading-relaxed">
              Crie sua conta gratuitamente em menos de 1 minuto. Responda 3 perguntas e ganhe seu primeiro cronograma otimizado na hora.
            </p>
            <div className="flex flex-col items-center">
              <Button size="lg" className="h-14 px-10 text-lg rounded-full shadow-xl shadow-primary/20 hover:scale-105 transition-transform" render={<Link href="/register" />}>
                Criar minha conta agora <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      {/* Expanded Footer */}
      <footer className="w-full bg-background border-t border-border/40 pb-8 pt-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between gap-12 mb-16">
            <div className="w-full md:w-1/3">
              <Link className="flex items-center font-bold text-xl tracking-tight mb-4" href="#">
                <BrainCircuit className="h-5 w-5 mr-2 text-primary" />
                <span>Vestibul<span className="text-primary">AI</span></span>
              </Link>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                Elevando o potencial humano na educação através da fronteira da Inteligência Artificial.
              </p>
            </div>
            
            <div className="w-full md:w-2/3 grid grid-cols-2 gap-8 md:pl-16">
              <div>
                <h3 className="font-semibold mb-4">Plataforma</h3>
                <ul className="space-y-3">
                  <li><Link href="#features" className="text-sm text-muted-foreground hover:text-primary transition-colors">Recursos</Link></li>
                  <li><Link href="/planos" className="text-sm text-muted-foreground hover:text-primary transition-colors">Planos e Preços</Link></li>
                  <li><Link href="/banco-de-questoes" className="text-sm text-muted-foreground hover:text-primary transition-colors">Banco de Questões</Link></li>
                  <li><Link href="/correcao-de-redacao" className="text-sm text-muted-foreground hover:text-primary transition-colors">Correção de Redação</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Legal</h3>
                <ul className="space-y-3">
                  <li><Link href="/termos-de-uso" className="text-sm text-muted-foreground hover:text-primary transition-colors">Termos de Uso</Link></li>
                  <li><Link href="/politica-de-privacidade" className="text-sm text-muted-foreground hover:text-primary transition-colors">Política de Privacidade</Link></li>
                  <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Fale Conosco</Link></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border/40 pt-8 flex items-center justify-center">
            <p className="text-sm text-muted-foreground w-full text-center">
              &copy; {new Date().getFullYear()} VestibulAI Technologies. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
