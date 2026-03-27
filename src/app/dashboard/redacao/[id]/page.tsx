"use client"
import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, ArrowLeft, Send, Save, CheckCircle2 } from "lucide-react"

export default function RedacaoEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [essay, setEssay] = useState<any>(null)
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch(`/api/redacao/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setEssay(data.data.essay)
          setContent(data.data.essay.content || "")
        }
        setLoading(false)
      })
  }, [id])

  const handleSave = async (submit = false) => {
    setSaving(true)
    try {
      const res = await fetch(`/api/redacao/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, submit })
      })
      const data = await res.json()
      if (data.success) {
        setEssay(data.data.essay)
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-background text-primary">
       <Loader2 className="h-10 w-10 animate-spin" />
    </div>
  )

  if (!essay) return <div>Redação não encontrada.</div>

  const isGraded = essay.status === "GRADED"

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <DashboardHeader />
      <main className="flex-1 p-4 md:p-8 max-w-4xl mx-auto w-full space-y-6">
        <Button variant="ghost" className="mb-4" onClick={() => router.push('/dashboard/redacao')}>
           <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
        </Button>

        <div className="space-y-4">
           <h1 className="text-3xl font-black italic">{essay.theme}</h1>
           <div className="flex items-center gap-2">
             <span className="text-sm text-muted-foreground font-bold uppercase tracking-widest">Status:</span>
             <span className={`text-sm font-black uppercase ${isGraded ? 'text-green-500' : 'text-yellow-500'}`}>
               {essay.status === 'DRAFT' ? 'Rascunho' : essay.status}
             </span>
           </div>
        </div>

        {isGraded ? (
          <Card className="border-green-500/30 bg-green-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-500">
                <CheckCircle2 className="h-6 w-6" /> Correção Concluída
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-5xl font-black text-green-500">{essay.score?.total || 1000} <span className="text-xl text-green-600/50">/ 1000</span></div>
              <p className="font-medium text-muted-foreground italic">{essay.feedback}</p>
              
              <div className="pt-6 font-medium text-foreground p-6 border rounded-xl bg-background/50 whitespace-pre-wrap">
                {essay.content}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-2xl border-primary/20">
            <CardContent className="p-0">
               <Textarea 
                 className="min-h-[500px] text-lg leading-relaxed p-6 border-0 focus-visible:ring-0 resize-none bg-background/50"
                 placeholder="Comece a escrever sua redação aqui..."
                 value={content}
                 onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
                 disabled={saving}
               />
            </CardContent>
            <CardFooter className="bg-muted/30 border-t p-4 flex justify-end gap-4">
               <Button variant="outline" onClick={() => handleSave(false)} disabled={saving}>
                 {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />} Salvar Rascunho
               </Button>
               <Button className="bg-primary text-primary-foreground" onClick={() => handleSave(true)} disabled={saving || content.length < 50}>
                 <Send className="h-4 w-4 mr-2" /> Enviar para Correção IA
               </Button>
            </CardFooter>
          </Card>
        )}
      </main>
    </div>
  )
}
