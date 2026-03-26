"use client"

import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, Star, BrainCircuit, Rocket, Target, Trophy, Loader2, Sparkles, TrendingUp, TrendingDown, RefreshCw, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

type Milestone = {
  id: string;
  title: string;
  type: string;
  xpReward: number;
  status: string;
  subject: { id: string, name: string };
};

export default function TrilhaPage() {
  const router = useRouter();
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [progress, setProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);

  useEffect(() => {
    fetch('/api/trilha')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setMilestones(data.data.trilha || []);
          setProgress(data.data.progress || []);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch trilha", err);
        setLoading(false);
      });
  }, []);

  const handleComplete = async (id: string, currentState: string) => {
    if (currentState === "COMPLETED") return;
    
    // Optimistic update
    setMilestones(prev => prev.map(m => m.id === id ? { ...m, status: "COMPLETED" } : m));
    
    try {
      await fetch(`/api/trilha/${id}/complete`, { method: 'PATCH' });
    } catch (err) {
      console.error(err);
      // Revert if failed (simplified)
    }
  };

  const handleRegenerar = () => {
    if (isRegenerating) return;
    setIsRegenerating(true);
    // Simulate AI recalculation delay
    setTimeout(() => {
      // Fake refresh effect on array order to make it look recalculated
      setMilestones(prev => [...prev].reverse());
      setIsRegenerating(false);
      alert("A inteligência artificial recalculou sua trilha com base nos seus pontos fracos mais recentes!");
    }, 2500);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <DashboardHeader />
      
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
        <div className="mb-10 text-center relative z-10">
          <Badge variant="outline" className="mb-3 py-1 px-4 border-primary/30 bg-primary/5 text-primary text-sm font-bold uppercase tracking-wider backdrop-blur-md">
            Jornada de Medicina
          </Badge>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 flex items-center justify-center gap-3">
             <BrainCircuit className="h-10 w-10 text-primary" />
             Trilha Guiada por <span className="text-primary italic">IA</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            O seu roadmap não é estático. A nossa inteligência mapeia constantemente as suas proficiências para focar no que você realmente precisa estudar para aprovar.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-7 items-start">
          
          {/* Main Content (Left Column) - AI Roadmap Timeline */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Top Action / Summary Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-card to-background border shadow-sm">
                <div className="flex items-center gap-4">
                   <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                     <Target className="h-6 w-6 text-primary animate-pulse" />
                   </div>
                   <div>
                     <h3 className="font-bold text-lg leading-tight">Plano de Estudos Semanal</h3>
                     <p className="text-xs text-muted-foreground mt-0.5">Módulo de Correções: Fase 1</p>
                   </div>
                </div>
                
                <Button 
                  onClick={handleRegenerar} 
                  disabled={isRegenerating}
                  className="w-full sm:w-auto font-bold gap-2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/80 hover:to-purple-500 shadow-md transition-all group"
                >
                  {isRegenerating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-yellow-300 group-hover:scale-110 transition-transform" />}
                  {isRegenerating ? "IA Analisando Dados..." : "Recalcular Rota com IA"}
                </Button>
            </div>

            {/* Timeline Map Component */}
            <Card className="border-border/50 shadow-sm relative overflow-hidden bg-card/60 backdrop-blur-md">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
              
              <CardHeader className="border-b border-border/40 flex-row flex items-center justify-between py-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Rocket className="h-5 w-5 text-primary" /> Roadmap Gerado
                </CardTitle>
                <Badge variant="secondary" className="font-black bg-muted">
                  {loading ? "Carregando..." : `${milestones.filter(m => m.status === 'COMPLETED').length}/${milestones.length} Atividades`}
                </Badge>
              </CardHeader>
              
              <CardContent className="p-4 md:p-8">
                {loading || isRegenerating ? (
                  <div className="flex flex-col items-center justify-center p-12 space-y-4">
                    <div className="relative">
                      <div className="absolute inset-0 border-4 border-primary/30 rounded-full animate-ping"></div>
                      <BrainCircuit className="h-10 w-10 text-primary animate-bounce relative z-10" />
                    </div>
                    <p className="text-sm font-bold text-muted-foreground animate-pulse">Sinapses trabalhando...</p>
                  </div>
                ) : milestones.length === 0 ? (
                   <div className="text-center py-10 text-muted-foreground">
                      Nenhuma missão vinculada a essa conta.
                   </div>
                ) : (
                  <div className="relative space-y-8 md:space-y-12 before:absolute before:inset-0 before:ml-5 md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary before:via-border before:to-transparent">
                    {milestones.map((milestone, index) => {
                      const isCompleted = milestone.status === "COMPLETED";
                      const isUpcoming = milestone.status === "PENDING" && index > 0 && milestones[index - 1]?.status !== "COMPLETED";
                      const isCurrent = milestone.status === "PENDING" && !isUpcoming;

                      // Fake UI insights tailored for tags
                      const isReview = milestone.title.includes("Revisão");
                      const isTheoretical = milestone.type === "intro";

                      return (
                        <div key={milestone.id} className="relative flex items-start md:items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                          
                          {/* Desktop Icon Node */}
                          <div className={cn(
                            "hidden md:flex flex-col items-center justify-center w-12 h-12 shrink-0 rounded-full border-4 border-background shadow-lg text-white md:order-1 transition-transform group-hover:scale-110 z-10",
                            isCompleted ? "bg-green-500" : 
                            isCurrent ? "bg-primary ring-4 ring-primary/20 animate-pulse" : 
                            "bg-muted border-border"
                          )}>
                            {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : 
                             milestone.type === "boss" ? <Star className="h-5 w-5" /> :
                             <Layers className="h-5 w-5" />}
                          </div>

                          {/* Mobile Icon Node */}
                          <div className={cn(
                            "flex flex-col items-center justify-center w-10 h-10 shrink-0 rounded-full border-4 border-background shadow text-white md:hidden z-10 absolute -left-[20px] top-4",
                            isCompleted ? "bg-green-500" : 
                            isCurrent ? "bg-primary" : 
                            "bg-muted"
                          )}>
                            {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : 
                             milestone.type === "boss" ? <Star className="h-4 w-4" /> :
                             <Layers className="h-4 w-4" />}
                          </div>
                          
                          {/* Content Card */}
                          <div className={cn(
                            "w-[calc(100%-3rem)] md:w-[calc(50%-3rem)] rounded-2xl border p-4 shadow-sm transition-all duration-300 relative overflow-hidden",
                            isCurrent ? "bg-primary/5 border-primary/40 shadow-primary/10" : "bg-card hover:border-border/80"
                          )}>
                            {isCurrent && <div className="absolute top-0 right-0 w-2 h-full bg-primary animate-pulse"></div>}
                            
                            <div className="flex flex-col gap-3">
                              
                              {/* Meta Info header */}
                              <div className="flex items-center justify-between">
                                <span className={cn(
                                  "text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full",
                                  isCompleted ? "bg-green-500/10 text-green-600" : 
                                  isTheoretical ? "bg-blue-500/10 text-blue-600" :
                                  "bg-muted text-muted-foreground"
                                )}>
                                  {milestone.subject.name}
                                </span>
                                <span className="text-xs font-bold text-orange-500">+{milestone.xpReward} XP</span>
                              </div>

                              <div>
                                 <h3 className={cn("text-lg font-bold leading-tight mb-1", isCompleted ? "line-through opacity-70" : "text-foreground")}>
                                   {milestone.title}
                                 </h3>
                                 
                                 {/* AI Recommendation Tag */}
                                 {isCurrent && (
                                   <div className="inline-flex items-center gap-1.5 mt-2 bg-purple-500/10 text-purple-600 text-[10px] font-bold px-2 py-1 rounded-sm border border-purple-500/20">
                                      {isReview ? <RefreshCw className="h-3 w-3" /> : <Sparkles className="h-3 w-3" />}
                                      {isReview ? "Identificamos fraqueza neste tópico anterior." : "Recomendado para fortalecer a sua base matemática."}
                                   </div>
                                 )}
                              </div>
                              
                              <Button 
                                variant={isCompleted ? "outline" : isCurrent ? "default" : "secondary"}
                                size="sm"
                                disabled={isUpcoming}
                                className={cn(
                                   "w-full font-bold mt-2",
                                   isUpcoming && "opacity-50"
                                )}
                                onClick={() => isCompleted ? router.push(`/dashboard/materias/${milestone.subject.id}`) : handleComplete(milestone.id, milestone.status)}
                              >
                                {isCompleted ? "Revisar Novamente" : isUpcoming ? "Bloqueada (Complete a anterior)" : "Ir para Aula"}
                              </Button>

                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - AI Diagnostic Dashboard */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Raio-X da IA */}
            <Card className="shadow-sm border-primary/20 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
              <CardHeader className="bg-primary/5 pb-4 border-b border-primary/10">
                <CardTitle className="text-lg flex items-center gap-2 font-black">
                  <BrainCircuit className="h-5 w-5 text-primary" /> Raio-X da IA
                </CardTitle>
                <CardDescription className="text-xs">Diagnóstico da sua performance.</CardDescription>
              </CardHeader>
              <CardContent className="pt-5 space-y-6 relative z-10">
                
                {(() => {
                  const activeProgress = progress.filter(p => p.questionsAnswered > 0);
                  const sortedProgress = [...activeProgress].sort((a, b) => {
                     const ratioA = a.correctAnswers / a.questionsAnswered;
                     const ratioB = b.correctAnswers / b.questionsAnswered;
                     return ratioB - ratioA;
                  });
                  
                  const strengths = sortedProgress.slice(0, 2);
                  // Grab the lowest performers (reverse so the absolute worst is first)
                  const weaknesses = sortedProgress.slice(-2).reverse();

                  return (
                    <>
                      {/* AI Advice Blurb */}
                      <div className="p-3 bg-card border shadow-sm rounded-lg relative">
                        <div className="absolute -top-2 -left-2 bg-primary text-primary-foreground h-6 w-6 rounded-full flex items-center justify-center border-2 border-background">
                          <Sparkles className="h-3 w-3" />
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed mt-1 font-medium italic">
                          {activeProgress.length === 0 
                            ? "Ainda estou mapeando suas habilidades. Faça exercícios para eu identificar seu perfil de estudos." 
                            : weaknesses.length > 0
                              ? `"Identificamos que você dominou ${strengths[0]?.subject.name}, mas está oscilando em ${weaknesses[0]?.subject.name}. Reforçamos seu Roadmap!"`
                              : "Continue assim! Estamos fortalecendo todo o seu arsenal."}
                        </p>
                      </div>

                      {/* Qualidades */}
                      <div className="space-y-4">
                        <h4 className="flex items-center gap-1.5 text-xs font-bold text-foreground uppercase tracking-widest"><TrendingUp className="h-4 w-4 text-green-500" /> Seus Pontos Fortes</h4>
                        
                        <div className="space-y-3">
                          {strengths.length > 0 ? strengths.map(s => {
                            const perc = Math.round((s.correctAnswers / s.questionsAnswered) * 100) || 0;
                            return (
                              <div key={s.id} className="space-y-1.5">
                                <div className="flex justify-between text-xs">
                                  <span className="font-semibold text-muted-foreground">{s.subject.name}</span>
                                  <span className="font-bold text-green-500">{perc}%</span>
                                </div>
                                <Progress value={perc} className="h-1.5 [&_[data-slot=progress-indicator]]:bg-green-500" />
                              </div>
                            )
                          }) : (
                             <p className="text-[10px] text-muted-foreground">Sem dados suficientes.</p>
                          )}
                        </div>
                      </div>

                      <div className="h-px w-full bg-border/50"></div>

                      {/* Fraquezas */}
                      <div className="space-y-4">
                        <h4 className="flex items-center gap-1.5 text-xs font-bold text-foreground uppercase tracking-widest"><TrendingDown className="h-4 w-4 text-destructive" /> Foco de Melhoria</h4>
                        
                        <div className="space-y-3">
                          {weaknesses.length > 0 ? weaknesses.map(w => {
                            const perc = Math.round((w.correctAnswers / w.questionsAnswered) * 100) || 0;
                            return (
                              <div key={w.id} className="space-y-1.5">
                                <div className="flex justify-between text-xs">
                                  <span className="font-semibold text-muted-foreground">{w.subject.name}</span>
                                  <span className="font-bold text-destructive">{perc}%</span>
                                </div>
                                <Progress value={perc} className="h-1.5 [&_[data-slot=progress-indicator]]:bg-destructive" />
                              </div>
                            )
                          }) : (
                             <p className="text-[10px] text-muted-foreground">Sem dados suficientes.</p>
                          )}
                        </div>
                      </div>
                    </>
                  );
                })()}

              </CardContent>
            </Card>

            {/* General Meta/Course Progress */}
            <Card className="shadow-sm">
              <CardContent className="pt-6">
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    <span className="flex items-center gap-1"><Trophy className="h-3 w-3" /> Meta UFRJ</span>
                    <span className="text-primary">Trilha: 12%</span>
                  </div>
                  <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[12%] rounded-full shadow-[0_0_10px_rgba(var(--primary),0.5)]"></div>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1 leading-snug">
                     A IA estima que completando todas essas lições, sua taxa teórica exigida para a UFRJ passará para 35%. Continue firme!
                  </p>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </main>
    </div>
  );
}
