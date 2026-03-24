"use client";

import Link from "next/link";
import { BrainCircuit, ArrowLeft, CreditCard, Check, Zap, Clock, ShieldCheck, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";


export default function SubscriptionPage() {
  const features = [
    "Banco com +150.000 questões",
    "Correção de redação ilimitada por IA",
    "Cronograma de estudos adaptativo",
    "Simulados inéditos mensais",
    "Suporte prioritário 24/7",
    "Resoluções em vídeo comentadas"
  ];

  const plans = [
    {
      name: "Gratuito",
      price: "R$ 0",
      description: "Ideal para começar.",
      current: false,
      features: ["Acesso ao Banco de Questões", "Somente visualização do gabarito definitivo"],
      buttonText: "Plano Atual",
      glow: "hover:shadow-[0_0_40px_-5px_rgba(59,130,246,0.8)] hover:border-blue-500 hover:scale-[1.02]",
      accent: "text-blue-500",
      borderGlow: "group-hover:border-blue-500/50"
    },
    {
      name: "Jornada Completa",
      price: "R$ 49,90",
      description: "O mais popular para aprovação.",
      current: true,
      features: [
        "1 Trilha de Estudos adaptativa",
        "Até 5 correções de redação por mês",
        "Acesso completo ao Banco de Questões",
        "Resoluções e gabaritos comentados",
        "Simulados ilimitados"
      ],
      buttonText: "Seu Plano",
      glow: "hover:shadow-[0_0_40px_-5px_rgba(16,185,129,0.8)] hover:border-emerald-500 hover:scale-[1.02]",
      accent: "text-emerald-500",
      borderGlow: "group-hover:border-emerald-500/50"
    },
    {
      name: "Jornada Premium",
      price: "R$ 89,90",
      description: "Mentoria e acompanhamento 1-1.",
      current: false,
      features: [
        "Trilhas de Estudos ILIMITADAS",
        "Correções de redação ILIMITADAS",
        "Acesso completo ao Banco de Questões",
        "Resoluções guiadas pela Inteligência Artificial",
        "Simulados ilimitados padrão TRI"
      ],
      buttonText: "Fazer Upgrade",
      glow: "hover:shadow-[0_0_40px_-5px_rgba(236,72,153,0.8)] hover:border-pink-500 hover:scale-[1.02]",
      accent: "text-pink-500",
      borderGlow: "group-hover:border-pink-500/50"
    }



  ];

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

      <main className="p-8 max-w-6xl mx-auto">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Sua Assinatura</h1>
          <p className="text-muted-foreground">Gerencie seu plano, faturas e métodos de pagamento com facilidade.</p>
        </div>

        {/* Current Plan Highlight */}
        <section className="mb-12">
          <Card className="bg-primary/5 border-primary/20 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
              <Zap className="h-24 w-24 text-primary fill-primary" />
            </div>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div>
                <Badge variant="secondary" className="mb-2 bg-primary/20 text-primary hover:bg-primary/30 border-transparent">Jornada Completa</Badge>
                <CardTitle className="text-3xl">Jornada Completa (Anual)</CardTitle>

                <CardDescription className="text-base mt-2">Próxima renovação em 15 de Março de 2027</CardDescription>
              </div>
              <div className="flex flex-col items-end gap-2 text-right">
                <span className="text-4xl font-black text-primary">R$ 499,00/ano</span>
                <span className="text-xs text-muted-foreground">Economia de R$ 100,00 comparado ao mensal</span>
              </div>
            </CardHeader>
            <CardFooter className="bg-primary/10 border-t border-primary/20 flex justify-between items-center py-4 px-8">
              <div className="flex items-center gap-4 text-sm font-medium">
                <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
                  <ShieldCheck className="h-4 w-4" /> Ativo
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="h-4 w-4" /> Mensalidade em dia
                </div>
              </div>
              <div className="flex gap-4">
                <Button variant="ghost" className="text-sm">Alterar Cartão</Button>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg">Gerenciar Assinatura</Button>
              </div>
            </CardFooter>
          </Card>
        </section>

        {/* Plan Comparison Grid */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Planos Disponíveis</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, i) => (
              <Card 
                key={i} 
                className={cn(
                  "flex flex-col border-border/50 transition-all duration-300 group cursor-pointer",
                  plan.glow,
                  plan.current ? 'ring-2 ring-primary border-primary bg-primary/[0.02]' : 'bg-card'
                )}
              >


                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    {plan.name}
                    {plan.current && <Badge className="bg-primary font-bold">Atual</Badge>}
                  </CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="pt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-sm text-muted-foreground ml-1">/mês</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    {plan.features.map((feat, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm">
                        <Check className={cn("h-4 w-4 shrink-0 mt-0.5", plan.accent)} />
                        <span>{feat}</span>

                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant={plan.current ? "secondary" : "outline"} className={`w-full ${plan.current ? 'cursor-default opacity-80' : ''}`} disabled={plan.current}>
                    {plan.buttonText}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* Invoice Summary */}
        <section>
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Histórico de Cobrança
              </CardTitle>
              <CardDescription>Consulte suas últimas faturas e baixe seus recibos.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-border/50 border rounded-xl overflow-hidden bg-background/50">
                {[
                  { date: "15/03/2026", amount: "R$ 499,00", method: "Visa •••• 4242", status: "Pago" },
                  { date: "15/03/2025", amount: "R$ 499,00", method: "Visa •••• 4242", status: "Pago" }
                ].map((inv, i) => (
                  <div key={i} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex gap-8">
                      <div className="flex flex-col">
                        <span className="text-xs uppercase font-bold text-muted-foreground tracking-wider">Data</span>
                        <span className="font-medium">{inv.date}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs uppercase font-bold text-muted-foreground tracking-wider">Valor</span>
                        <span className="font-medium">{inv.amount}</span>
                      </div>
                      <div className="flex flex-col hidden sm:flex">
                        <span className="text-xs uppercase font-bold text-muted-foreground tracking-wider">Método</span>
                        <span className="font-medium text-sm">{inv.method}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="secondary" className="bg-green-500/10 text-green-600 dark:text-green-400 border-transparent">{inv.status}</Badge>
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
