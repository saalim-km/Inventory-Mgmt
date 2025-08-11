// layout/DashboardLayout.tsx
import type { ReactNode } from "react";
import { Header } from "./ui/header";
import { Sidebar } from "./ui/sidebar";

type DashboardLayoutProps = {
  children: ReactNode;
};

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="flex min-h-screen">
      {/* HEADER AT THE TOP */}
      <Sidebar />

      <div className="flex flex-col flex-1">
        <Header />
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
};
