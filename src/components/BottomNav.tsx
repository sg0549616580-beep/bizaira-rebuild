import { NavLink as RouterNavLink } from "react-router-dom";
import { Home, Wand2, User, HelpCircle } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const BottomNav = () => {
  const { t, lang } = useI18n();
  const isHe = lang === "he";

  const navItems = [
    { to: "/", icon: Home, label: t("nav.home") },
    { to: "/create", icon: Wand2, label: t("nav.create") },
    { to: "/dashboard", icon: User, label: t("nav.dashboard") },
    { to: "/support", icon: HelpCircle, label: t("nav.support") },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 glass-panel"
      dir={isHe ? "rtl" : "ltr"}
      style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}
    >
      <div className="flex items-center justify-around h-[62px] max-w-lg mx-auto px-2">
        {navItems.map((item) => (
          <RouterNavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className="flex-1"
          >
            {({ isActive }) => (
              <div className="flex flex-col items-center gap-1 py-1 select-none">
                <div className="relative flex items-center justify-center w-8 h-8">
                  {isActive && (
                    <span
                      className="absolute inset-0 rounded-xl opacity-[0.08] gradient-glow"
                      aria-hidden
                    />
                  )}
                  <item.icon
                    size={20}
                    strokeWidth={isActive ? 2 : 1.5}
                    className={
                      isActive
                        ? "text-primary drop-shadow-sm"
                        : "text-gray-400"
                    }
                  />
                </div>
                <span
                  className={`text-[10px] font-medium leading-none transition-colors ${
                    isActive ? "text-primary font-semibold" : "text-gray-400"
                  }`}
                >
                  {item.label}
                </span>
              </div>
            )}
          </RouterNavLink>
        ))}
      </div>

      {/* iOS safe-area spacer */}
      <div className="h-[env(safe-area-inset-bottom,0px)]" />
    </nav>
  );
};

export default BottomNav;
