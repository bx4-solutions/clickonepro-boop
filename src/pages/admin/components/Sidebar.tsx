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
import logoSidingDepot from "@/assets/logo-sidingdepot.png";

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
    <aside className="w-64 bg-sidebar min-h-screen flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <a href={import.meta.env.DEV ? "http://localhost:4003" : "https://sidingdepot-git-main-bionicaosilva-2000s-projects.vercel.app"} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
          <img src={logoSidingDepot} alt="Siding Depot" className="h-10 w-auto" />
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
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </button>
        ))}

        <div className="pt-4 border-t border-sidebar-border mt-4">
          <Link
            to="/admin/blog"
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
              location.pathname === "/admin/blog"
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
            )}
          >
            <PenSquare className="h-5 w-5" />
            Gerenciar Blog
          </Link>
        </div>
      </nav>

      <div className="p-4 border-t border-sidebar-border space-y-1">
        <Link
          to="/admin/settings"
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
            location.pathname === "/admin/settings"
              ? "bg-sidebar-accent text-sidebar-foreground"
              : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
          )}
        >
          <Settings className="h-5 w-5" />
          Chaves de API
        </Link>
        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:bg-destructive/20 hover:text-red-300 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Sair
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
