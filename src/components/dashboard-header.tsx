"use client"

import { useState } from "react";
import { createPortal } from "react-dom";
import { BrainCircuit, User, CreditCard, Settings, LifeBuoy, Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/hooks";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PWAInstallButton } from "@/components/pwa-install";

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Trilha de Estudo", href: "/dashboard/trilha" },
  { label: "Diagnóstico", href: "/dashboard/diagnostico" },
  { label: "Matéria", href: "/dashboard/materia" },
  { label: "Questões", href: "/dashboard/questions" },
  { label: "Simulados", href: "/dashboard/simulados" },
  { label: "Redação", href: "/dashboard/redacao" },
  { label: "Conquistas", href: "/dashboard/conquistas" },
];

export function DashboardHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    router.push(href);
  };

  return (
    <>
      <header className="sticky top-0 z-40 flex h-20 items-center gap-4 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-8 shadow-sm">
        <Link className="flex items-center gap-3 font-bold text-2xl tracking-tight hover:opacity-90 transition-opacity" href="/dashboard">
          <div className="bg-gradient-to-br from-primary/20 to-purple-500/20 p-2 rounded-xl">
            <BrainCircuit className="h-6 w-6 text-primary" />
          </div>
          <span className="hidden sm:inline-block font-heading italic text-foreground tracking-tight">Vestibul<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 dark:from-blue-400 to-primary">AI</span></span>
        </Link>
        
        <div className="ml-auto w-full max-w-sm sm:max-w-max flex items-center justify-end gap-4 sm:gap-8">
          <button
            className="lg:hidden p-2 rounded-md border border-border/30 hover:bg-muted/30 transition z-40"
            onClick={() => {
              setMobileMenuOpen(true);
              document.body.style.overflow = 'hidden';
            }}
            aria-label="Abrir menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors whitespace-nowrap ${
                  pathname === item.href 
                    ? "text-primary font-bold" 
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <PWAInstallButton />
            <div className="hidden md:flex flex-col items-end">
              <span className="text-xs font-bold text-primary">Nível {user?.xp ? Math.floor(user.xp / 100) + 1 : 1}</span>
              <span className="text-[10px] text-muted-foreground">{(user?.xp || 0) % 100}/{100} XP</span>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary ring-offset-2">
                <Avatar className="h-11 w-11 border-2 border-primary/20 hover:border-primary transition-colors cursor-pointer shadow-sm relative group">
                  <AvatarImage src={user?.image || undefined} alt={user?.name || "Usuário"} />
                  <AvatarFallback className="font-bold bg-primary/10 text-primary text-lg">
                    {user?.name ? user.name.substring(0, 2).toUpperCase() : "US"}
                  </AvatarFallback>
                  <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground ring-2 ring-background z-10">
                    {user?.xp ? Math.floor(user.xp / 100) + 1 : 1}
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
                        {user?.email || "Sem email"}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuGroup className="p-1">
                  <Link href="/dashboard/perfil" className="w-full">
                    <DropdownMenuItem className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 hover:bg-primary/10 hover:text-primary cursor-pointer group">
                      <div className="bg-muted p-1.5 rounded-md group-hover:bg-primary/20 transition-colors">
                        <User className="h-4 w-4" />
                      </div>
                      <span className="font-medium">Perfil</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/dashboard/assinatura" className="w-full">
                    <DropdownMenuItem className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 hover:bg-primary/10 hover:text-primary cursor-pointer group">
                      <div className="bg-muted p-1.5 rounded-md group-hover:bg-primary/20 transition-colors">
                        <CreditCard className="h-4 w-4" />
                      </div>
                      <span className="font-medium">Assinatura</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/dashboard/configuracoes" className="w-full">
                    <DropdownMenuItem className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 hover:bg-primary/10 hover:text-primary cursor-pointer group">
                      <div className="bg-muted p-1.5 rounded-md group-hover:bg-primary/20 transition-colors">
                        <Settings className="h-4 w-4" />
                      </div>
                      <span className="font-medium">Configurações</span>
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuGroup className="p-1">
                  <DropdownMenuItem className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 hover:bg-muted cursor-pointer group">
                    <div className="bg-muted p-1.5 rounded-md group-hover:bg-muted-foreground/10 transition-colors border border-transparent group-hover:border-border/50">
                      <LifeBuoy className="h-4 w-4" />
                    </div>
                    <span className="font-medium">Suporte</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>

              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {mobileMenuOpen && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-md flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-border/40 bg-background/50">
            <span className="text-lg font-bold ml-2">Menu Principal</span>
            <button
              className="p-2 rounded-md hover:bg-muted/40 transition-colors"
              onClick={() => {
                setMobileMenuOpen(false);
                document.body.style.overflow = '';
              }}
              aria-label="Fechar menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="flex-1 p-6 space-y-3 overflow-y-auto">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Navegação</p>
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => {
                   document.body.style.overflow = '';
                   handleNavClick(item.href);
                }}
                className={`w-full text-left rounded-xl px-4 py-4 text-base font-semibold transition-all ${
                  pathname === item.href 
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                    : "bg-muted/30 hover:bg-muted border border-border/50 text-foreground"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
