"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useAuth } from "@/lib/hooks";


import { 
  BrainCircuit, 
  ArrowLeft, 
  User, 
  Mail, 
  Calendar, 
  MapPin, 
  Save, 
  Camera, 
  ChevronRight,
  GraduationCap,
  Loader2,
  Sun,
  Moon,
  Monitor,
  Zap,
  ZapOff,
  ShieldCheck,
  Target,
  LogOut
} from "lucide-react";


import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ProfilePage() {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  
  // Real subscription type mapped to the UI types
  const subscriptionType: 'free' | 'complete' | 'premium' = user?.plan?.toLowerCase() === 'pro' ? 'complete' : (user?.plan?.toLowerCase() as any || "free");

  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [reduceAnimations, setReduceAnimations] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    setReduceAnimations(document.body.classList.contains("reduce-animations"));
  }, []);

  const toggleAnimations = () => {
    const newValue = !reduceAnimations;
    setReduceAnimations(newValue);
    if (newValue) {
      document.body.classList.add("reduce-animations");
    } else {
      document.body.classList.remove("reduce-animations");
    }
  };

  const subConfigs = {

    free: {
      label: "Jornada Gratuita",
      gradient: "from-blue-600/20 via-blue-500/10 to-transparent",
      badge: "bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20",
      accent: "text-blue-500"
    },
    complete: {
      label: "Jornada Completa",
      gradient: "from-emerald-600/20 via-emerald-500/10 to-transparent",
      badge: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20",
      accent: "text-emerald-500"
    },
    premium: {
      label: "Jornada Premium",
      gradient: "from-pink-600/20 via-pink-500/10 to-transparent",
      badge: "bg-pink-500/10 text-pink-500 border-pink-500/20 hover:bg-pink-500/20",
      accent: "text-pink-500"
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const config = subConfigs[subscriptionType];

  // Máscaras de Input
  const [birthDate, setBirthDate] = useState(user?.birthDate || "");
  const birthDateRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [phone, setPhone] = useState(user?.phone || "");

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 8) value = value.slice(0, 8);
    
    if (value.length > 4) {
      value = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4)}`;
    } else if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    
    setBirthDate(value);
  };

  const [fullName, setFullName] = useState(user?.name || "");
  const [targetCourseState, setTargetCourse] = useState(user?.targetCourse || "");
  const [avatarUrl, setAvatarUrl] = useState(user?.image || "");
  const [changedAvatarBase64, setChangedAvatarBase64] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const { checkAuthStatus } = useAuth(); // Destructure checkAuthStatus

  const resizeImageToBase64 = (file: File, maxSize = 1024, quality = 0.8): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      const image = new Image();

      reader.onload = () => {
        image.src = reader.result as string;
      };

      reader.onerror = () => reject(new Error("Falha ao ler o arquivo de imagem."));

      image.onload = () => {
        const canvas = document.createElement("canvas");
        let width = image.width;
        let height = image.height;

        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          } else {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          return reject(new Error("Falha ao criar o contexto do canvas."));
        }

        ctx.drawImage(image, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL("image/jpeg", quality);
        resolve(compressedBase64);
      };

      image.onerror = () => reject(new Error("Falha ao processar a imagem."));

      reader.readAsDataURL(file);
    });
  };

  useEffect(() => {
     if (user) {
        setFullName(user.name || "");
        setTargetCourse(user.targetCourse || "");
        if (user.phone) setPhone(user.phone);
        if (user.birthDate) setBirthDate(user.birthDate);
        // Only update avatarUrl from user if there's no pending change
        // (changedAvatarBase64 is set when user selects a new image)
        if (user.image && !changedAvatarBase64) setAvatarUrl(user.image);
     }
  }, [user, changedAvatarBase64]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFileError("Por favor selecione um arquivo de imagem válido.");
      e.target.value = "";
      return;
    }

    try {
      let base64: string;

      if (file.size > 2 * 1024 * 1024) {
        base64 = await resizeImageToBase64(file, 1024, 0.8);
      } else {
        base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            if (reader.result) resolve(reader.result as string);
            else reject(new Error("Falha ao ler a imagem."));
          };
          reader.onerror = () => reject(new Error("Falha ao ler a imagem."));
          reader.readAsDataURL(file);
        });
      }

      setChangedAvatarBase64(base64);
      setAvatarUrl(base64);
      e.target.value = "";
    } catch (error) {
      console.error(error);
      setFileError("Não foi possível processar a imagem. Tente outro arquivo ou um arquivo menor.");
      e.target.value = "";
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);
    
    if (value.length > 7) {
      value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
    } else if (value.length > 2) {
      value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    } else if (value.length > 0) {
      value = `(${value}`;
    }
    
    setPhone(value);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setFileError(null);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: fullName,
          targetCourse: targetCourseState,
          phone,
          birthDate,
          ...(changedAvatarBase64 && { image: changedAvatarBase64 })
        })
      });

      const result = await res.json().catch(() => null);

      if (!res.ok) {
        const message = result?.message || result?.error || 'Erro ao salvar perfil';
        throw new Error(message);
      }

      // Update local preview based on saved user payload
      if (result?.data?.user?.image) {
        setAvatarUrl(result.data.user.image);
      }

      // Refresh user info first (this updates user.image)
      await checkAuthStatus();

      // Now clear the pending change so useEffect can sync avatarUrl with user.image
      setChangedAvatarBase64(null);

      alert(result?.message || "Perfil atualizado com sucesso!");
    } catch (e) {
      console.error(e);
      setFileError((e as Error).message || "Falha ao salvar o perfil.");
      alert(`Falha ao salvar o perfil: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  };


  return (
    <div className="min-h-screen bg-background selection:bg-primary/30">
      {/* Header with glassmorphism */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex h-16 items-center px-6 md:px-8 justify-between">
          <Link className="flex items-center gap-2 font-bold text-xl tracking-tight group" href="/dashboard">
            <div className="bg-primary/10 p-1.5 rounded-lg group-hover:bg-primary/20 transition-colors">
              <BrainCircuit className="h-5 w-5 text-primary" />
            </div>
            <span>Vestibul<span className="text-primary">AI</span></span>
          </Link>
          <Button variant="ghost" size="sm" className="hover:bg-muted font-medium py-2" render={<Link href="/dashboard" />}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Dashboard
          </Button>
        </div>
      </header>

      <main className="p-4 md:p-8 max-w-5xl mx-auto container animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Profile Hero Section */}
        <div className="relative mb-10 overflow-hidden rounded-3xl border border-border/50 bg-card shadow-2xl shadow-primary/5">
          <div className={`absolute top-0 left-0 w-full h-32 bg-gradient-to-r ${config.gradient}`}></div>
          <div className="relative p-8 pt-12 flex flex-col md:flex-row items-center md:items-end gap-6">
            <div className="relative group">
              <Avatar className="h-32 w-32 border-4 border-background shadow-2xl ring-4 ring-primary/5">
                <AvatarImage
                  key={avatarUrl}
                  src={avatarUrl || undefined}
                  alt="Foto de perfil"
                  className="object-cover"
                />
                <AvatarFallback className={`text-4xl font-black bg-gradient-to-br ${subscriptionType === "premium" ? 'from-pink-500/20 to-pink-500/5 text-pink-500' : 'from-primary/20 to-primary/5 text-primary'}`}>
                  {user?.name?.split(' ').filter(Boolean).map(n => n[0]).join('') || user?.email?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
              />
              <button 
                onClick={handleCameraClick}
                className="absolute bottom-2 right-2 p-2 rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-110 transition-transform flex items-center justify-center border-2 border-background"
                title="Alterar foto de perfil"
              >
                <Camera className="h-4 w-4" />
              </button>

              {fileError && (
                <p className="text-xs text-destructive mt-2 absolute left-0 right-0 bottom-[-1.8rem] text-center">
                  {fileError}
                </p>
              )}
            </div>

            <div className="flex-1 text-center md:text-left space-y-2">
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                <h1 className="text-3xl font-black tracking-tight">{user?.name || "Estudante da VestibulAI"}</h1>
                <Badge className={`w-fit mx-auto md:mx-0 flex items-center gap-1 ${config.badge}`}>
                  <ShieldCheck className="h-3 w-3" /> {config.label}
                </Badge>
              </div>
              <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-2">
                <Mail className="h-4 w-4 opacity-70" /> {user?.email || "carregando email..."}
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
                <div className="text-sm font-semibold flex items-center gap-1.5 px-3 py-1 bg-muted rounded-full border">
                  <Target className={`h-4 w-4 ${config.accent}`} /> {user?.targetCourse || "Não definido"}
                </div>
                <div className="text-sm text-muted-foreground font-medium">Membro oficial da plataforma</div>
              </div>
            </div>

          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar Info/Stats */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-border/50 bg-background/50 overflow-hidden border-l-4 border-l-primary shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Progresso Total</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <span className="text-4xl font-black">Nível 12</span>
                    <p className="text-xs text-muted-foreground mt-1">350 / 500 XP para Nvl 13</p>
                  </div>
                  <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                    <GraduationCap className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full w-[70%] transition-all duration-1000"></div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-background/50 shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" /> Metas Atuais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 rounded-xl border bg-card/50 hover:bg-card transition-colors cursor-pointer group">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm">{user?.targetCourse || "Defina sua meta"}</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Sua meta principal está ativa para 2026.</p>
                </div>

              </CardContent>
            </Card>
          </div>

          {/* Form Sections */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="border-b border-border/50 pb-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Informações Pessoais</CardTitle>
                    <CardDescription>Estes dados são usados para sua identificação e contato.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Nome Completo</label>
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border/60 bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">E-mail</label>
                  <div className="relative">
                    <input 
                      type="email" 
                      key={user?.email || "email"}
                      defaultValue={user?.email || ""} 
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-border/60 bg-background/50 text-muted-foreground outline-none cursor-not-allowed font-medium"
                      disabled
                    />
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 opacity-40" />
                  </div>
                  <p className="text-[10px] text-muted-foreground italic px-1">O e-mail não pode ser alterado através deste menu.</p>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Data de Nascimento</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={birthDate}
                      onChange={handleDateChange}
                      placeholder="DD/MM/YYYY"
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-border/60 bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none font-medium text-foreground"
                    />
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                  </div>

                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Telefone / WhatsApp</label>
                  <input 
                    type="text" 
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="(11) 99999-9999" 
                    className="w-full px-4 py-3 rounded-xl border border-border/60 bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none font-medium text-foreground"
                  />

                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm">
              <CardHeader className="border-b border-border/50 pb-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Vestibular e Metas</CardTitle>
                    <CardDescription>Defina qual vestibular você está focando para personalizar sua trilha.</CardDescription>
                  </div>

                </div>
              </CardHeader>
              <CardContent className="pt-8 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Vestibular de Preferência</label>
                    <input 
                      type="text"
                      className="w-full px-4 py-3 rounded-xl border border-border/60 bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none font-medium"
                      placeholder="Ex: Medicina USP"
                      value={targetCourseState}
                      onChange={(e) => setTargetCourse(e.target.value)}
                    />
                  </div>

                </div>

              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm">
              <CardHeader className="border-b border-border/50 pb-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                    <Monitor className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Aparência</CardTitle>
                    <CardDescription>Gerencie o tema e os efeitos visuais do sistema.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-8 space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <div className="text-sm font-bold">Tema do Sistema</div>
                    <div className="text-xs text-muted-foreground">Escolha entre o modo claro ou escuro.</div>
                  </div>
                  <div className="flex p-1 bg-muted rounded-xl border border-border/50 w-fit">
                    <button 
                      onClick={() => setTheme("light")}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${mounted && theme === "light" ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                      <Sun className="h-4 w-4" /> Claro
                    </button>
                    <button 
                      onClick={() => setTheme("dark")}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${mounted && theme === "dark" ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                      <Moon className="h-4 w-4" /> Escuro
                    </button>
                    <button 
                      onClick={() => setTheme("system")}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${mounted && theme === "system" ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                      <Monitor className="h-4 w-4" /> Sistema
                    </button>

                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 pt-4 border-t border-border/50">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg border shadow-sm ${reduceAnimations ? 'bg-amber-500/10 border-amber-500/20' : 'bg-primary/10 border-primary/20'}`}>
                      {reduceAnimations ? <ZapOff className="h-5 w-5 text-amber-500" /> : <Zap className="h-5 w-5 text-primary" />}
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-sm font-bold">Reduzir Animações</div>
                      <div className="text-xs text-muted-foreground">Desativa efeitos visuais dinâmicos para melhor performance.</div>
                    </div>
                  </div>
                  <button 
                    onClick={toggleAnimations}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${reduceAnimations ? 'bg-primary' : 'bg-muted'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${reduceAnimations ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              </CardContent>
            </Card>

            <div className="border-t border-border/50 pt-6 space-y-4">
              <div className="flex flex-col sm:flex-row justify-end gap-3 pb-4 border-b border-border/50">
                <Button variant="ghost" className="h-12 px-8 font-bold" render={<Link href="/dashboard" />}>Descartar Alterações</Button>
                <Button 
                   onClick={handleSaveProfile} 
                   disabled={saving}
                   className="h-12 px-10 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 gap-2 font-bold text-base transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                  {saving ? 'Salvando...' : 'Salvar Meu Perfil'}
                </Button>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  variant="destructive" 
                  className="h-12 px-8 font-bold gap-2 bg-destructive hover:bg-destructive/90 shadow-lg shadow-destructive/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/auth/logout', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                      });

                      if (!response.ok) {
                        console.error('Logout falhou', await response.text());
                      }
                    } catch (error) {
                      console.error('Erro ao fazer logout:', error);
                    } finally {
                      router.push('/login');
                    }
                  }}
                >
                  <LogOut className="h-5 w-5" />
                  Sair da Conta
                </Button>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
