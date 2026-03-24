"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Cookie } from "lucide-react";
import Link from "next/link";

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the user has already accepted the cookies
    const cookieConsent = localStorage.getItem("vestibulai-cookie-consent");
    if (!cookieConsent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("vestibulai-cookie-consent", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 pb-20 sm:pb-6 pointer-events-none">
      <div className="mx-auto max-w-5xl rounded-xl border bg-background/95 p-4 shadow-lg backdrop-blur-sm pointer-events-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-4">
          <div className="hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <Cookie className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold">Sua privacidade é importante para nós</h3>
            <p className="text-sm text-muted-foreground w-full max-w-2xl">
              Utilizamos cookies e tecnologias semelhantes para melhorar a sua experiência em nossa plataforma, analisar o tráfego e personalizar conteúdos. Ao continuar navegando, você concorda com a nossa{" "}
              <Link href="/politica-de-privacidade" className="font-medium text-primary hover:underline">
                Política de Privacidade
              </Link>.
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0 justify-end">
          <Button onClick={handleAccept} size="sm" className="w-full sm:w-auto whitespace-nowrap">
            Aceitar e continuar
          </Button>
          <Button onClick={() => setIsVisible(false)} size="icon" variant="ghost" className="h-9 w-9 shrink-0" aria-label="Fechar">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
