"use client"
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart3, BookOpen, BrainCircuit, Target, CheckCircle2, Clock, CalendarDays, Flame, Trophy, TrendingUp, AlertCircle, PlayCircle, PauseCircle, LogOut, RotateCcw, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Settings, CreditCard, LifeBuoy } from "lucide-react";

// Component Interfaces
interface StudyPlan {
  id: string;
  title: string;
  type: string;
  xpReward: number;
  date: string;
  durationMin: number;
  status: 'PENDING' | 'COMPLETED' | 'MISSED';
  subject: { name: string };
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // Trilha State
  const [todayMissions, setTodayMissions] = useState<StudyPlan[]>([]);
  const [loadingMissions, setLoadingMissions] = useState(true);

  // Timer State
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [studySeconds, setStudySeconds] = useState(0); // Resets timer to 0

  // Fetch Missions
  useEffect(() => {
    async function fetchMissions() {
      if (!user) return;
      try {
        const res = await fetch('/api/trilha');
        const data = await res.json();
        if (data.success && data.data?.trilha) {
          const allMissions: StudyPlan[] = data.data.trilha;
          const today = new Date().toISOString().split('T')[0];
          
          const todays = allMissions.filter(m => {
             const mDate = new Date(m.date).toISOString().split('T')[0];
             return mDate === today;
          });
          setTodayMissions(todays);
        }
      } catch (err) {
        console.error("Failed to load missions", err);
      } finally {
        setLoadingMissions(false);
      }
    }
    fetchMissions();
  }, [user]);

  // Dynamic ENEM/Target countdown
  let daysToEnem = 180; // default safe fallback
  if (user?.targetDate) {
    const today = new Date();
    const target = new Date(user.targetDate);
    // Adicionando um pequeno fuso compensatório se necessário, ou usar UTC
    const diffTime = target.getTime() - today.getTime();
    daysToEnem = Math.ceil(diffTime / (1000 * 3600 * 24));
  } else {
    const today = new Date();
    let nextEnemYear = today.getFullYear();
    if (today.getMonth() > 10 || (today.getMonth() === 10 && today.getDate() > 10)) {
      nextEnemYear++;
    }
    const nextEnemDate = new Date(nextEnemYear, 10, 10);
    daysToEnem = Math.ceil((nextEnemDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
  }

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setStudySeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const handleAIGenerate = () => {
    // Premium gating logic
    if (user?.plan === 'PREMIUM') {
      router.push('/dashboard/trilha?gen=ai');
    } else {
      alert("A funcionalidade 'Radares da IA' exige assinatura Premium.\n\nAtualmente seu plano é: " + (user?.plan || "FREE") + ".\n\nFaça o upgrade e desbloqueie as trilhas de estudo geradas por IA direcionadas pras suas deficiências!");
      router.push('/dashboard/assinatura');
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-30 flex h-20 items-center gap-4 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-8 shadow-sm">
        <Link className="flex items-center gap-3 font-bold text-2xl tracking-tight" href="/dashboard">

          <div className="bg-gradient-to-br from-primary/20 to-purple-500/20 p-2 rounded-xl">
            <BrainCircuit className="h-6 w-6 text-primary" />
          </div>
          <span className="hidden sm:inline-block">Vestibul<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 dark:from-blue-400 to-primary">AI</span></span>
        </Link>
        <div className="ml-auto w-full max-w-sm sm:max-w-max flex items-center justify-end gap-6 sm:gap-8">
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold">
            <Link href="/dashboard" className="text-foreground hover:text-primary transition-colors whitespace-nowrap">
              Dashboard
            </Link>
            <Link href="/dashboard/trilha" className="text-muted-foreground hover:text-primary transition-colors whitespace-nowrap">
              Trilha de Estudo
            </Link>
            <Link href="/dashboard/materia" className="text-muted-foreground hover:text-primary transition-colors whitespace-nowrap">
              Matéria
            </Link>
            <Link href="/dashboard/questions" className="text-muted-foreground hover:text-primary transition-colors whitespace-nowrap">
              Questões
            </Link>
            <Link href="/dashboard/simulados" className="text-muted-foreground hover:text-primary transition-colors whitespace-nowrap">
              Simulados
            </Link>
            <Link href="/dashboard/redacao" className="text-muted-foreground hover:text-primary transition-colors whitespace-nowrap">
              Redação
            </Link>
          </nav>

          
            <div className="flex items-center gap-3">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-xs font-bold text-primary">Nível {Math.floor((user?.xp || 0) / 100) + 1}</span>
                <span className="text-[10px] text-muted-foreground">{user?.xp || 0}/{(Math.floor((user?.xp || 0) / 100) + 1) * 100} XP</span>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary ring-offset-2">
                  <Avatar className="h-11 w-11 border-2 border-primary/20 hover:border-primary transition-colors cursor-pointer shadow-sm relative group">
                    <AvatarImage src="" alt={user?.name || "User"} />
                    <AvatarFallback className="font-bold bg-primary/10 text-primary text-lg">
                      {user?.name?.split(' ').filter(Boolean).map(n => n[0]).join('') || user?.email?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                    <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground ring-2 ring-background z-10">
                      {Math.floor((user?.xp || 0) / 100) + 1}
                    </span>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-64 p-2 bg-background/80 backdrop-blur-xl border border-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] animate-in fade-in-0 zoom-in-95"
                  align="end"
                  sideOffset={8}
                >
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="p-3 font-normal">
                      <div className="flex flex-col space-y-1.5">
                        <p className="text-sm font-bold leading-none">{user?.name || "Usuário"}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator className="bg-border/50" />
                  <DropdownMenuGroup className="p-1">
                    <DropdownMenuItem
                      onClick={() => router.push('/dashboard/perfil')}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 hover:bg-primary/10 hover:text-primary data-[focus]:bg-primary/10 data-[focus]:text-primary cursor-pointer group"
                    >
                      <div className="bg-muted p-1.5 rounded-md group-hover:bg-primary/20 transition-colors">
                        <User className="h-4 w-4" />
                      </div>
                      <span className="font-medium">Perfil</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => router.push('/dashboard/assinatura')}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 hover:bg-primary/10 hover:text-primary data-[focus]:bg-primary/10 data-[focus]:text-primary cursor-pointer group"
                    >
                      <div className="bg-muted p-1.5 rounded-md group-hover:bg-primary/20 transition-colors">
                        <CreditCard className="h-4 w-4" />
                      </div>
                      <span className="font-medium">Assinatura</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => router.push('/dashboard/configuracoes')}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 hover:bg-primary/10 hover:text-primary data-[focus]:bg-primary/10 data-[focus]:text-primary cursor-pointer group"
                    >
                      <div className="bg-muted p-1.5 rounded-md group-hover:bg-primary/20 transition-colors">
                        <Settings className="h-4 w-4" />
                      </div>
                      <span className="font-medium">Configurações</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator className="bg-border/50" />
                  <DropdownMenuGroup className="p-1">
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 hover:bg-destructive/10 hover:text-destructive cursor-pointer group disabled:opacity-50"
                    >
                      <div className="bg-muted p-1.5 rounded-md group-hover:bg-destructive/20 transition-colors">
                        <LogOut className="h-4 w-4" />
                      </div>
                      <span className="font-medium">
                        {isLoggingOut ? "Saindo..." : "Sair"}
                      </span>
                    </button>
                  </DropdownMenuGroup>

                </DropdownMenuContent>
              </DropdownMenu>
            </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-8 w-full">
        {/* Welcome Section & Gamification Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-card border rounded-2xl p-6 shadow-sm">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Bom dia, {user?.name?.split(' ')[0] || "Estudante"}! 🚀</h1>
            <p className="text-muted-foreground">De volta aos estudos! Continue sua trilha de preparação para o ENEM.</p>
            <div className="flex items-center gap-3 mt-4">
              <Badge variant="secondary" className="bg-orange-500/10 text-orange-600 dark:text-orange-400 hover:bg-orange-500/20 px-3 py-1 flex items-center gap-1.5 cursor-default">
                <Flame className="h-4 w-4" /> 14 dias de Ofensiva
              </Badge>
              <div className="flex items-center gap-2 text-sm text-foreground/80 font-medium bg-muted/50 px-3 py-1.5 rounded-full border">
                <Target className="h-4 w-4 text-primary" />
                Meta: {user?.targetCourse || "Não definida"}
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-auto flex flex-col items-center justify-center bg-muted/40 p-4 rounded-xl border border-border/40 min-w-[200px]">
             <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600 mb-1">
               {daysToEnem}
             </div>
             <div className="text-sm font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
               <CalendarDays className="h-4 w-4" /> Dias p/ ENEM
             </div>
          </div>
        </div>
        
        {/* Main Metrics (Top Cards) */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="hover:border-primary/50 transition-colors">
             <CardHeader className="flex flex-row items-center justify-between pb-2">
               <CardTitle className="text-sm font-medium">Experiência (XP)</CardTitle>
               <Trophy className="h-4 w-4 text-primary/80" />
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold">{user?.xp || 0} <span className="text-sm font-normal text-muted-foreground">/ {(Math.floor((user?.xp || 0) / 100) + 1) * 100} para Nvl {Math.floor((user?.xp || 0) / 100) + 2}</span></div>
               <Progress value={((user?.xp || 0) % 100)} className="mt-3 h-2" />
               <p className="text-xs text-muted-foreground mt-2">+0 XP ganhos hoje</p>
             </CardContent>
           </Card>

           <Card className="hover:border-primary/50 transition-colors">
             <CardHeader className="flex flex-row items-center justify-between pb-2">
               <CardTitle className="text-sm font-medium">Questões Hoje</CardTitle>
               <CheckCircle2 className="h-4 w-4 text-green-500" />
             </CardHeader>
             <CardContent>
               <div className="flex items-end gap-2">
                 <div className="text-2xl font-bold">0</div>
                 <span className="text-sm text-muted-foreground pb-1">/ 30 meta</span>
               </div>
               <Progress value={0} className="mt-3 h-2 bg-muted [&_[data-slot=progress-indicator]]:bg-green-500" />
               <p className="text-xs text-muted-foreground mt-2 font-medium">
                 <span className="text-muted-foreground">0% de Acerto</span> (Sem dados)
               </p>
             </CardContent>
           </Card>

           <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-primary/20 transition-all"></div>
             <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
               <CardTitle className="text-sm font-medium text-primary">Tempo de Estudo</CardTitle>
               <Clock className="h-4 w-4 text-primary animate-pulse" />
             </CardHeader>
             <CardContent className="relative z-10">
               <div className="text-3xl font-black font-mono text-primary tracking-tight">{formatTime(studySeconds)}</div>
                <div className="flex gap-2 mt-4">
                  <Button 
                   size="sm" 
                   variant={isTimerRunning ? "secondary" : "default"}
                   className={`flex-1 text-xs font-bold gap-2 ${isTimerRunning ? "bg-primary/20 hover:bg-primary/30 text-primary" : ""}`}
                   onClick={() => setIsTimerRunning(!isTimerRunning)}
                  >
                    {isTimerRunning ? <PauseCircle className="h-4 w-4" /> : <PlayCircle className="h-4 w-4" />}
                    {isTimerRunning ? "Pausar" : "Retomar"}
                  </Button>
                  <Button 
                   size="sm" 
                   variant="outline"
                   className="text-xs font-bold gap-1 text-muted-foreground hover:text-destructive hover:border-destructive/50"
                   onClick={() => { setIsTimerRunning(false); setStudySeconds(0); }}
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Resetar
                  </Button>
                </div>
             </CardContent>
           </Card>

           <Card className="hover:border-primary/50 transition-colors">
             <CardHeader className="flex flex-row items-center justify-between pb-2">
               <CardTitle className="text-sm font-medium">Desempenho Geral</CardTitle>
               <TrendingUp className="h-4 w-4 text-purple-500" />
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold">Iniciante</div>
               <p className="text-xs text-muted-foreground mt-1 mb-2">Sem simulados recentes</p>
               <div className="flex gap-1 mt-2">
                 {[1,2,3,4,5,6,7].map((day, i) => (
                   <div key={i} className={`h-6 w-full rounded-sm bg-muted`} title={`Dia ${day}`}></div>
                 ))}
               </div>
             </CardContent>
           </Card>
        </div>

        {/* Two Column Layout for Timeline and AI Insights */}
        <div className="grid gap-6 md:grid-cols-7 xl:gap-8">
          
          {/* Main Content (Left Column) - Schedule/Timeline */}
          <Card className="md:col-span-4 xl:col-span-5 flex flex-col shadow-sm">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <CalendarDays className="h-5 w-5 text-primary" /> Missões de Hoje
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Suas tarefas agendadas para o dia.
                  </CardDescription>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-primary">{todayMissions.filter(m => m.status === 'COMPLETED').length}/{todayMissions.length}</span>
                  <p className="text-xs text-muted-foreground">Concluídas</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-0">
              {loadingMissions ? (
                 <div className="p-12 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
              ) : todayMissions.length === 0 ? (
                 <div className="relative p-6 space-y-8 min-h-[200px] flex items-center justify-center">
                   <div className="text-center text-muted-foreground w-full">
                     <CalendarDays className="h-10 w-10 mx-auto mb-3 opacity-20" />
                     <p className="font-medium">Nenhuma missão agendada.</p>
                     <p className="text-sm opacity-80 mt-1">Gere sua trilha formatada por IA acessando o menu lateral!</p>
                     <Link href="/dashboard/trilha">
                       <Button variant="outline" className="mt-4">
                          Gerar Trilha de Estudos
                       </Button>
                     </Link>
                   </div>
                 </div>
              ) : (
                <div className="relative p-6 space-y-6 before:absolute before:inset-0 before:ml-10 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                  {todayMissions.map((task, idx) => (
                    <div key={task.id} className="relative flex items-start md:items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                      
                      {/* Icon */}
                      <div className={`hidden md:flex flex-col items-center justify-center w-10 h-10 rounded-full border-4 border-background shadow shrink-0 md:order-1 z-10 
                          ${task.status === 'COMPLETED' ? 'bg-green-500 text-white' : task.status === 'PENDING' ? 'bg-primary text-primary-foreground ring-4 ring-primary/20 animate-pulse' : 'bg-muted text-muted-foreground'}`}>
                        {task.status === 'COMPLETED' ? <CheckCircle2 className="h-5 w-5" /> : task.status === 'PENDING' ? <Flame className="h-5 w-5" /> : <div className="w-2 h-2 rounded-full bg-border"></div>}
                      </div>
                      
                      {/* Mobile Icon */}
                      <div className={`flex flex-col items-center justify-center w-10 h-10 rounded-full border-4 border-background shadow shrink-0 md:hidden z-10 absolute -left-[20px] top-0 
                         ${task.status === 'COMPLETED' ? 'bg-green-500 text-white' : task.status === 'PENDING' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                        {task.status === 'COMPLETED' ? <CheckCircle2 className="h-5 w-5" /> : task.status === 'PENDING' ? <Flame className="h-5 w-5" /> : <div className="w-2 h-2 rounded-full bg-border"></div>}
                      </div>

                      {/* Content Card */}
                      <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] rounded-xl p-4 shadow-sm border
                        ${task.status === 'COMPLETED' ? 'bg-card border-green-500/30 opacity-60' : task.status === 'PENDING' ? 'bg-primary/5 border-primary/30 relative overflow-hidden' : 'bg-card border-border/50'}`}>
                        
                        {task.status === 'PENDING' && <div className="absolute top-0 right-0 w-2 h-full bg-primary"></div>}
                        
                        <div className="flex items-center justify-between mb-2">
                           <time className={`text-xs font-semibold uppercase flex items-center gap-1 ${task.status === 'COMPLETED' ? 'text-green-600' : task.status === 'PENDING' ? 'text-primary' : 'text-muted-foreground'}`}>
                              <Clock className="h-3 w-3" /> {task.durationMin} min
                           </time>
                           <span className={`text-xs font-bold ${task.status === 'PENDING' ? 'text-primary' : 'text-muted-foreground'}`}>+{task.xpReward} XP</span>
                        </div>
                        
                        <div className={`font-bold ${task.status === 'PENDING' ? 'text-lg text-foreground' : 'text-foreground'}`}>
                           {task.subject.name}: {task.title}
                        </div>
                        
                        {task.status === 'PENDING' && (
                          <div className="flex gap-2 mt-4">
                             <Link href="/dashboard/trilha" className="w-full">
                               <Button size="sm" className="w-full">Ir para a Trilha</Button>
                             </Link>
                           </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Right Column - AI Insights & Achievements */}
          <div className="md:col-span-3 xl:col-span-2 space-y-6">
            <Card className="shadow-sm">
              <CardHeader className="pb-3 border-b border-border/40">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BrainCircuit className="h-5 w-5 text-primary" /> Radares da IA
                </CardTitle>
                <CardDescription>Onde focar para ganhar mais pontos.</CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-5">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-destructive flex items-center gap-1.5"><AlertCircle className="h-4 w-4" /> Física: Cinemática</span>
                    <span className="font-bold text-muted-foreground">32% acerto</span>
                  </div>
                  <Progress value={32} className="h-2 [&_[data-slot=progress-indicator]]:bg-destructive" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-orange-500 flex items-center gap-1.5"><Target className="h-4 w-4" /> Química: Orgânica</span>
                    <span className="font-bold text-muted-foreground">55% acerto</span>
                  </div>
                  <Progress value={55} className="h-2 [&_[data-slot=progress-indicator]]:bg-orange-500" />
                </div>

                <div className="mt-4 p-3 bg-muted/50 rounded-lg border border-border/50">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">Insight:</strong> Você tem perdido questões repetidas de MRUV. Reveja a equação de Torricelli.
                  </p>
                  <Button variant="outline" size="sm" className="w-full mt-3 text-xs h-8" onClick={handleAIGenerate}>
                    Gerar Trilha de Reforço (Apenas Premium)
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="pb-3 border-b border-border/40">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" /> Conquistas Recentes
                </CardTitle>
              </CardHeader>
                {user && (user.xp || 0) >= 100 ? (
                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-default">
                    <div className="h-10 w-10 rounded-full bg-yellow-500/10 flex items-center justify-center shrink-0 border border-yellow-500/30 shadow-inner">
                      <span className="text-xl">⭐</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold">Primeiro Passo</h4>
                      <p className="text-[10px] text-muted-foreground">Alcançou 100 de Experiência (XP).</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                     <p className="text-sm">Nenhuma conquista ainda.</p>
                     <p className="text-xs opacity-70 mt-1">Complete missões para desbloquear!</p>
                  </div>
                )}
                
                {user && (user.xp || 0) >= 500 && (
                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-default">
                    <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/30 shadow-inner">
                      <span className="text-xl">🏃‍♂️</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold">Iniciante Focado</h4>
                      <p className="text-[10px] text-muted-foreground">Ultrapassou a marca de 500 XP.</p>
                    </div>
                  </div>
                )}

                <div className="pt-2 border-t border-border/40 mt-2">
                  <Link href="/dashboard/conquistas" className="text-xs text-primary font-bold w-full text-center hover:underline block py-1">
                    Ver Galeria de Conquistas →
                  </Link>
                </div>
            </Card>

          </div>

        </div>
      </main>
    </div>
  );
}
