"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BrainCircuit,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Flame,
  Trophy,
  Timer,
  ChevronRight,
  ArrowRight,
  Lightbulb,
  Share2,
  Bookmark,
  GraduationCap,
  Sparkles,
  BookOpen,
  Filter,
  BarChart
} from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";

import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useQuestions, useSubmitAnswer, type Question } from "@/lib/hooks";

const SUBJECTS = [
  { id: "matematica", name: "Matemática", icon: BrainCircuit, color: "text-blue-500", bg: "bg-blue-500/10" },
  { id: "biologia", name: "Biologia", icon: Leaf, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { id: "fisica", name: "Física", icon: Zap, color: "text-purple-500", bg: "bg-purple-500/10" },
  { id: "quimica", name: "Química", icon: TestTube, color: "text-amber-500", bg: "bg-amber-500/10" },
  { id: "historia", name: "História", icon: Landmark, color: "text-orange-500", bg: "bg-orange-500/10" },
  { id: "geografia", name: "Geografia", icon: Globe, color: "text-cyan-500", bg: "bg-cyan-500/10" },
  { id: "portugues", name: "Português", icon: BookOpen, color: "text-rose-500", bg: "bg-rose-500/10" },
  { id: "ingles", name: "Inglês", icon: Languages, color: "text-indigo-500", bg: "bg-indigo-500/10" },
];

const EXAMS = ["ENEM", "FUVEST", "UNICAMP", "UNESP", "UERJ", "Outros"];
const DIFFICULTIES = [
  { id: "easy", label: "Fácil", color: "text-emerald-500" },
  { id: "medium", label: "Médio", color: "text-amber-500" },
  { id: "hard", label: "Difícil", color: "text-rose-500" },
];

import { 
  Leaf, 
  Zap, 
  TestTube, 
  Landmark, 
  Globe, 
  Languages 
} from "lucide-react";


export default function QuestionsPage() {
  const [step, setStep] = useState<'setup' | 'quiz'>('setup');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedExam, setSelectedExam] = useState<string>("ENEM");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("medium");

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [xpGained, setXpGained] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutos por questão

  // Usar dados reais da API
  const { questions, loading: questionsLoading, error: questionsError } = useQuestions({
    subject: selectedSubject || undefined,
    difficulty: selectedDifficulty,
    exam: selectedExam,
    limit: 10
  });

  const { submitAnswer, loading: submitLoading } = useSubmitAnswer();

  const currentQuestion = questions[currentQuestionIndex];

  // Timer simulation
  useEffect(() => {
    if (timeLeft > 0 && !isConfirmed) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, isConfirmed]);

  const handleSelectOption = (optionId: string) => {
    if (isConfirmed) return;
    setSelectedOption(optionId);
  };

  const handleConfirm = async () => {
    if (!selectedOption || isConfirmed || !currentQuestion) return;

    const result = await submitAnswer(currentQuestion.id, selectedOption);

    if (result) {
      setIsCorrect(result.correct);
      setXpGained(result.xpGained);
    } else {
      setIsCorrect(false);
      setXpGained(0);
    }

    setIsConfirmed(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStartChallenge = () => {
    if (selectedSubject) {
      setStep('quiz');
      setTimeLeft(120);
    }
  };

  if (step === 'setup') {
    return (
      <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
        <header className="border-b border-border/40 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
            <Link className="flex items-center gap-3 font-bold text-2xl tracking-tight" href="/dashboard">
              <div className="bg-gradient-to-br from-primary/20 to-purple-500/20 p-2 rounded-xl">
                <BrainCircuit className="h-6 w-6 text-primary" />
              </div>
              <span>Vestibul<span className="text-primary">AI</span></span>
            </Link>
            <Link 
              href="/dashboard" 
              className={cn(buttonVariants({ variant: "ghost" }), "rounded-xl gap-2")}
            >
              <ArrowLeft className="h-4 w-4" />
              Sair
            </Link>
          </div>
        </header>


        <main className="max-w-6xl mx-auto p-6 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="text-center space-y-4 mb-12">
            <Badge variant="outline" className="px-4 py-1.5 border-primary/20 bg-primary/5 text-primary text-sm font-bold rounded-full">
              <Sparkles className="h-3.5 w-3.5 mr-2" />
              NOVO DESAFIO DIÁRIO
            </Badge>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">Prepare seu Desafio</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Selecione os parâmetros abaixo para que nossa IA encontre as melhores questões para o seu nível.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Step 1: Subject Selection */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                  <span className="text-primary font-black text-sm">1</span>
                </div>
                <h2 className="text-xl font-black uppercase tracking-widest text-foreground/80">Escolha a Matéria</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {SUBJECTS.map((sub) => {
                  const Icon = sub.icon;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => setSelectedSubject(sub.id)}
                      className={cn(
                        "group p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center text-center gap-3 relative overflow-hidden",
                        selectedSubject === sub.id 
                          ? "border-primary bg-primary/5 shadow-xl shadow-primary/10 -translate-y-1" 
                          : "border-border/40 bg-card hover:border-primary/30 hover:bg-primary/[0.02]"
                      )}
                    >
                      <div className={cn("p-3 rounded-xl transition-transform group-hover:scale-110 duration-500", sub.bg)}>
                        <Icon className={cn("h-6 w-6", sub.color)} />
                      </div>
                      <span className="font-bold text-sm tracking-tight">{sub.name}</span>
                      {selectedSubject === sub.id && (
                        <div className="absolute top-2 right-2 h-5 w-5 bg-primary rounded-full flex items-center justify-center animate-in zoom-in-50">
                          <CheckCircle2 className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2 & 3: Exam and Difficulty */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                    <span className="text-primary font-black text-sm">2</span>
                  </div>
                  <h2 className="text-xl font-black uppercase tracking-widest text-foreground/80">Vestibular</h2>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {EXAMS.map((exam) => (
                    <button
                      key={exam}
                      onClick={() => setSelectedExam(exam)}
                      className={cn(
                        "px-4 py-3 rounded-xl border-2 font-bold transition-all text-sm",
                        selectedExam === exam 
                          ? "border-primary bg-primary text-primary-foreground" 
                          : "border-border/40 bg-card hover:border-primary/20"
                      )}
                    >
                      {exam}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                    <span className="text-primary font-black text-sm">3</span>
                  </div>
                  <h2 className="text-xl font-black uppercase tracking-widest text-foreground/80">Dificuldade</h2>
                </div>
                <div className="flex flex-col gap-3">
                  {DIFFICULTIES.map((diff) => (
                    <button
                      key={diff.id}
                      onClick={() => setSelectedDifficulty(diff.id)}
                      className={cn(
                        "flex items-center justify-between px-5 py-4 rounded-xl border-2 font-black transition-all",
                        selectedDifficulty === diff.id 
                          ? "border-primary bg-primary/5 -translate-y-0.5" 
                          : "border-border/40 bg-card hover:border-primary/20"
                      )}
                    >
                      <span className={selectedDifficulty === diff.id ? "text-primary" : "text-foreground/70"}>
                        {diff.label}
                      </span>
                      {selectedDifficulty === diff.id && <Sparkles className="h-4 w-4 text-primary animate-pulse" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Start Button Area */}
              <div className="pt-4">
                <Button
                  onClick={handleStartChallenge}
                  disabled={!selectedSubject || questionsLoading}
                  className="w-full h-16 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-black shadow-2xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 gap-3 group"
                >
                  {questionsLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      CARREGANDO QUESTÕES...
                    </>
                  ) : (
                    <>
                      INICIAR DESAFIO
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
                {questionsError && (
                  <p className="text-center text-sm text-red-500 mt-2">
                    Erro ao carregar questões: {questionsError}
                  </p>
                )}
                <p className="text-center text-[10px] text-muted-foreground mt-4 font-medium uppercase tracking-widest">
                  +25 XP base por questão finalizada
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      {/* Top Navigation / Progress */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard" 
              className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "rounded-full")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="h-6 w-px bg-border/60 hidden sm:block" />
            <div className="hidden sm:flex flex-col">

              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                {SUBJECTS.find(s => s.id === selectedSubject)?.name || currentQuestion.subject}
              </span>
              <span className="text-sm font-bold">{currentQuestion.topic}</span>
            </div>

          </div>

          <div className="flex-1 max-w-md mx-auto hidden md:block">
            <div className="flex items-center gap-3">
              <span className="text-xs font-black text-primary">QUESTÃO {currentQuestionIndex + 1}/10</span>
              <Progress value={((currentQuestionIndex + 1) / 10) * 100} className="h-2" />
            </div>
          </div>

          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-full border border-border/50">
                <Timer className={cn("h-4 w-4", timeLeft < 30 ? "text-destructive animate-pulse" : "text-primary")} />
                <span className="text-sm font-mono font-bold leading-none">{formatTime(timeLeft)}</span>
             </div>
             <Badge variant="outline" className="hidden sm:flex gap-1.5 border-orange-500/20 bg-orange-500/5 text-orange-500 font-bold">
                <Flame className="h-3.5 w-3.5" /> 14
             </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 md:p-8 pt-6 space-y-8 container animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Question Area */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
              Nível: {currentQuestion.difficulty}
            </Badge>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                <Bookmark className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Card className="border-none bg-transparent shadow-none">
            <CardContent className="p-0">
              <h2 className="text-xl md:text-2xl font-medium leading-relaxed">
                {currentQuestion.question}
              </h2>
            </CardContent>
          </Card>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 gap-3 pt-4">
          {currentQuestion.options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleSelectOption(option.id)}
              disabled={isConfirmed}
              className={cn(
                "group relative flex items-center p-4 md:p-5 rounded-2xl border-2 transition-all duration-300 text-left",
                selectedOption === option.id 
                  ? "border-primary bg-primary/5 shadow-lg shadow-primary/10 -translate-y-0.5" 
                  : "border-border/50 bg-card hover:border-primary/30 hover:bg-primary/[0.02]",
                isConfirmed && option.id === currentQuestion.correctAnswer && "border-emerald-500 bg-emerald-500/5",
                isConfirmed && selectedOption === option.id && selectedOption !== currentQuestion.correctAnswer && "border-destructive bg-destructive/5",
                isConfirmed && option.id !== currentQuestion.correctAnswer && selectedOption !== option.id && "opacity-50 grayscale-[0.5]"
              )}
            >
              <div className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 font-bold transition-colors mr-4",
                selectedOption === option.id 
                  ? "border-primary bg-primary text-primary-foreground" 
                  : "border-border group-hover:border-primary/50 group-hover:text-primary",
                isConfirmed && option.id === currentQuestion.correctAnswer && "border-emerald-500 bg-emerald-500 text-white",
                isConfirmed && selectedOption === option.id && selectedOption !== currentQuestion.correctAnswer && "border-destructive bg-destructive text-white"
              )}>
                {option.id.toUpperCase()}
              </div>
              <span className="flex-1 font-medium">{option.text}</span>
              
              {isConfirmed && option.id === currentQuestion.correctAnswer && (
                 <CheckCircle2 className="h-6 w-6 text-emerald-500 shrink-0 ml-2 animate-in zoom-in-50 duration-300" />
              )}
              {isConfirmed && selectedOption === option.id && selectedOption !== currentQuestion.correctAnswer && (
                 <XCircle className="h-6 w-6 text-destructive shrink-0 ml-2 animate-in zoom-in-50 duration-300" />
              )}
            </button>
          ))}
        </div>

        {/* Action Bar / Feedback */}
        <div className="fixed bottom-0 left-0 w-full p-4 md:p-6 bg-background/80 backdrop-blur-xl border-t border-border/40 z-40">
           <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex-1 w-full">
                {isConfirmed ? (
                  <div className="flex items-center gap-4 animate-in slide-in-from-left-4 duration-500">
                    <div className={cn(
                      "h-12 w-12 rounded-2xl flex items-center justify-center shadow-lg",
                      isCorrect ? "bg-emerald-500 shadow-emerald-500/20" : "bg-destructive shadow-destructive/20"
                    )}>
                      {isCorrect ? <Trophy className="h-6 w-6 text-white" /> : <Lightbulb className="h-6 w-6 text-white" />}
                    </div>
                    <div>
                      <h3 className={cn("font-black text-lg", isCorrect ? "text-emerald-500" : "text-destructive")}>
                        {isCorrect ? "Excelente! +25 XP" : "Ops! Não foi desta vez."}
                      </h3>
                      <p className="text-xs text-muted-foreground font-medium max-w-md line-clamp-1">
                        {currentQuestion.explanation}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground font-medium hidden md:block">
                    Selecione uma alternativa para validar seu conhecimento.
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <Button 
                  variant="outline" 
                  className="flex-1 md:flex-none h-14 px-8 font-bold border-2 hover:bg-muted"
                  disabled={!isConfirmed}
                >
                  Ver Resolução
                </Button>
                {isConfirmed ? (
                  <Button className="flex-1 md:flex-none h-14 px-10 bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/20 gap-2 font-black text-base transition-all hover:translate-x-1">
                    Próxima Questão
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleConfirm}
                    disabled={!selectedOption || submitLoading}
                    className="flex-1 md:flex-none h-14 px-12 bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/20 gap-2 font-black text-base transition-all disabled:opacity-50"
                  >
                    {submitLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Enviando...
                      </>
                    ) : (
                      <>
                        Confirmar Resposta
                        <ChevronRight className="h-5 w-5" />
                      </>
                    )}
                  </Button>
                )}
              </div>
           </div>
        </div>
        
        {/* Adiciona um espaço no final para não sobrepor a barra fixa */}
        <div className="h-32" />
      </main>
    </div>
  );
}
