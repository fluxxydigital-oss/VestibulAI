"use client"

import { DashboardHeader } from "@/components/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Search, Filter, BookOpen, Calculator, Globe, Atom, FlaskConical, Users, Languages, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const SUBJECTS = [
  { id: 1, name: "Matemática", icon: <Calculator className="h-5 w-5" />, color: "bg-blue-500", progress: 65, lessons: 120, area: "Exatas" },
  { id: 2, name: "Biologia", icon: <FlaskConical className="h-5 w-5" />, color: "bg-green-500", progress: 42, lessons: 95, area: "Biológicas" },
  { id: 3, name: "Física", icon: <Atom className="h-5 w-5" />, color: "bg-purple-500", progress: 28, lessons: 110, area: "Exatas" },
  { id: 4, name: "Português", icon: <Languages className="h-5 w-5" />, color: "bg-red-500", progress: 85, lessons: 85, area: "Linguagens" },
  { id: 5, name: "História", icon: <Users className="h-5 w-5" />, color: "bg-orange-500", progress: 55, lessons: 90, area: "Humanas" },
  { id: 6, name: "Geografia", icon: <Globe className="h-5 w-5" />, color: "bg-cyan-500", progress: 38, lessons: 80, area: "Humanas" },
  { id: 7, name: "Química", icon: <FlaskConical className="h-5 w-5" />, color: "bg-teal-500", progress: 15, lessons: 105, area: "Exatas" },
  { id: 8, name: "Literatura", icon: <BookOpen className="h-5 w-5" />, color: "bg-pink-500", progress: 92, lessons: 60, area: "Linguagens" },
];

export default function MateriaPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <DashboardHeader />
      
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black tracking-tight mb-2 italic">
              Explorar <span className="text-primary italic">Matérias</span> 📚
            </h1>
            <p className="text-muted-foreground">
              Acesse o conteúdo completo de todas as disciplinas do seu vestibular.
            </p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="O que você quer estudar hoje?" className="pl-10 h-11 bg-muted/50 border-border/50 rounded-xl outline-none focus-visible:ring-primary" />
            </div>
            <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Areas Filter */}
        <div className="flex gap-2 overflow-x-auto pb-6 mb-4 no-scrollbar">
          {["Todas", "Exatas", "Humanas", "Biológicas", "Linguagens"].map((area, i) => (
            <Badge 
              key={i} 
              variant={i === 0 ? "default" : "outline"} 
              className={cn(
                "px-4 py-1.5 rounded-full cursor-pointer text-xs font-bold uppercase tracking-wider transition-all",
                i === 0 ? "bg-primary shadow-lg shadow-primary/20" : "hover:bg-muted"
              )}
            >
              {area}
            </Badge>
          ))}
        </div>

        {/* Subjects Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SUBJECTS.map((subject) => (
            <Card key={subject.id} className="group border-border/50 overflow-hidden hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader className="pb-3 border-b border-border/40">
                <div className="flex items-center justify-between mb-2">
                  <div className={cn("p-2 rounded-lg text-white shadow-lg", subject.color)}>
                    {subject.icon}
                  </div>
                  <Badge variant="secondary" className="text-[10px] font-bold uppercase opacity-80">{subject.area}</Badge>
                </div>
                <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">{subject.name}</CardTitle>
                <CardDescription className="text-xs">{subject.lessons} aulas disponíveis</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-muted-foreground uppercase tracking-wider">Progresso Atual</span>
                    <span className="text-foreground">{subject.progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full transition-all duration-1000 ease-out rounded-full", subject.color.replace('bg-', 'bg-opacity-80 bg-'))}
                      style={{ width: `${subject.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-medium text-muted-foreground italic">
                    <BookOpen className="h-3 w-3" />
                    Último estudo: Ontem
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0 border-t border-transparent group-hover:bg-primary/5 transition-colors">
                <Button variant="ghost" className="w-full justify-between font-bold group-hover:text-primary p-0 h-12">
                   Entrar na Disciplina
                   <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
