"use client";

import Link from "next/link";
import { BrainCircuit, ArrowLeft, Settings, Bell, Lock, Languages, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="flex h-16 items-center px-8 justify-between">
          <Link className="flex items-center font-bold text-xl tracking-tight" href="/dashboard">
            <BrainCircuit className="h-6 w-6 mr-2 text-primary" />
            <span>Vestibul<span className="text-primary">AI</span></span>
          </Link>
          <Button variant="ghost" size="sm" render={<Link href="/dashboard" />}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Dashboard
          </Button>
        </div>
      </header>

      <main className="p-8 max-w-4xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
          <p className="text-muted-foreground mt-1">Personalize sua experiência no VestibulAI.</p>
        </div>

        <div className="space-y-8">

          {/* Notifications Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Bell className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold">Notificações</h2>
            </div>
            <Card className="border-border/50">
              <CardContent className="pt-6 space-y-6">
                {[
                  { title: "Lembretes de Estudo", desc: "Avisos para manter sua ofensiva ativa.", active: true },
                  { title: "Novidades e Updates", desc: "Fique por dentro de novas questões e recursos.", active: false },
                  { title: "Progresso da IA", desc: "Avisos quando a IA terminar de analisar seu simulado.", active: true }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium">{item.title}</div>
                      <div className="text-sm text-muted-foreground">{item.desc}</div>
                    </div>
                    <div className={`w-10 h-6 rounded-full relative transition-colors cursor-pointer ${item.active ? 'bg-primary' : 'bg-muted'}`}>
                      <div className={`absolute top-1 w-4 h-4 bg-background rounded-full shadow-sm transition-all ${item.active ? 'right-1' : 'left-1'}`}></div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>

          {/* Account & Security Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Lock className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold">Conta e Segurança</h2>
            </div>
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Segurança</CardTitle>
                <CardDescription>Gerencie suas senhas e sessões ativas.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <Smartphone className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium">Autenticação em Duas Etapas (2FA)</div>
                      <div className="text-xs text-muted-foreground underline group-hover:text-primary decoration-primary/20">Configurar agora</div>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-tight">Recomendado</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-lg text-muted-foreground">
                      <Languages className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium">Idioma da Interface</div>
                      <div className="text-xs text-muted-foreground">Português (Brasil)</div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Alterar</Button>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="pt-4 border-t border-border/50">
            <h3 className="text-sm font-bold text-destructive mb-3 uppercase tracking-wider">Zona de Perigo</h3>
            <div className="flex items-center justify-between p-4 border border-destructive/20 bg-destructive/[0.02] rounded-lg">
              <div className="space-y-0.5">
                <div className="font-medium text-destructive">Excluir Conta</div>
                <div className="text-sm text-muted-foreground">Esta ação é irreversível e apagará todos os seus dados.</div>
              </div>
              <Button variant="ghost" className="text-destructive hover:bg-destructive hover:text-white border border-destructive/20 transition-all">Excluir Permanente</Button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
