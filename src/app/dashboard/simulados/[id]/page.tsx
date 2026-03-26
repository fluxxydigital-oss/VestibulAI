"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, ArrowLeft, Send, Clock, AlertCircle } from "lucide-react"

export default function SimuladoEnginePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [exam, setExam] = useState<any>(null)
  const [questions, setQuestions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [startTime, setStartTime] = useState(Date.now())

  useEffect(() => {
    fetch(`/api/simulados/${params.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setExam(data.data.exam)
          setQuestions(data.data.questions)
        }
        setLoading(false)
      })
  }, [params.id])

  const handleSelect = (questionId: string, optionId: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }))
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000)
      const res = await fetch(`/api/simulados/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, timeSpent })
      })
      const data = await res.json()
      if (data.success) {
        router.push('/dashboard/simulados')
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-background text-primary">
       <Loader2 className="h-10 w-10 animate-spin" />
    </div>
  )

  if (!exam) return <div>Simulado não encontrado.</div>
  
  const isFinished = exam.status === "COMPLETED"

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <DashboardHeader />
      <main className="flex-1 p-4 md:p-8 max-w-4xl mx-auto w-full space-y-6">
        <Button variant="ghost" className="mb-4" onClick={() => router.push('/dashboard/simulados')}>
           <ArrowLeft className="h-4 w-4 mr-2" /> Encerrar sem Salvar
        </Button>

        <div className="flex items-center justify-between border-b pb-6">
           <h1 className="text-3xl font-black italic">{exam.title}</h1>
           {!isFinished && (
             <div className="flex items-center gap-2 text-yellow-500 font-bold px-4 py-2 bg-yellow-500/10 rounded-xl">
               <Clock className="w-5 h-5" /> Teste em Andamento
             </div>
           )}
        </div>

        {isFinished ? (
           <Card className="border-green-500/30 bg-green-500/5 text-center p-12">
             <CardTitle className="text-3xl text-green-500 mb-4">Teste Finalizado</CardTitle>
             <div className="text-6xl font-black text-green-500">{exam.score} <span className="text-2xl text-green-600/50">TRI</span></div>
             <p className="mt-4 text-muted-foreground font-bold">Você concluiu este simulado.</p>
           </Card>
        ) : (
          <div className="space-y-12">
             {questions.map((q, i) => (
                <Card key={q.id} className="shadow-lg border-border/50 bg-card/50">
                   <CardHeader className="bg-muted/30 pb-4 border-b border-border/50">
                     <span className="text-[10px] font-black uppercase text-primary mb-2 block">{q.subject.name}</span>
                     <CardTitle className="text-xl leading-relaxed font-semibold">
                       <span className="text-primary mr-2">{i + 1}.</span> {q.statement}
                     </CardTitle>
                   </CardHeader>
                   <CardContent className="p-6">
                      <div className="space-y-3">
                        {(q.options as any[]).map(opt => {
                          const isSelected = answers[q.id] === opt.id
                          return (
                            <div 
                               key={opt.id} 
                               onClick={() => handleSelect(q.id, opt.id)}
                               className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${isSelected ? 'border-primary bg-primary/5 shadow-md scale-[1.01]' : 'border-transparent bg-muted hover:border-border hover:bg-muted/80'}`}
                            >
                               <div className="flex items-center gap-3">
                                 <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? 'border-primary' : 'border-muted-foreground'}`}>
                                    {isSelected && <div className="h-2.5 w-2.5 rounded-full bg-primary" />}
                                 </div>
                                 <span className="font-medium">{opt.text}</span>
                               </div>
                            </div>
                          )
                        })}
                      </div>
                   </CardContent>
                </Card>
             ))}

             <div className="flex items-center justify-between p-6 bg-primary/5 rounded-2xl border border-primary/20">
                <div className="flex items-center gap-4 text-muted-foreground font-bold">
                  <AlertCircle className="w-5 h-5 text-primary" />
                  <span>Respostas: {Object.keys(answers).length} de {questions.length}</span>
                </div>
                <Button 
                   size="lg" 
                   className="font-black uppercase px-12 tracking-widest"
                   disabled={Object.keys(answers).length < questions.length || submitting}
                   onClick={handleSubmit}
                >
                   {submitting ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : (
                     <><Send className="w-4 h-4 mr-2" /> Finalizar Simulado</>
                   )}
                </Button>
             </div>
          </div>
        )}
      </main>
    </div>
  )
}
