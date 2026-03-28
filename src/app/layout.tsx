import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { CookieBanner } from "@/components/cookie-banner";
import { ServiceWorkerRegistration } from "@/components/service-worker-registration";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VestibulAI - Preparação Inteligente para Vestibulares",
  description: "Plataforma adaptativa de estudos com banco de questões e correção de redação via IA.",
  themeColor: "#6366f1",
  icons: {
    icon: "/file.svg",
    shortcut: "/file.svg",
    apple: "/file.svg",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased min-h-screen bg-background text-foreground`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={true}
          disableTransitionOnChange
        >
          {children}
          <CookieBanner />
          <ServiceWorkerRegistration />
        </ThemeProvider>
      </body>
    </html>
  );
}
