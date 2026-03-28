import { ReactNode } from "react";
import { DashboardHeader } from "@/components/dashboard-header";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardHeader />
      {children}
    </div>
  );
}
