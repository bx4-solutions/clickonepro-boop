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
  Menu,
  X,
  Target,
  FlaskConical,
  Settings,
} from "lucide-react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import logoWhite from "@/assets/clickone-logo-white.png";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface MobileSidebarProps {
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

const MobileSidebar = ({ activeTab, onTabChange }: MobileSidebarProps) => {
  const { signOut } = useAdminAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleTabChange = (tab: string) => {
    onTabChange(tab);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0 bg-primary border-none">
        <SheetHeader className="p-6 border-b border-primary-foreground/20">
          <Link to="/" className="flex items-center gap-2">
            <img src={logoWhite} alt="ClickOne" className="h-8" />
          </Link>
        </SheetHeader>

        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
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
              onClick={() => setOpen(false)}
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
            onClick={() => setOpen(false)}
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
            onClick={() => {
              signOut();
              setOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-primary-foreground/80 hover:bg-destructive/20 hover:text-destructive-foreground transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Sair
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
