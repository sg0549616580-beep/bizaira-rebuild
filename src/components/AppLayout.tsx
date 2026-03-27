import { ReactNode } from "react";
import BottomNav from "./BottomNav";
import { LanguageToggle } from "@/lib/i18n";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Language toggle — floating top corner */}
      <div className="fixed top-3 left-3 z-50">
        <LanguageToggle />
      </div>
      <main className="flex-1 pb-20">{children}</main>
      <BottomNav />
    </div>
  );
};

export default Layout;
