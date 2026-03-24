import Link from "next/link";
import { BrainCircuit, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PoliticaDePrivacidade() {
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
          <h1 className="text-3xl font-extrabold tracking-tight mb-8">Política de Privacidade</h1>
          
          <p className="lead text-lg text-muted-foreground mb-8">
            A sua privacidade é importante para nós. Esta Política de Privacidade explica como o VestibulAI coleta, usa e protege as suas informações pessoais.
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-foreground">1. Informações que Coletamos</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Coletamos informações que você nos fornece diretamente ao se registrar na plataforma, como nome, e-mail e dados de perfil estudantil. Também podemos coletar dados de uso para melhorar nossos serviços.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-foreground">2. Uso das Informações</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              As informações coletadas são utilizadas para fornecer, manter e melhorar nossos serviços, além de personalizar sua experiência de aprendizado, gerar cronogramas de estudo e enviar comunicações relevantes sobre a plataforma.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-foreground">3. Proteção de Dados</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Implementamos medidas de segurança apropriadas para proteger suas informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição. Seus dados são armazenados em servidores seguros.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-foreground">4. Compartilhamento de Informações</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros, exceto quando necessário para fornecer nossos serviços (como provedores de hospedagem) ou quando exigido por lei.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-foreground">5. Seus Direitos (LGPD)</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018), você, como titular dos dados, possui direitos estritos sobre as suas informações, que incluem:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
              <li><strong>Confirmação e Acesso:</strong> Direito de saber se tratamos seus dados e de acessá-los.</li>
              <li><strong>Correção:</strong> Direito de solicitar a correção de dados incompletos, inexatos ou desatualizados.</li>
              <li><strong>Anonimização, bloqueio ou eliminação:</strong> Direito de solicitar que dados desnecessários ou excessivos sejam anonimizados ou apagados.</li>
              <li><strong>Portabilidade:</strong> Direito de transferir seus dados para outro fornecedor de serviço.</li>
              <li><strong>Revogação do consentimento:</strong> Direito de retirar o consentimento para o tratamento de dados a qualquer momento.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              Para exercer qualquer um desses direitos, entre em contato conosco através dos canais de suporte da plataforma ou pelo e-mail de privacidade (privacidade@vestibulai.com.br).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-foreground">6. Cookies e Tecnologias de Rastreamento</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Utilizamos cookies para melhorar a experiência do usuário, analisar o tráfego e personalizar o conteúdo. Você pode gerenciar suas preferências de cookies nas configurações do seu navegador.
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
