"use client"

import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Search, Filter, BookOpen, Calculator, Globe, Atom, FlaskConical, Users, Languages, ChevronRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

type SubjectData = {
  id: string;
  name: string;
  description: string;
  area: string;
  progress: number;
  lessons: number;
  lastActivity: string | null;
};

const iconMap: Record<string, React.ReactNode> = {
  'Exatas': <Calculator className="h-5 w-5" />,
  'Biológicas': <FlaskConical className="h-5 w-5" />,
  'Humanas': <Globe className="h-5 w-5" />,
  'Linguagens': <Languages className="h-5 w-5" />,
};

const colorMap: Record<string, string> = {
  'Exatas': 'bg-blue-500',
  'Biológicas': 'bg-green-500',
  'Humanas': 'bg-orange-500',
  'Linguagens': 'bg-red-500',
};

export default function MateriaPage() {
  const [subjects, setSubjects] = useState<SubjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeArea, setActiveArea] = useState("Todas");

  useEffect(() => {
    fetch('/api/materias')
      .then(res => res.json())
      .then(data => {
        if (data.success) setSubjects(data.data.materias);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch materias", err);
        setLoading(false);
      });
  }, []);

  const filteredSubjects = activeArea === "Todas" ? subjects : subjects.filter(s => s.area === activeArea);
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
              variant={area === activeArea ? "default" : "outline"} 
              onClick={() => setActiveArea(area)}
              className={cn(
                "px-4 py-1.5 rounded-full cursor-pointer text-xs font-bold uppercase tracking-wider transition-all",
                area === activeArea ? "bg-primary shadow-lg shadow-primary/20" : "hover:bg-muted"
              )}
            >
              {area}
            </Badge>
          ))}
        </div>

        {/* Subjects Grid */}
        {loading ? (
          <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredSubjects.map((subject) => {
              const color = colorMap[subject.area] || 'bg-gray-500';
              const icon = iconMap[subject.area] || <BookOpen className="h-5 w-5" />;
              
              return (
              <Card key={subject.id} className="group border-border/50 overflow-hidden hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader className="pb-3 border-b border-border/40">
                  <div className="flex items-center justify-between mb-2">
                    <div className={cn("p-2 rounded-lg text-white shadow-lg", color)}>
                      {icon}
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
                        className={cn("h-full transition-all duration-1000 ease-out rounded-full", color.replace('bg-', 'bg-opacity-80 bg-'))}
                        style={{ width: `${subject.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-medium text-muted-foreground italic">
                      <BookOpen className="h-3 w-3" />
                      Último estudo: {subject.lastActivity ? new Date(subject.lastActivity).toLocaleDateString('pt-BR') : 'Nunca iniciada'}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0 border-t border-transparent group-hover:bg-primary/5 transition-colors">
                  <Link href={`/dashboard/materia/${subject.id}`} className="w-full">
                    <Button variant="ghost" className="w-full justify-between font-bold group-hover:text-primary p-0 h-12">
                       Entrar na Disciplina
                       <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
