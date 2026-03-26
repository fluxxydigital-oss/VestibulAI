"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PenTool, Sparkles, Clock, FileText, CheckCircle2, TrendingUp, BrainCircuit, ChevronRight, MessageSquareQuote, Loader2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RedacaoPage() {
  const router = useRouter();
  const [essays, setEssays] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/redacao')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setEssays(data.data.essays);
          setSuggestions(data.data.suggestions);
        }
        setLoading(false);
      });
  }, []);

  const handleStartTheme = async (themeTitle: string, id: string) => {
    setStarting(id);
    try {
      const res = await fetch('/api/redacao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme: themeTitle })
      });
      const data = await res.json();
      if (data.success) {
        router.push(`/dashboard/redacao/${data.data.essay.id}`);
      }
    } finally {
      setStarting(null);
    }
  };
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <DashboardHeader />
      
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
        <header className="mb-12">
          <Badge className="mb-4 bg-purple-500/10 text-purple-600 border-purple-500/20 uppercase font-black italic tracking-widest px-4 py-1">
             Nota 1000 Guided by AI ✍️
          </Badge>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight italic mb-3">
                 Módulo de <span className="text-primary italic">Redação</span> ✨
              </h1>
              <p className="text-muted-foreground max-w-2xl text-lg">
                Escreva, envie e receba correção instantânea detalhada por critérios do ENEM.
              </p>
            </div>
            <Button onClick={() => handleStartTheme("Tema Livre", "livre")} disabled={!!starting} className="h-14 px-10 rounded-2xl bg-gradient-to-r from-primary to-purple-600 font-black uppercase tracking-widest shadow-2xl shadow-primary/30 hover:scale-105 transition-all text-white">
               {starting === "livre" ? <Loader2 className="animate-spin h-5 w-5" /> : <><PenTool className="mr-3 h-5 w-5" /> Nova Redação</>}
            </Button>
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>
        ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Recent Topics List */}
          <div className="lg:col-span-2 space-y-8">
            {/* My Essays */}
            {essays.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-4">
                  <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground">Minhas Redações</h2>
                  <div className="flex-1 h-px bg-border/50"></div>
                </div>
                <div className="grid gap-4">
                  {essays.map((essay) => (
                    <Card key={essay.id} className="group border-border/50 bg-card/40 backdrop-blur-sm hover:border-primary/40 transition-all duration-300 transform hover:-translate-x-1 cursor-pointer" onClick={() => router.push(`/dashboard/redacao/${essay.id}`)}>
                       <CardContent className="p-6">
                         <div className="flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
                           <div className="flex gap-4">
                             <div className="h-14 w-14 rounded-2xl bg-muted/50 border flex items-center justify-center shrink-0 group-hover:bg-primary/5 transition-colors">
                               <FileText className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                             </div>
                             <div className="space-y-1">
                               <div className="flex items-center gap-2">
                                 <Badge variant="outline" className={cn(
                                   "text-[9px] font-black uppercase border-border/50",
                                   essay.status === "GRADED" ? "text-green-500 bg-green-500/10 border-green-500/20" : "text-yellow-500 bg-yellow-500/10 border-yellow-500/20"
                                 )}>
                                   {essay.status === "GRADED" ? "Corrigida" : "Rascunho"}
                                 </Badge>
                                 <span className="text-[10px] font-bold text-muted-foreground uppercase">{new Date(essay.updatedAt).toLocaleDateString('pt-BR')}</span>
                               </div>
                               <h3 className="text-lg font-bold leading-tight group-hover:text-foreground transition-colors">{essay.theme}</h3>
                             </div>
                           </div>
                           <div className="w-full sm:w-auto text-right">
                             {essay.status === "GRADED" ? (
                                <div className="p-3 bg-green-500/5 border border-green-500/20 rounded-xl inline-flex flex-col items-center min-w-[100px]">
                                  <span className="text-2xl font-black text-green-500 italic leading-none">{essay.score?.total || 1000}</span>
                                  <span className="text-[9px] font-black uppercase text-green-600/70 mt-1">Sua Nota</span>
                                </div>
                             ) : (
                               <Button variant="ghost" className="w-full sm:w-auto font-black uppercase tracking-widest text-xs hover:bg-primary/10 hover:text-primary gap-2">
                                 Continuar <ChevronRight className="h-3 w-3" />
                               </Button>
                             )}
                           </div>
                         </div>
                       </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions */}
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-4">
                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground">Temas Sugeridos pela IA</h2>
                <div className="flex-1 h-px bg-border/50"></div>
              </div>

              <div className="grid gap-4">
                {suggestions.map((topic) => (
                  <Card key={topic.id} className="group border-border/50 bg-card/40 backdrop-blur-sm hover:border-primary/40 transition-all duration-300 transform hover:-translate-x-1">
                     <CardContent className="p-6">
                       <div className="flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
                         <div className="flex gap-4">
                           <div className="h-14 w-14 rounded-2xl bg-muted/50 border flex items-center justify-center shrink-0 group-hover:bg-primary/5 transition-colors">
                             <FileText className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                           </div>
                           <div className="space-y-1">
                             <div className="flex items-center gap-2">
                               <Badge variant="outline" className="text-[9px] font-black uppercase border-border/50">{topic.tag}</Badge>
                               <span className="text-[10px] font-black text-primary uppercase flex items-center gap-1"><Sparkles className="h-3 w-3" /> Sugestão da Semana</span>
                             </div>
                             <h3 className="text-lg font-bold leading-tight group-hover:text-foreground transition-colors">{topic.title}</h3>
                             <div className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground uppercase tracking-tight">
                               <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Prazo: {topic.deadline}</span>
                               <span className="flex items-center gap-1 text-primary"><TrendingUp className="h-3 w-3" /> +{topic.xp} XP</span>
                             </div>
                           </div>
                         </div>
                         
                         <div className="w-full sm:w-auto text-right">
                             <Button onClick={() => handleStartTheme(topic.title, topic.id)} disabled={!!starting} variant="ghost" className="w-full sm:w-auto font-black uppercase tracking-widest text-xs hover:bg-primary/10 hover:text-primary gap-2">
                               {starting === topic.id ? <Loader2 className="animate-spin h-4 w-4" /> : "Começar"} <ChevronRight className="h-3 w-3" />
                             </Button>
                         </div>
                       </div>
                     </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel: AI Correction Preview */}
          <div className="space-y-6">
            <Card className="shadow-xl border-primary/20 bg-background/50 relative overflow-hidden h-fit">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
              <CardHeader className="border-b border-border/40">
                <CardTitle className="text-lg flex items-center gap-2 italic">
                  <BrainCircuit className="h-5 w-5 text-primary" /> Como a <span className="text-primary italic">IA</span> Corrige?
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  {[
                    { label: "Domínio da Norma Culta", score: 85, color: "bg-blue-500" },
                    { label: "Compreensão do Tema", score: 95, color: "bg-emerald-500" },
                    { label: "Organização de Argumentos", score: 70, color: "bg-orange-500" },
                    { label: "Conhecimento de Repertório", score: 60, color: "bg-purple-500" }
                  ].map((crit, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="flex justify-between text-[11px] font-black uppercase tracking-wider">
                        <span className="text-muted-foreground">{crit.label}</span>
                        <span className="text-foreground">{crit.score}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div 
                          className={cn("h-full rounded-full transition-all duration-1000 ease-in-out", crit.color)}
                          style={{ width: `${crit.score}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 space-y-3">
                  <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase italic">
                    <MessageSquareQuote className="h-4 w-4" /> Insight da Redação Anterior
                  </div>
                  <p className="text-xs text-foreground/80 leading-relaxed italic font-medium">
                    "Você demonstrou excelente repertório sociocultural, mas sua <strong className="text-primary">proposta de intervenção</strong> precisa detalhar mais o papel do agente público."
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-500/10 to-transparent border-yellow-500/20">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-yellow-500/20 flex items-center justify-center shrink-0">
                  <TrendingUp className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                   <h4 className="text-sm font-bold uppercase tracking-tight">Status da Evolução</h4>
                   <p className="text-xs text-muted-foreground font-medium">Sua nota subiu <span className="text-green-500 font-bold">+80 pontos</span> este mês!</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        )}
      </main>
    </div>
  );
}
