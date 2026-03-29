"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlayCircle, Award, BarChart3, Clock, AlertTriangle, CheckCircle2, Star, Zap, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export default function SimuladosPage() {
  const router = useRouter();
  const [exams, setExams] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, avgScore: 0 });
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/simulados')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setExams(data.data.simulados);
          setStats(data.data.stats);
        }
        setLoading(false);
      });
  }, []);

  const handleStartExam = async (title: string, type: string, id: string, dbId?: string) => {
    if (dbId) {
      // If IN_PROGRESS or COMPLETED, go straight to it
      router.push(`/dashboard/simulados/${dbId}`);
      return;
    }
    setStarting(id);
    try {
      const res = await fetch('/api/simulados', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, type })
      });
      const data = await res.json();
      if (data.success) {
        router.push(`/dashboard/simulados/${data.data.exam.id}`);
      }
    } finally {
      setStarting(null);
    }
  };
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">

      
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
        <header className="mb-12 relative">
          <Badge variant="outline" className="mb-4 bg-primary/5 border-primary/20 text-primary uppercase font-black italic tracking-widest px-4 py-1">
            Campo de Batalha ⚔️
          </Badge>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight italic mb-3">
             <span className="text-primary italic">Simulados</span> TRI 🏆
          </h1>
          <p className="text-muted-foreground max-w-2xl text-lg">
            Treine com o motor da IA que simula a nota real do ENEM e vestibulares de elite.
          </p>
          
          <div className="absolute top-0 right-0 hidden lg:flex items-center gap-6">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-black text-primary italic">{stats.avgScore}</span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Média Geral (TRI)</span>
            </div>
            <div className="h-10 w-px bg-border"></div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-black text-green-500 italic">0{stats.total}</span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Realizados</span>
            </div>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-4 mb-4">
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground">Provas Disponíveis</h2>
              <div className="flex-1 h-px bg-border/50"></div>
            </div>
            
            <div className="grid gap-4">
              {loading ? (
                <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
              ) : exams.map((exam) => (
                <Card key={exam.id} className={cn(
                  "border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/40 transition-all duration-300 group overflow-hidden relative",
                  exam.status === "COMPLETED" && "opacity-75"
                )}>
                  {exam.status === "AVAILABLE" && (
                     <div className="absolute top-0 left-0 w-1 h-full bg-primary shadow-[0_0_15px_rgba(var(--primary),0.5)]"></div>
                  )}
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                      <div className="flex gap-4 items-center">
                        <div className={cn(
                          "h-14 w-14 rounded-2xl border flex items-center justify-center bg-background shrink-0 shadow-inner group-hover:scale-110 transition-transform",
                          exam.accent
                        )}>
                          {exam.status === "COMPLETED" ? <Award className="h-7 w-7 text-green-500" /> : <PlayCircle className="h-7 w-7" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                             <Badge variant="outline" className="text-[9px] font-black uppercase border-border/50">{exam.type}</Badge>
                             <Badge variant="secondary" className="text-[9px] font-black uppercase bg-primary/10 text-primary">{exam.xp} XP</Badge>
                          </div>
                          <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{exam.title}</h3>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground font-medium italic">
                            <span className="flex items-center gap-1.5"><BarChart3 className="h-3 w-3" /> {exam.questions} Questões</span>
                            <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" /> {exam.time}</span>
                            <span className="flex items-center gap-1.5"><Zap className="h-3 w-3" /> Nv. {exam.diff}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="w-full sm:w-auto text-right">
                        {exam.status === "COMPLETED" ? (
                          <div className="flex flex-col items-end">
                            <span className="text-2xl font-black text-green-500 italic leading-none">{exam.score}</span>
                            <span className="text-[10px] font-black uppercase text-muted-foreground flex items-center gap-1 mt-1">Concluído <CheckCircle2 className="h-3 w-3 text-green-500" /></span>
                            <Button variant="ghost" size="sm" className="mt-3 text-[10px] font-bold h-7 uppercase" onClick={() => router.push(`/dashboard/simulados/${exam.dbId}`)}>Revisar</Button>
                          </div>
                        ) : (
                          <Button 
                             disabled={starting === exam.id} 
                             onClick={() => handleStartExam(exam.title, exam.type, exam.id, exam.dbId)}
                             className="w-full sm:w-auto px-8 font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-all"
                          >
                             {starting === exam.id ? <Loader2 className="animate-spin h-5 w-5" /> : (exam.status === "IN_PROGRESS" ? "Continuar" : "Iniciar")}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* AI Advisor Panel */}
          <div className="space-y-6">
            <Card className="bg-primary/5 border-primary/20 shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-5 transform rotate-12 group-hover:scale-110 transition-transform">
                 <Zap className="h-32 w-32" />
               </div>
               <CardHeader className="pb-2">
                 <CardTitle className="text-xl font-black italic flex items-center gap-2">
                   Conselho da <span className="text-primary italic">IA</span> 🧠
                 </CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                 <p className="text-sm font-medium leading-relaxed italic text-foreground/80">
                   "Pela sua evolução, você está pronto para o simulado da <strong className="text-primary">FUVEST</strong>. Foque no controle de tempo; essa prova é mais densa que o ENEM."
                 </p>
                 <div className="pt-4 border-t border-border/40 space-y-3">
                    <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
                      <span className="text-muted-foreground">Estimação TRI atual</span>
                      <span className="text-primary">740.5</span>
                    </div>
                    <Progress value={74} className="h-1.5" />
                 </div>
               </CardContent>
            </Card>

            <Card className="border-orange-500/20 bg-orange-500/[0.02]">
               <CardHeader className="pb-2">
                 <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-orange-600 flex items-center gap-2">
                   <AlertTriangle className="h-4 w-4" /> Importante
                 </CardTitle>
               </CardHeader>
               <CardContent className="text-xs text-muted-foreground leading-normal font-medium italic">
                 Uma vez iniciado, o cronômetro não para. Certifique-se de estar em um ambiente calmo para simular as condições reais de prova.
               </CardContent>
            </Card>

            <Card>
               <CardHeader className="pb-3 border-b border-border/40">
                 <CardTitle className="text-base font-bold flex items-center gap-2">
                   <Star className="h-4 w-4 text-yellow-500" /> Prêmios em XP
                 </CardTitle>
               </CardHeader>
               <CardContent className="pt-4 space-y-4">
                 {[
                   { label: "Finalizar ENEM", xp: "+1200 XP" },
                   { label: "Média > 700 TRI", xp: "+800 XP" },
                   { label: "Top 10 Diário", xp: "+500 XP" }
                 ].map((badge, i) => (
                   <div key={i} className="flex justify-between items-center">
                     <span className="text-xs font-medium text-muted-foreground">{badge.label}</span>
                     <Badge variant="secondary" className="text-[10px] font-black bg-yellow-500/10 text-yellow-600 border-yellow-500/20">{badge.xp}</Badge>
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
