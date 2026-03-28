"use client"

import { BrainCircuit, User, CreditCard, Settings, LifeBuoy, Menu } from "lucide-react";
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
  { label: "Matéria", href: "/dashboard/materia" },
  { label: "Questões", href: "/dashboard/questions" },
  { label: "Simulados", href: "/dashboard/simulados" },
  { label: "Redação", href: "/dashboard/redacao" },
];

export function DashboardHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center gap-4 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-8 shadow-sm">
      <Link className="flex items-center gap-3 font-bold text-2xl tracking-tight hover:opacity-90 transition-opacity" href="/dashboard">
        <div className="bg-gradient-to-br from-primary/20 to-purple-500/20 p-2 rounded-xl">
          <BrainCircuit className="h-6 w-6 text-primary" />
        </div>
        <span className="hidden sm:inline-block font-heading italic text-foreground tracking-tight">Vestibul<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 dark:from-blue-400 to-primary">AI</span></span>
      </Link>
      
      <div className="ml-auto w-full max-w-sm sm:max-w-max flex items-center justify-end gap-4 sm:gap-8">
        <DropdownMenu>
          <DropdownMenuTrigger className="lg:hidden p-2 rounded-md border border-border/30 hover:bg-muted/30 transition">
            <Menu className="h-5 w-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 p-1 bg-background/95 border border-border/50 backdrop-blur" sideOffset={8} align="start">
            {navItems.map((item) => (
              <DropdownMenuItem
                key={item.href}
                onSelect={() => router.push(item.href)}
                className="px-3 py-2 rounded-lg hover:bg-primary/10"
              >
                {item.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

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
            <span className="text-xs font-bold text-primary">Nível 12</span>
            <span className="text-[10px] text-muted-foreground">350/500 XP</span>
          </div>

          <div className="hidden md:flex flex-col items-end">
            <span className="text-xs font-bold text-primary">Nível 12</span>
            <span className="text-[10px] text-muted-foreground">350/500 XP</span>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary ring-offset-2">
              <Avatar className="h-11 w-11 border-2 border-primary/20 hover:border-primary transition-colors cursor-pointer shadow-sm relative group">
                <AvatarImage src={user?.image || undefined} alt="User" />
                <AvatarFallback className="font-bold bg-primary/10 text-primary text-lg">JS</AvatarFallback>
                <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground ring-2 ring-background z-10">
                  12
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
                    <p className="text-sm font-bold leading-none">Joana Silva</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      joana.silva@email.com
                    </p>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="bg-border/50" />
              <DropdownMenuGroup className="p-1">
                <DropdownMenuItem 
                  onSelect={() => router.push("/dashboard/perfil")}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 hover:bg-primary/10 hover:text-primary cursor-pointer group"
                >
                  <div className="bg-muted p-1.5 rounded-md group-hover:bg-primary/20 transition-colors">
                    <User className="h-4 w-4" />
                  </div>
                  <span className="font-medium">Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onSelect={() => router.push("/dashboard/assinatura")}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 hover:bg-primary/10 hover:text-primary cursor-pointer group"
                >
                  <div className="bg-muted p-1.5 rounded-md group-hover:bg-primary/20 transition-colors">
                    <CreditCard className="h-4 w-4" />
                  </div>
                  <span className="font-medium">Assinatura</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onSelect={() => router.push("/dashboard/configuracoes")}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 hover:bg-primary/10 hover:text-primary cursor-pointer group"
                >
                  <div className="bg-muted p-1.5 rounded-md group-hover:bg-primary/20 transition-colors">
                    <Settings className="h-4 w-4" />
                  </div>
                  <span className="font-medium">Configurações</span>
                </DropdownMenuItem>
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
  );
}
