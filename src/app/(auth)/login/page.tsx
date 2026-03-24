"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { BrainCircuit, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/hooks";

export default function LoginPage() {
  const router = useRouter();
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = await login(email, password);
    if (success) {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left Side - Brand & Inspiration (Hidden on Mobile) */}
      <div className="hidden lg:flex relative bg-zinc-950 flex-col justify-between p-12 text-zinc-50 overflow-hidden border-r border-border/50">
        {/* Background Image */}
        <img 
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2671&auto=format&fit=crop" 
          alt="Estudantes estudando juntos" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale"
        />
        {/* Background Effects Overlay */}
        <div className="absolute inset-0 bg-zinc-950/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>
        
        <div className="relative z-10">
          <Link className="flex items-center font-bold text-3xl tracking-tight text-white" href="/">
            <BrainCircuit className="h-8 w-8 mr-2 text-primary" />
            <span>Vestibul<span className="text-primary">AI</span></span>
          </Link>
        </div>
        
        <div className="relative z-10 max-w-lg mt-auto">
          <h1 className="text-4xl font-bold tracking-tight mb-6 leading-tight text-white drop-shadow-md">
            Estude de forma estratégica <br /> e conquiste sua vaga.
          </h1>
          <blockquote className="space-y-4">
            <p className="text-lg italic text-zinc-200">
              "A VestibulAI revolucionou minha preparação. A inteligência artificial identificou minhas falhas e criou uma trilha exata para a minha aprovação."
            </p>
            <footer className="text-sm">
              <span className="font-semibold text-zinc-50">Mariana Souza</span>
              <span className="text-primary mx-2">—</span>
              <span className="text-zinc-300">Aprovada em Medicina na USP</span>
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex items-center justify-center p-8 bg-background relative">
        {/* Mobile Header (Only visible on mobile) */}
        <div className="absolute top-8 left-8 lg:hidden">
          <Link className="flex items-center font-bold text-2xl tracking-tight text-foreground" href="/">
            <BrainCircuit className="h-6 w-6 mr-2 text-primary" />
            <span>Vestibul<span className="text-primary">AI</span></span>
          </Link>
        </div>

        <div className="w-full max-w-[400px] space-y-8">
          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Boas-vindas de volta</h2>
            <p className="text-muted-foreground">
              Acesse sua conta para continuar sua trilha de estudos.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="estudante@exemplo.com"
                  className="h-12 px-4 bg-background/50 border-border focus:ring-primary/20"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-foreground font-medium">Senha</Label>
                  <Link href="#" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                    Esqueceu a senha?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="h-12 px-4 bg-background/50 border-border focus:ring-primary/20"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex gap-3">
                <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-sm text-destructive font-medium">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-base font-medium shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Entrando...
                </>
              ) : (
                "Entrar no sistema"
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Ainda não tem uma conta?{" "}
            <Link href="/register" className="font-semibold text-primary hover:underline transition-all">
              Cadastre-se gratuitamente
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
