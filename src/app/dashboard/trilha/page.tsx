"use client"

import { DashboardHeader } from "@/components/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Star, BrainCircuit, Rocket, Target, Trophy, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const MILESTONES = [
  { id: 1, title: "Fundamentos de Matemática", status: "completed", type: "intro", xp: 100 },
  { id: 2, title: "Funções e Gráficos", status: "current", type: "lesson", xp: 150 },
  { id: 3, title: "Geometria Plana", status: "upcoming", type: "lesson", xp: 200 },
  { id: 4, title: "Desafio Semanal: Lógica", status: "upcoming", type: "boss", xp: 500 },
  { id: 5, title: "Trigonometria Avançada", status: "upcoming", type: "lesson", xp: 200 }
];

export default function TrilhaPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <DashboardHeader />
      
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
        <div className="mb-10 text-center">
          <Badge variant="outline" className="mb-4 py-1 px-4 border-primary/30 bg-primary/5 text-primary text-sm font-bold uppercase tracking-wider animate-pulse">
            Sua Jornada de Medicina
          </Badge>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 italic">
            Trilha de <span className="text-primary italic">Estudo</span> 🚀
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Siga o seu caminho personalizado criado pela nossa IA para garantir sua vaga na UFRJ.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-4 items-start">
          {/* Main Timeline Card */}
          <Card className="lg:col-span-3 border-border/50 bg-background/50 backdrop-blur-sm shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
            <CardHeader className="border-b border-border/40">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Rocket className="h-5 w-5 text-primary" /> Roadmap de Progressão
                </CardTitle>
                <div className="text-right">
                  <span className="text-sm font-bold text-primary">Atividade Ativa: 2/15</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="relative space-y-12 after:absolute after:left-[19px] after:top-2 after:h-[calc(100%-16px)] after:w-0.5 after:bg-gradient-to-b after:from-primary after:to-border after:opacity-50">
                {MILESTONES.map((milestone) => (
                  <div key={milestone.id} className="relative flex items-start gap-8 group">
                    <div className={cn(
                      "z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-background shadow-lg transition-transform group-hover:scale-110",
                      milestone.status === "completed" ? "bg-green-500" : 
                      milestone.status === "current" ? "bg-primary ring-4 ring-primary/20 animate-pulse" : 
                      "bg-muted border-border"
                    )}>
                      {milestone.status === "completed" ? <CheckCircle2 className="h-5 w-5 text-white" /> : 
                       milestone.type === "boss" ? <Star className="h-5 w-5 text-white" /> :
                       <Circle className="h-4 w-4 text-muted-foreground" />}
                    </div>
                    
                    <div className={cn(
                      "flex-1 rounded-2xl border p-5 shadow-sm transition-all duration-300",
                      milestone.status === "current" ? "bg-primary/5 border-primary/30 shadow-primary/5 scale-[1.02]" : "bg-card hover:border-primary/30"
                    )}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="secondary" className={cn(
                              "text-[10px] h-5 font-bold uppercase",
                              milestone.type === "boss" ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" : 
                              milestone.status === "completed" ? "bg-green-500/10 text-green-600" : ""
                            )}>
                              {milestone.type === "boss" ? "Desafio Épico" : milestone.type === "lesson" ? "Lição" : "Início"}
                            </Badge>
                            <span className="text-xs font-bold text-muted-foreground">+{milestone.xp} XP</span>
                          </div>
                          <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{milestone.title}</h3>
                        </div>
                        <Button 
                          variant={milestone.status === "completed" ? "outline" : "default"}
                          size="sm"
                          className={cn(
                             "font-bold px-6",
                             milestone.status === "upcoming" && "opacity-50 pointer-events-none"
                          )}
                        >
                          {milestone.status === "completed" ? "Revisar" : "Começar"}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sidebar Stats */}
          <div className="space-y-6">
            <Card className="shadow-lg border-primary/20 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 transition-opacity group-hover:opacity-100 opacity-0"></div>
              <CardHeader className="pb-3 border-b border-border/40 relative z-10">
                <CardTitle className="text-lg flex items-center gap-2 tracking-tight italic">
                  <Target className="h-5 w-5 text-primary" /> Foco da <span className="text-primary italic">IA</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4 relative z-10">
                <div className="p-4 bg-muted/50 rounded-xl border border-border/50">
                  <p className="text-sm text-foreground/80 leading-relaxed font-medium">
                    "Identificamos que você precisa reforçar <span className="text-primary font-bold">Geometria Analítica</span> para bater sua meta na UFRJ. Sua próxima aula de amanhã será ajustada."
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    <span>Medicina (UFRJ)</span>
                    <span className="text-primary">68% Concluído</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[68%] rounded-full shadow-[0_0_10px_rgba(var(--primary),0.5)]"></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg bg-card">
              <CardHeader className="pb-3 border-b border-border/40">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" /> TOP Conquistas
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                {[
                  { icon: "🔥", title: "Fogo nos Estudos", desc: "14 dias seguidos" },
                  { icon: "⚡", title: "Velocidade da Luz", desc: "10 questões < 1 min" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-tight">{item.title}</h4>
                      <p className="text-[10px] text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
