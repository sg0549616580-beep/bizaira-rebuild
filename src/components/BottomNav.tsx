import { NavLink as RouterNavLink } from "react-router-dom";
import { Home, Wand2, User, HelpCircle } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const BottomNav = () => {
  const { t } = useI18n();

  const navItems = [
    { to: "/", icon: Home, label: t("nav.home") },
    { to: "/create", icon: Wand2, label: t("nav.create") },
    { to: "/dashboard", icon: User, label: t("nav.dashboard") },
    { to: "/support", icon: HelpCircle, label: t("nav.support") },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-4">
        {navItems.map((item) => (
          <RouterNavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className="flex-1"
          >
            {({ isActive }) => (
              <div className="flex flex-col items-center gap-1.5 py-1">
                <item.icon
                  size={20}
                  strokeWidth={isActive ? 2 : 1.5}
                  className={isActive ? "text-primary" : "text-gray-400"}
                />
                <span
                  className={`text-[10px] font-medium leading-none ${
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
    </nav>
  );
};

export default BottomNav;
