"use client"

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, BookOpen, Calculator, Globe, Atom, FlaskConical, Languages, PlayCircle, CheckCircle2, Loader2, Trophy, Clock, Medal } from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ReactNode> = {
  'Exatas': <Calculator className="h-6 w-6" />,
  'Biológicas': <FlaskConical className="h-6 w-6" />,
  'Humanas': <Globe className="h-6 w-6" />,
  'Linguagens': <Languages className="h-6 w-6" />,
};

const areaMap: Record<string, string> = {
  'Matemática': 'Exatas', 'Física': 'Exatas', 'Química': 'Exatas',
  'História': 'Humanas', 'Geografia': 'Humanas', 'Filosofia': 'Humanas', 'Sociologia': 'Humanas',
  'Biologia': 'Biológicas',
  'Português': 'Linguagens', 'Inglês': 'Linguagens', 'Literatura': 'Linguagens', 'Espanhol': 'Linguagens',
};

const colorMap: Record<string, string> = {
  'Exatas': 'bg-blue-500',
  'Biológicas': 'bg-green-500',
  'Humanas': 'bg-orange-500',
  'Linguagens': 'bg-red-500',
  'Default': 'bg-primary'
};

export default function MateriaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [studyingId, setStudyingId] = useState<string | null>(null);
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);

  useEffect(() => {
    fetch(`/api/materias/${resolvedParams.id}`)
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          setData(res.data);
        }
        setLoading(false);
      });
  }, [resolvedParams.id]);

  const handleStudy = async (topicId: string) => {
    if (completedTopics.includes(topicId) || studyingId) return;
    
    setStudyingId(topicId);
    
    try {
      // Simulate studying time
      await new Promise(r => setTimeout(r, 2000));
      
      // Update database progress behind the scenes
      await fetch(`/api/materias/${resolvedParams.id}`, { method: 'POST' });
      
      // Mark as complete and update UI locally
      setCompletedTopics(prev => [...prev, topicId]);
      
      // Refresh strictly progress from API to see the actual math taking effect
      fetch(`/api/materias/${resolvedParams.id}`)
        .then(res => res.json())
        .then(res => {
          if(res.success) setData((prev: any) => ({ ...prev, progress: res.data.progress, stats: res.data.stats }));
        });
        
    } catch (err) {
      console.error(err);
    } finally {
      setStudyingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      </div>
    );
  }

  if (!data || !data.materia) {
    return (
      <div className="flex min-h-screen items-center justify-center flex-col bg-background gap-4">
        <h1>Matéria não encontrada</h1>
        <Button onClick={() => router.push('/dashboard/materia')}>Voltar</Button>
      </div>
    );
  }

  const subject = data.materia;
  const area = areaMap[subject.name] || 'Default';
  const color = colorMap[area] || colorMap['Default'];
  const icon = iconMap[area] || <BookOpen className="h-6 w-6" />;
  const { progress, stats, topics } = data;

  return (
    <div className="flex min-h-screen w-full flex-col bg-background/50">
      <header className="sticky top-0 z-30 flex h-20 items-center gap-4 border-b border-border/50 bg-background/95 backdrop-blur px-4 md:px-8">
        <button onClick={() => router.push('/dashboard/materia')} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer group">
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Voltar para Matérias</span>
        </button>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full p-4 md:p-8 space-y-8">
        
        {/* Header Hero */}
        <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-card shadow-sm">
           <div className={cn("absolute inset-0 opacity-10 bg-gradient-to-br from-transparent to-current", color.replace('bg-', 'text-'))}></div>
           <div className="p-6 md:p-10 relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
              
              <div className={cn("h-24 w-24 shrink-0 rounded-2xl flex items-center justify-center shadow-inner border-4", color.replace('bg', 'border') + '/20', color)}>
                <div className="text-white drop-shadow-md">
                   {icon}
                </div>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                 <Badge variant="outline" className="mb-2 uppercase tracking-widest text-[10px] bg-background/50 backdrop-blur font-bold">{area}</Badge>
                 <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground mb-2">
                    {subject.name}
                 </h1>
                 <p className="text-muted-foreground max-w-xl">{subject.description || `Aprofunde seus conhecimentos em ${subject.name} e garanta os pontos cruciais no vestibular.`}</p>
                 
                 <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-6">
                    <div className="flex items-center gap-2 bg-background/80 backdrop-blur px-3 py-1.5 rounded-lg border shadow-sm">
                       <Medal className="h-4 w-4 text-yellow-500" />
                       <span className="text-xs font-bold">{stats.correctAnswers} Acertos</span>
                    </div>
                    <div className="flex items-center gap-2 bg-background/80 backdrop-blur px-3 py-1.5 rounded-lg border shadow-sm">
                       <Clock className="h-4 w-4 text-blue-500" />
                       <span className="text-xs font-bold">{topics.length} Módulos</span>
                    </div>
                 </div>
              </div>

              {/* Progress Box */}
              <div className="w-full md:w-64 bg-background/80 backdrop-blur rounded-2xl p-4 border shadow-sm shrink-0">
                 <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-bold text-muted-foreground uppercase">Maestria</span>
                    <span className="text-2xl font-black text-primary">{progress}%</span>
                 </div>
                 <Progress value={progress} className={cn("h-2", `[&_[data-slot=progress-indicator]]:${color}`)} />
                 <p className="text-[10px] text-muted-foreground mt-3 italic text-center">
                    Taxa baseada no seu desempenho
                 </p>
              </div>
           </div>
        </div>

        {/* Content Modules Map */}
        <section className="space-y-6">
           <div className="flex items-center gap-2 px-2">
              <Trophy className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold tracking-tight">Trilha de Aprendizagem</h2>
           </div>

           <div className="space-y-4">
              {topics.map((topic: any, index: number) => {
                 const isCompleted = completedTopics.includes(topic.id);
                 const isActive = studyingId === topic.id;
                 
                 return (
                 <Card key={topic.id} className={cn(
                    "overflow-hidden transition-all duration-300 border",
                    isCompleted ? "bg-muted/30 border-green-500/30" : isActive ? "border-primary shadow-lg shadow-primary/10 ring-2 ring-primary/20 scale-[1.01]" : "hover:border-primary/40 bg-card"
                 )}>
                    <CardContent className="p-0">
                       <div className="flex flex-col sm:flex-row items-stretch min-h-[5rem]">
                          
                          {/* Left Number Badge */}
                          <div className={cn(
                             "w-full sm:w-16 flex items-center justify-center border-b sm:border-b-0 sm:border-r py-3 sm:py-0 font-black text-xl bg-muted/40",
                             isCompleted ? "text-green-500 bg-green-500/10" : "text-muted-foreground/30"
                          )}>
                             {index + 1}
                          </div>

                          {/* Center Content */}
                          <div className="flex-1 p-4 flex flex-col justify-center">
                             <div className="flex items-center gap-2 mb-1">
                                <Badge variant="secondary" className="text-[9px] uppercase tracking-wider bg-primary/10 text-primary border-primary/20">Módulo</Badge>
                                <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-medium"><Clock className="h-3 w-3"/> {topic.duration}</span>
                             </div>
                             <h3 className={cn("font-bold text-base sm:text-lg", isCompleted && "text-muted-foreground")}>{topic.title}</h3>
                          </div>

                          {/* Right Action */}
                          <div className="w-full sm:w-48 p-4 flex items-center justify-center bg-muted/20 sm:border-l">
                             <Button 
                               onClick={() => handleStudy(topic.id)}
                               disabled={isCompleted || studyingId !== null}
                               variant={isCompleted ? "outline" : "default"}
                               className={cn(
                                  "w-full font-bold transition-all",
                                  isCompleted ? "border-green-500/50 text-green-600 bg-green-500/5" : "shadow-md"
                               )}
                             >
                                {isActive ? (
                                   <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Estudando...</>
                                ) : isCompleted ? (
                                   <><CheckCircle2 className="h-4 w-4 mr-2" /> Concluído</>
                                ) : (
                                   <><PlayCircle className="h-4 w-4 mr-2" /> Iniciar Aula</>
                                )}
                             </Button>
                          </div>

                       </div>
                    </CardContent>
                 </Card>
                 );
              })}
           </div>
        </section>

      </main>
    </div>
  );
}
