import Link from "next/link";
import { BrainCircuit, ArrowLeft, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Planos() {
  return (
    <div className="min-h-screen bg-background flex flex-col py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-12 flex items-center justify-between border-b border-border/40 pb-6">
          <Link className="flex items-center font-bold text-2xl tracking-tight" href="/">
            <BrainCircuit className="h-6 w-6 mr-2 text-primary" />
            <span>Vestibul<span className="text-primary">AI</span></span>
          </Link>
          <Button variant="ghost" render={<Link href="/" />}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Início
          </Button>
        </div>

        <section className="mb-16 text-center">
          <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">Preços Simples e Transparentes</Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
            Invista no seu <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 dark:from-blue-400 to-primary">Futuro</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Escolha o plano ideal para a sua rotina de estudos. Cancelamento a qualquer momento, sem taxas ocultas. Comece com 7 dias grátis.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
          {/* Plano Gratuito */}
          <div className="bg-card border border-border/50 rounded-3xl p-8 flex flex-col relative transition-all duration-300 hover:border-primary/50 hover:shadow-xl">
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-2">Gratuito</h3>
              <p className="text-muted-foreground">Experimente a plataforma básica.</p>
            </div>
            <div className="mb-8 flex items-baseline gap-2">
              <span className="text-5xl font-extrabold">R$ 0</span>
              <span className="text-muted-foreground font-medium">/mês</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Acesso ao Banco de Questões</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Somente visualização do gabarito definitivo</span>
              </li>
              <li className="flex items-start gap-3 opacity-50">
                <CheckCircle2 className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <span className="text-muted-foreground line-through">Resoluções comentadas pela IA</span>
              </li>
            </ul>
            <Button size="lg" variant="outline" className="w-full text-lg font-semibold rounded-full border-primary text-primary hover:bg-primary/10" render={<Link href="/register?plan=free" />}>
              Criar Conta Grátis
            </Button>
          </div>

          {/* Jornada Completa */}
          <div className="bg-card border-2 border-primary rounded-3xl p-8 flex flex-col relative shadow-xl shadow-primary/10 transform md:-translate-y-2">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <Badge className="bg-primary text-primary-foreground border-none font-bold px-4 py-1.5 shadow-md flex gap-1 items-center">
                <Sparkles className="h-4 w-4" />
                Recomendado
              </Badge>
            </div>
            <div className="mb-8 mt-2">
              <h3 className="text-2xl font-bold mb-2">Jornada Completa</h3>
              <p className="text-muted-foreground">Perfeito para focar na reta final.</p>
            </div>
            <div className="mb-8 flex items-baseline gap-2">
              <span className="text-5xl font-extrabold">R$ 59,90</span>
              <span className="text-muted-foreground font-medium">/mês</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              {[
                "1 Trilha de Estudos adaptativa",
                "Até 5 correções de redação por mês",
                "Acesso completo ao Banco de Questões",
                "Resoluções e gabaritos comentados",
                "Simulados ilimitados"
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>
            <Button size="lg" className="w-full text-lg font-semibold rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-md" render={<Link href="/register?plan=completa" />}>
              Assinar Jornada Completa
            </Button>
          </div>

          {/* Jornada Premium */}
          <div className="bg-card border border-border/50 rounded-3xl p-8 flex flex-col relative transition-all duration-300 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/20 bg-gradient-to-br from-background to-purple-500/5">
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">Jornada Premium</h3>
              <p className="text-muted-foreground">O ecossistema completo para a aprovação.</p>
            </div>
            <div className="mb-8 flex items-baseline gap-2">
              <span className="text-5xl font-extrabold">R$ 119,90</span>
              <span className="text-muted-foreground font-medium">/mês</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              {[
                "Trilhas de Estudos ILIMITADAS",
                "Correções de redação ILIMITADAS",
                "Acesso completo ao Banco de Questões",
                "Resoluções guiadas pela Inteligência Artificial",
                "Simulados ilimitados padrão TRI"
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-purple-500 shrink-0 mt-0.5" />
                  <span className="text-foreground font-medium">{feature}</span>
                </li>
              ))}
            </ul>
            <Button size="lg" className="w-full text-lg font-bold rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-xl shadow-purple-500/25 transition-all hover:scale-[1.02]" render={<Link href="/register?plan=premium" />}>
              Assinar Jornada Premium
            </Button>
          </div>
        </div>

        <div className="mt-20 border-t border-border/40 pt-16 text-center max-w-3xl mx-auto">
          <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-8 mx-auto mb-6 opacity-50 grayscale" />
          <h3 className="text-xl font-bold mb-4">Pagamento 100% Seguro</h3>
          <p className="text-muted-foreground">
            Os pagamentos são processados pela Stripe, a mesma infraestrutura utilizada por grandes empresas de tecnologia do mundo. Seus dados de cartão nunca passam pelos nossos servidores.
          </p>
        </div>

      </div>
    </div>
  );
}
