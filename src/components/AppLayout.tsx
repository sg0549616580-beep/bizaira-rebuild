import { ReactNode } from "react";
import BottomNav from "./BottomNav";
import { LanguageToggle } from "@/lib/i18n";
import SparkleIcon from "./SparkleIcon";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Glassmorphism top bar */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-panel" style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
        <div className="flex items-center justify-between h-12 max-w-lg mx-auto px-4">
          {/* Brand */}
          <div className="flex items-center gap-1.5 select-none">
            <SparkleIcon size={16} />
            <span className="text-sm font-bold gradient-glow-text tracking-tight">BizAIra</span>
          </div>
          {/* Language toggle */}
          <LanguageToggle />
        </div>
      </header>

      {/* Main content — offset for top bar (48px) + bottom nav (80px) */}
      <main className="flex-1 pt-12 pb-24 max-w-lg mx-auto w-full">
        {children}
      </main>

      <BottomNav />
    </div>
  );
};

export default Layout;
