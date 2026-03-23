import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  FileText,
  Image,
  Component,
  Bot,
  Settings,
  Users,
  LogOut,
  Menu,
  X,
  Shield,
} from "lucide-react";

const menuItems = [
  { label: "עמודים", icon: FileText, path: "/admin/pages" },
  { label: "מדיה", icon: Image, path: "/admin/media" },
  { label: "רכיבים", icon: Component, path: "/admin/components" },
  { label: "כלי AI", icon: Bot, path: "/admin/ai" },
  { label: "משתמשים", icon: Users, path: "/admin/users" },
  { label: "הגדרות", icon: Settings, path: "/admin/settings" },
];

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const { signOut, isAdmin, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4" dir="rtl">
        <div className="text-center space-y-4">
          <Shield size={48} className="mx-auto text-destructive" />
          <h1 className="text-2xl font-bold">אין הרשאה</h1>
          <p className="text-muted-foreground">אין לך הרשאות גישה לממשק הניהול.</p>
          <Link to="/" className="inline-block gradient-glow text-primary-foreground px-6 py-3 rounded-xl font-bold">
            חזרה לאתר
          </Link>
        </div>
      </div>
    );
  }

  const handleNav = (path: string) => {
    navigate(path);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen flex bg-background" dir="rtl">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 right-0 z-50 h-screen w-64 bg-card border-s border-border flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield size={20} className="text-primary" />
            <span className="font-bold text-lg">ניהול BizAIra</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-muted-foreground">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const active = location.pathname.startsWith(item.path);
            return (
              <button
                key={item.path}
                onClick={() => handleNav(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "gradient-glow text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border space-y-1">
          <Link
            to="/"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:bg-muted transition-all"
          >
            ← חזרה לאתר
          </Link>
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-destructive hover:bg-destructive/10 transition-all"
          >
            <LogOut size={18} />
            התנתקות
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-md border-b border-border px-4 py-3 flex items-center gap-3 md:hidden">
          <button onClick={() => setSidebarOpen(true)} className="text-foreground">
            <Menu size={24} />
          </button>
          <span className="font-bold">ניהול</span>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
