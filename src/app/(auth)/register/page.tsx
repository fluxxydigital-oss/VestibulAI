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

export default function RegisterPage() {
  const router = useRouter();
  const { register, loading, error } = useAuth();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [targetCourse, setTargetCourse] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await register(name, email, password, confirmPassword, targetCourse);
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
          src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2670&auto=format&fit=crop" 
          alt="Mesa de estudos e anotações" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale"
        />
        {/* Background Effects Overlay */}
        <div className="absolute inset-0 bg-zinc-950/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>
        
        <div className="relative z-10">
          <Link className="flex items-center font-bold text-3xl tracking-tight text-white" href="/" suppressHydrationWarning>
            <BrainCircuit className="h-8 w-8 mr-2 text-primary" suppressHydrationWarning />
            <span>Vestibul<span className="text-primary">AI</span></span>
          </Link>
        </div>
        
        <div className="relative z-10 max-w-lg mt-auto">
          <h1 className="text-4xl font-bold tracking-tight mb-4 leading-tight text-white drop-shadow-md">
            Seu tempo é precioso. <br /> Estude o que importa.
          </h1>
          <p className="text-lg text-zinc-200 mb-8 leading-relaxed">
            Nossa plataforma utiliza inteligência artificial para entender suas dificuldades, gerando simulados e revisões sob medida para os vestibulares do Brasil.
          </p>
          <div className="flex items-center space-x-4">
            <div className="flex -space-x-3">
              {[11, 12, 16, 22].map((n) => (
                <img key={n} src={`https://i.pravatar.cc/100?img=${n}`} alt="User" className="w-10 h-10 rounded-full border-2 border-zinc-500/30" />
              ))}
            </div>
            <p className="text-sm font-medium text-zinc-300">
              Faça parte da nova geração de aprovados.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="flex items-center justify-center p-8 bg-background relative overflow-y-auto">
        {/* Mobile Header (Only visible on mobile) */}
        <div className="absolute top-8 left-8 lg:hidden">
          <Link className="flex items-center font-bold text-2xl tracking-tight text-foreground" href="/">
            <BrainCircuit className="h-6 w-6 mr-2 text-primary" />
            <span>Vestibul<span className="text-primary">AI</span></span>
          </Link>
        </div>

        <div className="w-full max-w-[400px] space-y-8 my-auto">
          <div className="space-y-2 text-center lg:text-left mt-12 lg:mt-0">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Criar sua conta</h2>
            <p className="text-muted-foreground">
              Comece agora sua jornada rumo à aprovação com IA.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground font-medium">Nome completo</Label>
                <Input 
                  id="name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Joana Silva" 
                  className="h-11 px-4 bg-background/50 border-border focus:ring-primary/20"
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-medium">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="estudante@exemplo.com" 
                  className="h-11 px-4 bg-background/50 border-border focus:ring-primary/20"
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground font-medium">Senha</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Crie uma senha de no min. 6 caracteres"
                  className="h-11 px-4 bg-background/50 border-border focus:ring-primary/20"
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-foreground font-medium">Confirmar Senha</Label>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirme a senha"
                  className="h-11 px-4 bg-background/50 border-border focus:ring-primary/20"
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="target" className="text-foreground font-medium">Curso Desejado</Label>
                <Input 
                  id="target" 
                  value={targetCourse}
                  onChange={(e) => setTargetCourse(e.target.value)}
                  placeholder="Ex: Medicina na USP" 
                  className="h-11 px-4 bg-background/50 border-border focus:ring-primary/20"
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
              className="w-full h-12 text-base font-medium mt-6 shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all disabled:opacity-50"
            >
              {loading ? "Criando conta..." : "Criar conta e começar"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Já tem uma jornada em andamento?{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline transition-all">
              Entre aqui
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
