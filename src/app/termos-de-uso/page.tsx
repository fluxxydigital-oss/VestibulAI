import Link from "next/link";
import { BrainCircuit, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TermosDeUso() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl">
        <div className="mb-8 flex items-center justify-between border-b border-border/40 pb-6">
          <Link className="flex items-center font-bold text-2xl tracking-tight" href="/">
            <BrainCircuit className="h-6 w-6 mr-2 text-primary" />
            <span>Vestibul<span className="text-primary">AI</span></span>
          </Link>
          <Button variant="ghost" render={<Link href="/" />}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Início
          </Button>
        </div>

        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <h1 className="text-3xl font-extrabold tracking-tight mb-8">Termos de Uso</h1>
          
          <p className="lead text-lg text-muted-foreground mb-8">
            Bem-vindo ao VestibulAI. Ao utilizar nossa plataforma, você concorda com os seguintes termos e condições.
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-foreground">1. Aceitação dos Termos</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Ao acessar ou utilizar a plataforma VestibulAI, você concorda em ficar vinculado a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, você não terá permissão para acessar o serviço.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-foreground">2. Uso da Plataforma</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              O VestibulAI é uma plataforma de tecnologia educacional focada na preparação para vestibulares. Você se compromete a utilizar nossos serviços apenas para fins lícitos e de maneira que não infrinja os direitos de terceiros ou restrinja o uso da plataforma por outros.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-foreground">3. Contas de Usuário</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Ao criar uma conta, você é responsável por manter a confidencialidade de sua senha e por todas as atividades que ocorrerem sob sua conta. O VestibulAI se reserva o direito de encerrar contas em caso de violação destes termos.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-foreground">4. Propriedade Intelectual</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Todo o conteúdo presente na plataforma, incluindo textos, gráficos, logotipos, ícones, imagens, clipes de áudio e software, é propriedade exclusiva do VestibulAI ou de seus fornecedores de conteúdo, protegido pelas leis de direitos autorais.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-foreground">5. Limitação de Responsabilidade</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              O VestibulAI não se responsabiliza por quaisquer danos diretos, indiretos, incidentais ou consequentes resultantes do uso ou da incapacidade de usar nossos serviços ou conteúdos da plataforma.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-foreground">6. Alterações nos Termos</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações entrarão em vigor imediatamente após a publicação na plataforma. O uso contínuo da plataforma após tais mudanças constitui a aceitação dos novos termos.
            </p>
          </section>

          <div className="mt-12 pt-8 border-t border-border/40 text-sm text-muted-foreground">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </div>
        </div>
      </div>
    </div>
  );
}
