"use client"
import { useAuth } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Trophy, Lock, ShieldCheck, Flame, Medal, Crown } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ConquistasPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      </div>
    );
  }

  const xp = user.xp || 0;
  const plan = user.plan || "FREE";

  // Dummy logic rules for achievements
  const conquistasIniciante = [
    { id: 1, title: "Primeiro Passo", desc: "Alcançou 100 de XP", icon: "⭐", unlocked: xp >= 100 },
    { id: 2, title: "Aquecimento", desc: "Alcançou 300 de XP", icon: "🔥", unlocked: xp >= 300 },
    { id: 3, title: "Iniciante Focado", desc: "Ultrapassou 500 XP", icon: "🏃‍♂️", unlocked: xp >= 500 },
  ];

  const conquistasIntermediario = [
    { id: 4, title: "Estudioso", desc: "Alcançou 1.500 XP", icon: "📚", unlocked: xp >= 1500 },
    { id: 5, title: "Prata da Casa", desc: "Alcançou 3.000 XP", icon: "🥈", unlocked: xp >= 3000 },
    { id: 6, title: "Mestre da Base", desc: "Alcançou 5.000 XP", icon: "🏆", unlocked: xp >= 5000 },
  ];

  const conquistasAvancado = [
    { id: 7, title: "Maratonista", desc: "Alcançou 10.000 XP", icon: "🥇", unlocked: xp >= 10000 },
    { id: 8, title: "O Sábio", desc: "Alcançou 15.000 XP", icon: "🧠", unlocked: xp >= 15000 },
    { id: 9, title: "Lenda Viva", desc: "Alcançou 25.000 XP", icon: "🐉", unlocked: xp >= 25000 },
  ];

  const conquistasPremium = [
    { id: 10, title: "Redação Nota 1000", desc: "Análise perfeita da IA na redação", icon: "📝", unlocked: plan === 'PREMIUM' && xp >= 5000 },
    { id: 11, title: "Radar Afiado", desc: "Concluiu 10 trilhas guiadas por IA", icon: "🤖", unlocked: plan === 'PREMIUM' && xp >= 8000 },
    { id: 12, title: "Realeza", desc: "Chegou aos 20.000 XP sendo um assinante Premium", icon: "👑", unlocked: plan === 'PREMIUM' && xp >= 20000 },
  ];

  const renderAchievementCard = (ach: any, isPremiumSection: boolean = false) => {
    const isLocked = !ach.unlocked;
    // Se a seção for premium e o usuário não for, forçamos aparência bloqueada + badge
    const isPlanBlocked = isPremiumSection && plan !== 'PREMIUM';

    return (
      <div 
        key={ach.id} 
        className={`relative flex items-center gap-4 p-4 rounded-xl border transition-all ${isLocked || isPlanBlocked ? 'bg-muted/20 border-border/40 grayscale' : 'bg-card border-primary/20 shadow-sm hover:border-primary/50'}`}
      >
        <div className={`h-14 w-14 rounded-full flex items-center justify-center shrink-0 border-2 shadow-inner text-2xl
          ${isLocked || isPlanBlocked ? 'bg-muted border-muted-foreground/20' : isPremiumSection ? 'bg-gradient-to-br from-yellow-400 to-amber-600 border-yellow-200' : 'bg-primary/10 border-primary/30'}`}>
          {isLocked && !isPlanBlocked ? <Lock className="h-6 w-6 text-muted-foreground/50" /> : ach.icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className={`text-md font-bold ${isLocked || isPlanBlocked ? 'text-muted-foreground' : 'text-foreground'}`}>
              {ach.title}
            </h4>
            {isPlanBlocked && <Badge variant="secondary" className="text-[8px] bg-yellow-500/10 text-yellow-600 uppercase px-1.5 py-0 border-yellow-500/20"><Lock className="w-2 h-2 mr-1 inline"/>Pro</Badge>}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{ach.desc}</p>
        </div>
        {!(isLocked || isPlanBlocked) && (
          <div className="absolute top-2 right-2 flex items-center justify-center bg-green-500 text-white rounded-full p-0.5">
            <ShieldCheck className="w-4 h-4" />
          </div>
        )}
      </div>
    );
  };

  const completedTotal = [...conquistasIniciante, ...conquistasIntermediario, ...conquistasAvancado, ...conquistasPremium].filter(a => a.unlocked).length;
  const totalConquistas = conquistasIniciante.length + conquistasIntermediario.length + conquistasAvancado.length + conquistasPremium.length;

  return (
    <div className="flex min-h-screen w-full flex-col bg-background/50">
      <header className="sticky top-0 z-30 flex h-20 items-center gap-4 border-b border-border/50 bg-background/95 backdrop-blur px-4 md:px-8">
        <Link href="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer group">
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Voltar ao Painel</span>
        </Link>
        <div className="ml-auto w-full max-w-sm sm:max-w-max flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-bold leading-none">{user.name}</p>
            <p className="text-xs text-muted-foreground mt-1">
               {completedTotal} de {totalConquistas} conquistas
            </p>
          </div>
          <div className="h-10 w-10 flex border-2 border-primary items-center justify-center rounded-full bg-primary/10 text-primary">
            <Trophy className="h-5 w-5" />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full p-4 md:p-8 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-4">
           <div>
             <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-2">Galeria de Conquistas <Medal className="h-6 w-6 text-yellow-500"/></h1>
             <p className="text-muted-foreground mt-1">Desbloqueie troféus e marcos ao completar missões, ganhar XP e assinar planos avançados.</p>
           </div>
           
           <div className="bg-card border rounded-xl p-3 shadow-sm min-w-[200px]">
              <div className="flex justify-between items-center mb-2">
                 <span className="text-xs font-bold text-muted-foreground">Progresso Global</span>
                 <span className="text-xs font-black text-primary">{Math.round((completedTotal/totalConquistas)*100)}%</span>
              </div>
              <Progress value={(completedTotal/totalConquistas)*100} className="h-2" />
           </div>
        </div>

        {/* Tier: Iniciante */}
        <section>
          <div className="flex items-center gap-2 mb-4">
             <Flame className="h-5 w-5 text-orange-500" />
             <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-500">Tier Iniciante</h2>
             <div className="h-px bg-border flex-1 ml-4 opacity-50 block"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {conquistasIniciante.map(a => renderAchievementCard(a))}
          </div>
        </section>

        {/* Tier: Intermediario */}
        <section>
          <div className="flex items-center gap-2 mb-4">
             <ShieldCheck className="h-5 w-5 text-blue-500" />
             <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-500">Tier Intermediário</h2>
             <div className="h-px bg-border flex-1 ml-4 opacity-50 block"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {conquistasIntermediario.map(a => renderAchievementCard(a))}
          </div>
        </section>

        {/* Tier: Avançado */}
        <section>
          <div className="flex items-center gap-2 mb-4">
             <Trophy className="h-5 w-5 text-purple-500" />
             <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-fuchsia-500">Tier Avançado</h2>
             <div className="h-px bg-border flex-1 ml-4 opacity-50 block"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {conquistasAvancado.map(a => renderAchievementCard(a))}
          </div>
        </section>

        {/* Tier: Premium */}
        <section className="relative">
          {plan !== 'PREMIUM' && (
             <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/80 backdrop-blur-[2px] rounded-2xl border border-dashed border-yellow-500/50">
                <Crown className="h-10 w-10 text-yellow-500 mb-2 opacity-80" />
                <h3 className="text-lg font-bold text-foreground">Conquistas Exclusivas</h3>
                <p className="text-sm text-muted-foreground mb-4">Faça o upgrade para desbloquear esse tier.</p>
                <Link href="/dashboard/assinatura">
                  <Button className="bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white border-0 shadow-lg shadow-amber-500/20">
                     Assinar Premium
                  </Button>
                </Link>
             </div>
          )}
          <div className="flex items-center gap-2 mb-4">
             <Crown className="h-5 w-5 text-amber-500" />
             <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-600">Tier Premium</h2>
             <div className="h-px bg-border flex-1 ml-4 opacity-50 block"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {conquistasPremium.map(a => renderAchievementCard(a, true))}
          </div>
        </section>

      </main>
    </div>
  );
}
