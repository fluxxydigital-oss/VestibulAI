"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BrainCircuit, Check, ChevronRight, Loader2, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

const questions = [
  {
    id: 1,
    subject: "Matemática",
    question: "Sabendo que as raízes da equação x² - 5x + 6 = 0 são x' e x'', qual o valor da soma (x' + x'')?",
    options: ["-5", "5", "6", "-6"],
    correct: "5"
  },
  {
    id: 2,
    subject: "Biologia",
    question: "Qual organela celular é primariamente responsável por fornecer energia na forma de ATP para a célula eucarionte através da respiração celular aeróbica?",
    options: ["Ribossomo", "Complexo de Golgi", "Mitocôndria", "Lisossomo"],
    correct: "Mitocôndria"
  },
  {
    id: 3,
    subject: "História",
    question: "A revolução que marcou o fim da Idade Moderna e o início da Idade Contemporânea, abolindo os privilégios da nobreza e do clero, foi a:",
    options: ["Revolução Industrial", "Revolução Francesa", "Revolução Americana", "Revolução Russa"],
    correct: "Revolução Francesa"
  },
  {
    id: 4,
    subject: "Física",
    question: "Qual é a grandeza física que mede a resistência de um corpo a mudanças em seu estado de movimento, intimamente ligada à Primeira Lei de Newton?",
    options: ["Velocidade", "Aceleração", "Massa (Inércia)", "Trabalho"],
    correct: "Massa (Inércia)"
  }
];

export default function DiagnosticoPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0); // 0 to questions.length (questions), questions.length (date), questions.length+1 (processing)
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [targetDate, setTargetDate] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  const totalSteps = questions.length + 1; // +1 for the date selection

  const handleSelectOption = (qId: number, option: string) => {
    setAnswers(prev => ({ ...prev, [qId]: option }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleSubmit = async () => {
    if (!targetDate) return;
    setIsProcessing(true);
    setCurrentStep(totalSteps + 1); // switch to processing view

    // Monta o payload apenas com o desempenho real das respostas do usuário
    const skills = questions.reduce<Record<string, { correct: number; total: number }>>((acc, q) => {
      if (!acc[q.subject]) {
        acc[q.subject] = { correct: 0, total: 0 };
      }

      acc[q.subject].total += 1;

      if (answers[q.id] === q.correct) {
        acc[q.subject].correct += 1;
      }

      return acc;
    }, {});

    try {
      const res = await fetch("/api/diagnostico", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetDate, skills })
      });
      
      const data = await res.json();
      if (data.success) {
        router.push("/dashboard/trilha");
      } else {
        setIsProcessing(false);
        setCurrentStep(totalSteps); // back to date
        alert("Ocorreu um erro ao processar seu nivelamento.");
      }
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
      setCurrentStep(totalSteps);
    }
  };

  const isQuestionReady = currentStep < questions.length && answers[questions[currentStep].id];
  const isDateReady = currentStep === questions.length && targetDate !== "";

  return (
    <div className="flex min-h-screen w-full flex-col bg-background/50">

      
      <main className="flex-1 max-w-3xl mx-auto w-full p-4 md:p-8 flex items-center justify-center">
        
        {/* Progress Tracker */}
        {currentStep <= totalSteps && (
          <div className="absolute top-24 left-0 w-full px-4 md:px-8 max-w-3xl mx-auto">
             <div className="flex justify-between items-center text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">
                <span>Nivelamento da IA</span>
                <span>Passo {currentStep + 1} de {totalSteps + 1}</span>
             </div>
             <Progress value={(currentStep / totalSteps) * 100} className="h-1.5" />
          </div>
        )}

        <div className="w-full mt-10">
          
          {/* QUESTION SCREENS */}
          {currentStep < questions.length && (
            <Card className="border-border/50 shadow-2xl relative overflow-hidden bg-card/80 backdrop-blur-md">
               <div className="absolute -top-10 -right-10 opacity-10">
                  <BrainCircuit className="w-40 h-40" />
               </div>
               <CardHeader className="pb-8 space-y-4">
                  <div className="bg-primary/10 text-primary w-max px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-primary/20">
                     {questions[currentStep].subject}
                  </div>
                  <CardTitle className="text-2xl md:text-3xl leading-snug">
                     {questions[currentStep].question}
                  </CardTitle>
               </CardHeader>
               <CardContent className="space-y-4 relative z-10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                     {questions[currentStep].options.map((opt, i) => {
                       const selected = answers[questions[currentStep].id] === opt;
                       return (
                         <div 
                           key={i}
                           onClick={() => handleSelectOption(questions[currentStep].id, opt)}
                           className={cn(
                             "p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between group",
                             selected 
                               ? "border-primary bg-primary/5 shadow-md shadow-primary/10" 
                               : "border-border/50 hover:border-primary/40 hover:bg-muted"
                           )}
                         >
                           <span className={cn("font-medium", selected ? "text-primary" : "text-foreground group-hover:text-primary transition-colors")}>
                             {opt}
                           </span>
                           <div className={cn(
                             "h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors",
                             selected ? "border-primary bg-primary text-white" : "border-muted-foreground/30"
                           )}>
                              {selected && <Check className="h-3 w-3" />}
                           </div>
                         </div>
                       );
                     })}
                  </div>

                  <div className="pt-8 flex justify-end">
                     <Button 
                       size="lg" 
                       disabled={!isQuestionReady}
                       onClick={handleNext}
                       className="font-bold w-full sm:w-auto px-8 shadow-lg shadow-primary/20"
                     >
                        Continuar <ChevronRight className="h-4 w-4 ml-2" />
                     </Button>
                  </div>
               </CardContent>
            </Card>
          )}

          {/* TARGET DATE SCREEN */}
          {currentStep === questions.length && (
            <Card className="border-border/50 shadow-2xl relative overflow-hidden bg-card/80 backdrop-blur-md animation-fade-in">
               <CardHeader className="text-center pb-8 space-y-4 mt-4">
                  <div className="mx-auto bg-blue-500/10 text-blue-500 w-16 h-16 rounded-full flex items-center justify-center border border-blue-500/20 mb-2 shadow-inner">
                     <Calendar className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-3xl font-black">
                     Qual a sua linha de chegada?
                  </CardTitle>
                  <CardDescription className="text-base max-w-md mx-auto">
                     A IA usará a data do seu vestibular principal como guia para montar um roteiro de estudos que caiba perfeitamente no seu calendário.
                  </CardDescription>
               </CardHeader>
               <CardContent className="space-y-6 relative z-10 max-w-sm mx-auto pb-4">
                  <div className="space-y-2">
                     <label className="text-sm font-bold text-foreground">Data do Vestibular</label>
                     <Input 
                       type="date" 
                       value={targetDate} 
                       onChange={(e) => setTargetDate(e.target.value)}
                       className="h-14 text-lg border-2 bg-muted/50"
                     />
                  </div>

                  <div className="pt-4 flex justify-between gap-4">
                     <Button variant="ghost" onClick={() => setCurrentStep(prev => prev - 1)}>Voltar</Button>
                     <Button 
                       size="lg" 
                       disabled={!isDateReady}
                       onClick={handleSubmit}
                       className="font-bold flex-1 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-500 shadow-xl shadow-primary/20"
                     >
                        Finalizar Diagnóstico <Check className="h-5 w-5 ml-2" />
                     </Button>
                  </div>
               </CardContent>
            </Card>
          )}

          {/* PROCESSING SCREEN */}
          {currentStep > questions.length && (
            <div className="flex flex-col items-center justify-center space-y-8 animate-in fade-in zoom-in duration-500 py-10">
               <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full"></div>
                  <div className="h-32 w-32 rounded-full border-4 border-dashed border-primary/50 animate-spin flex items-center justify-center bg-card shadow-2xl relative z-10">
                     <BrainCircuit className="h-12 w-12 text-primary animate-pulse" />
                  </div>
               </div>
               <div className="text-center space-y-2">
                  <h2 className="text-2xl font-black text-foreground">A IA está gerando sua Trilha...</h2>
                  <p className="text-muted-foreground flex items-center justify-center gap-2">
                    Mapeando suas fraquezas <Loader2 className="h-3 w-3 animate-spin" />
                  </p>
               </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
