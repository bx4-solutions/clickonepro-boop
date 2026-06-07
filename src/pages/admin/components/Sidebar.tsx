import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BarChart3,
  Globe,
  Users,
  TrendingUp,
  FileText,
  Bell,
  LogOut,
  PenSquare,
  Target,
  FlaskConical,
  Settings,
} from "lucide-react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import logoWhite from "@/assets/clickone-logo-white.png";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "campaigns", label: "Campanhas", icon: Target },
  { id: "ab-tests", label: "Testes A/B", icon: FlaskConical },
  { id: "overview", label: "Visão Geral", icon: BarChart3 },
  { id: "site", label: "Site", icon: Globe },
  { id: "audience", label: "Audiência", icon: Users },
  { id: "acquisition", label: "Aquisição", icon: TrendingUp },
  { id: "blog", label: "Analytics do Blog", icon: FileText },
  { id: "alerts", label: "Alertas", icon: Bell },
];

const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  const { signOut } = useAdminAuth();
  const location = useLocation();

  return (
    <aside className="w-64 bg-primary min-h-screen flex flex-col">
      <div className="p-6 border-b border-primary-foreground/20">
        <a href="https://sidingdepot.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
          <img src={logoWhite} alt="SidingDepot" className="h-8" />
        </a>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
              activeTab === item.id
                ? "bg-primary-foreground text-primary"
                : "text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground"
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </button>
        ))}

        <div className="pt-4 border-t border-primary-foreground/20 mt-4">
          <Link
            to="/admin/blog"
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
              location.pathname === "/admin/blog"
                ? "bg-primary-foreground text-primary"
                : "text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground"
            )}
          >
            <PenSquare className="h-5 w-5" />
            Gerenciar Blog
          </Link>
        </div>
      </nav>

      <div className="p-4 border-t border-primary-foreground/20 space-y-1">
        <Link
          to="/admin/settings"
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
            location.pathname === "/admin/settings"
              ? "bg-primary-foreground/20 text-primary-foreground"
              : "text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground"
          )}
        >
          <Settings className="h-5 w-5" />
          Chaves de API
        </Link>
        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-primary-foreground/80 hover:bg-destructive/20 hover:text-destructive-foreground transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Sair
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
