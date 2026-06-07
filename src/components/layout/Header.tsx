import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { EXTERNAL_URLS } from "@/lib/external-urls";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  X, 
  ChevronDown, 
  Phone, 
  MessageSquare, 
  Layers, 
  Award,
  Sparkles,
  Wind,
  Wrench,
  Zap,
  TreeDeciduous,
  Waves,
  PaintBucket,
  Grid3X3,
  Stethoscope,
  Smile,
  PersonStanding,
  PawPrint,
  Scissors,
  Flower2,
  HardHat,
  Home,
  Truck,
  Bug,
  Key,
  ClipboardCheck,
  Building,
  Building2,
  MapPin,
  ArrowRight
} from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import clickoneLogoOfficialWhite from "@/assets/clickone-logo-official-white.png";

const Header = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productDropdownOpen, setProductDropdownOpen] = useState(false);
  const [whoWeServeDropdownOpen, setWhoWeServeDropdownOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;
  const isActivePrefix = (prefix: string) => location.pathname.startsWith(prefix);

  // Product menu items with icons
  const productItems = [
    { 
      name: t("nav.voiceReceptionist"), 
      desc: t("megaMenu.product.voiceDesc"),
      slug: "/produto/recepcionista-ia-voz", 
      icon: Phone 
    },
    { 
      name: t("nav.chatAttendant"), 
      desc: t("megaMenu.product.chatDesc"),
      slug: "/produto/atendente-ia-conversacional", 
      icon: MessageSquare 
    },
    { 
      name: t("megaMenu.product.verticalInfra"), 
      desc: t("megaMenu.product.verticalInfraDesc"),
      slug: "/produto/infraestrutura-vertical", 
      icon: Layers 
    },
    { 
      name: t("megaMenu.product.whyClickone"), 
      desc: t("megaMenu.product.whyClickoneDesc"),
      slug: "/sobre", 
      icon: Award 
    },
  ];

  // Sectors organized by category
  const sectorCategories = [
    {
      title: t("megaMenu.sectors.homeServices"),
      items: [
        { name: t("sectors.cleaning"), slug: "limpeza", icon: Sparkles },
        { name: t("sectors.hvac"), slug: "hvac", icon: Wind },
        { name: t("sectors.plumbing"), slug: "encanamento", icon: Wrench },
        { name: t("sectors.electrical"), slug: "eletrica", icon: Zap },
        { name: t("sectors.landscaping"), slug: "paisagismo", icon: TreeDeciduous },
        { name: t("sectors.pool"), slug: "piscinas", icon: Waves },
        { name: t("sectors.painters"), slug: "pintura", icon: PaintBucket },
        { name: t("sectors.flooring"), slug: "pisos", icon: Grid3X3 },
      ]
    },
    {
      title: t("megaMenu.sectors.healthWellness"),
      items: [
        { name: t("sectors.medicalClinic"), slug: "clinica-medica", icon: Stethoscope },
        { name: t("sectors.dentist"), slug: "dentista", icon: Smile },
        { name: t("sectors.chiropractor"), slug: "quiropraxia", icon: PersonStanding },
        { name: t("sectors.veterinary"), slug: "veterinario", icon: PawPrint },
        { name: t("sectors.hairSalon"), slug: "salao-beleza", icon: Scissors },
        { name: t("sectors.spaMassage"), slug: "spa-massagem", icon: Flower2 },
      ]
    },
    {
      title: t("megaMenu.sectors.constructionOthers"),
      items: [
        { name: t("sectors.construction"), slug: "construcao", icon: HardHat },
        { name: t("sectors.roofing"), slug: "telhados", icon: Home },
        { name: t("sectors.moving"), slug: "mudancas", icon: Truck },
        { name: t("sectors.pestControl"), slug: "controle-pragas", icon: Bug },
        { name: t("sectors.locksmith"), slug: "chaveiro", icon: Key },
        { name: t("sectors.homeInspection"), slug: "inspecao-residencial", icon: ClipboardCheck },
      ]
    }
  ];

  const businessTypes = [
    { name: t("nav.smallBusiness"), slug: "/empresas/pequena-empresa", icon: Building },
    { name: t("nav.mediumBusiness"), slug: "/empresas/media-empresa", icon: Building2 },
    { name: t("nav.localBusiness"), slug: "/empresas/negocios-locais", icon: MapPin },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-primary">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 z-10">
          <img src={clickoneLogoOfficialWhite} alt="ClickOne AI" className="h-8 md:h-10 w-auto" width="172" height="40" />
        </Link>

        {/* Desktop Navigation - Center Menu */}
        <nav className="hidden md:flex flex-1 items-center justify-center gap-8">
          <Link 
            to="/" 
            aria-current={isActive("/") ? "page" : undefined}
            className={`text-sm font-medium transition-colors relative ${
              isActive("/") 
                ? "text-primary-foreground after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-0.5 after:bg-primary-foreground after:rounded-full" 
                : "text-primary-foreground/80 hover:text-primary-foreground"
            }`}
          >
            Home
          </Link>
          
          {/* Produto Mega Menu */}
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger 
                  className={`text-sm font-medium bg-transparent hover:bg-primary-foreground/10 data-[state=open]:bg-primary-foreground/10 ${
                    isActivePrefix("/produto") 
                      ? "text-primary-foreground" 
                      : "text-primary-foreground/80 hover:text-primary-foreground"
                  }`}
                >
                  <span className={`relative ${
                    isActivePrefix("/produto") 
                      ? "after:absolute after:bottom-[-6px] after:left-0 after:w-full after:h-0.5 after:bg-primary-foreground after:rounded-full" 
                      : ""
                  }`}>
                    {t("nav.product")}
                  </span>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="flex w-[600px] shadow-2xl rounded-lg overflow-hidden">
                    {/* Left Panel - CTA */}
                    <div className="w-1/3 bg-primary p-6 flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-primary-foreground mb-2">
                          {t("megaMenu.product.title")}
                        </h3>
                        <p className="text-sm text-primary-foreground/80 mb-6">
                          {t("megaMenu.product.description")}
                        </p>
                      </div>
                      <Button asChild size="sm" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 w-full">
                        <Link to="/agendar-demo" className="flex items-center gap-2">
                          {t("megaMenu.product.cta")}
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                    
                    {/* Right Grid - Products */}
                    <div className="w-2/3 bg-background p-4">
                      <div className="grid grid-cols-2 gap-2">
                        {productItems.map((item) => (
                          <NavigationMenuLink asChild key={item.slug}>
                            <Link
                              to={item.slug}
                              className={`flex items-start gap-3 p-3 rounded-lg transition-colors hover:bg-primary/5 group ${
                                isActive(item.slug) ? "bg-primary/10" : ""
                              }`}
                            >
                              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                                <item.icon className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-foreground">{item.name}</div>
                                <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                              </div>
                            </Link>
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Setores Mega Menu */}
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger 
                  className={`text-sm font-medium bg-transparent hover:bg-primary-foreground/10 data-[state=open]:bg-primary-foreground/10 ${
                    isActivePrefix("/setores") || isActivePrefix("/empresas")
                      ? "text-primary-foreground" 
                      : "text-primary-foreground/80 hover:text-primary-foreground"
                  }`}
                >
                  <span className={`relative ${
                    isActivePrefix("/setores") || isActivePrefix("/empresas")
                      ? "after:absolute after:bottom-[-6px] after:left-0 after:w-full after:h-0.5 after:bg-primary-foreground after:rounded-full" 
                      : ""
                  }`}>
                    {t("nav.sectors")}
                  </span>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="flex w-[900px] shadow-2xl rounded-lg overflow-hidden">
                    {/* Left Panel - CTA */}
                    <div className="w-1/4 bg-primary p-6 flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-primary-foreground mb-2">
                          {t("megaMenu.sectors.title")}
                        </h3>
                        <p className="text-sm text-primary-foreground/80 mb-6">
                          {t("megaMenu.sectors.description")}
                        </p>
                      </div>
                      <div className="space-y-3">
                        <Button asChild size="sm" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 w-full">
                          <Link to="/setores" className="flex items-center gap-2">
                            {t("megaMenu.sectors.cta")}
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                        
                        {/* Business Types */}
                        <div className="pt-4 border-t border-primary-foreground/20">
                          <p className="text-xs text-primary-foreground/60 uppercase tracking-wider mb-3">{t("nav.companies")}</p>
                          <div className="space-y-2">
                            {businessTypes.map((type) => (
                              <Link
                                key={type.slug}
                                to={type.slug}
                                className={`flex items-center gap-2 text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors ${
                                  isActive(type.slug) ? "text-primary-foreground font-medium" : ""
                                }`}
                              >
                                <type.icon className="h-4 w-4" />
                                {type.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Right Grid - Sectors by Category */}
                    <div className="w-3/4 bg-background p-5">
                      <div className="grid grid-cols-3 gap-6">
                        {sectorCategories.map((category) => (
                          <div key={category.title}>
                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                              {category.title}
                            </h4>
                            <div className="space-y-1">
                              {category.items.map((item) => (
                                <NavigationMenuLink asChild key={item.slug}>
                                  <Link
                                    to={`/setores/${item.slug}`}
                                    className={`flex items-center gap-2.5 py-2 px-2 rounded-md transition-colors hover:bg-primary/5 group ${
                                      isActive(`/setores/${item.slug}`) ? "bg-primary/10" : ""
                                    }`}
                                  >
                                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                                      <item.icon className="h-3.5 w-3.5 text-primary" />
                                    </div>
                                    <span className="text-sm text-foreground">{item.name}</span>
                                  </Link>
                                </NavigationMenuLink>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <Link 
            to="/sobre" 
            aria-current={isActive("/sobre") ? "page" : undefined}
            className={`text-sm font-medium transition-colors relative ${
              isActive("/sobre") 
                ? "text-primary-foreground after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-0.5 after:bg-primary-foreground after:rounded-full" 
                : "text-primary-foreground/80 hover:text-primary-foreground"
            }`}
          >
            {t("nav.about")}
          </Link>

          <Link 
            to="/contato" 
            aria-current={isActive("/contato") ? "page" : undefined}
            className={`text-sm font-medium transition-colors relative ${
              isActive("/contato") 
                ? "text-primary-foreground after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-0.5 after:bg-primary-foreground after:rounded-full" 
                : "text-primary-foreground/80 hover:text-primary-foreground"
            }`}
          >
            {t("nav.contact")}
          </Link>
        </nav>

        {/* Desktop Right Group - Buttons + Flag */}
        <div className="hidden md:flex items-center gap-3">
          <Button asChild variant="secondary" className="min-w-[120px] h-10 justify-center bg-primary-foreground text-primary hover:bg-primary-foreground/90">
            <a href={EXTERNAL_URLS.GHL_BOOKING} target="_blank" rel="noopener noreferrer">{t("nav.bookDemo")}</a>
          </Button>
          <Button asChild variant="ghost" className="min-w-[120px] h-10 justify-center bg-primary-foreground/15 border border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/25 hover:border-primary-foreground/60">
            <a href={EXTERNAL_URLS.APP_LOGIN} target="_blank" rel="noopener noreferrer">{t("nav.login")}</a>
          </Button>
          <LanguageSwitcher />
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-primary-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? t("nav.closeMenu") : t("nav.openMenu")}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-primary/95 backdrop-blur-sm border-t border-primary-foreground/20">
          <nav className="container py-4 flex flex-col gap-4">
            <Link
              to="/"
              className={`text-sm font-medium py-2 border-l-2 pl-3 ${
                isActive("/") 
                  ? "text-primary-foreground border-primary-foreground bg-primary-foreground/10" 
                  : "text-primary-foreground/80 border-transparent"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            
            {/* Produto Dropdown Mobile */}
            <div>
              <button
                className={`flex items-center justify-between w-full text-sm font-medium py-2 border-l-2 pl-3 ${
                  isActivePrefix("/produto") 
                    ? "text-primary-foreground border-primary-foreground bg-primary-foreground/10" 
                    : "text-primary-foreground/80 border-transparent"
                }`}
                onClick={() => setProductDropdownOpen(!productDropdownOpen)}
              >
                {t("nav.product")}
                <ChevronDown className={`h-4 w-4 transition-transform ${productDropdownOpen ? "rotate-180" : ""}`} />
              </button>
              {productDropdownOpen && (
                <div className="pl-4 flex flex-col gap-1 mt-2">
                  {productItems.map((item) => (
                    <Link
                      key={item.slug}
                      to={item.slug}
                      className={`flex items-center gap-3 text-sm py-2 pl-3 border-l-2 ${
                        isActive(item.slug) 
                          ? "text-primary-foreground border-primary-foreground font-medium" 
                          : "text-primary-foreground/70 border-transparent"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* A quem servimos Dropdown Mobile */}
            <div>
              <button
                className={`flex items-center justify-between w-full text-sm font-medium py-2 border-l-2 pl-3 ${
                  isActivePrefix("/setores") || isActivePrefix("/empresas")
                    ? "text-primary-foreground border-primary-foreground bg-primary-foreground/10" 
                    : "text-primary-foreground/80 border-transparent"
                }`}
                onClick={() => setWhoWeServeDropdownOpen(!whoWeServeDropdownOpen)}
              >
                {t("nav.sectors")}
                <ChevronDown className={`h-4 w-4 transition-transform ${whoWeServeDropdownOpen ? "rotate-180" : ""}`} />
              </button>
              {whoWeServeDropdownOpen && (
                <div className="pl-4 flex flex-col gap-2 mt-2">
                  {sectorCategories.map((category) => (
                    <div key={category.title}>
                      <span className="text-xs font-semibold text-primary-foreground/60 uppercase tracking-wider py-1 pl-3 block">
                        {category.title}
                      </span>
                      {category.items.slice(0, 3).map((item) => (
                        <Link
                          key={item.slug}
                          to={`/setores/${item.slug}`}
                          className={`flex items-center gap-3 text-sm py-2 pl-3 border-l-2 ${
                            isActive(`/setores/${item.slug}`) 
                              ? "text-primary-foreground border-primary-foreground font-medium" 
                              : "text-primary-foreground/70 border-transparent"
                          }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <item.icon className="h-4 w-4" />
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  ))}
                  <Link
                    to="/setores"
                    className={`flex items-center gap-2 text-sm font-medium py-2 pl-3 border-l-2 mt-2 ${
                      isActive("/setores") 
                        ? "text-primary-foreground border-primary-foreground" 
                        : "text-primary-foreground border-transparent"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <ArrowRight className="h-4 w-4" />
                    {t("nav.viewAll")}
                  </Link>
                  
                  <span className="text-xs font-semibold text-primary-foreground/60 uppercase tracking-wider py-2 pl-3 mt-2 block">
                    {t("nav.companies")}
                  </span>
                  {businessTypes.map((type) => (
                    <Link
                      key={type.slug}
                      to={type.slug}
                      className={`flex items-center gap-3 text-sm py-2 pl-3 border-l-2 ${
                        isActive(type.slug) 
                          ? "text-primary-foreground border-primary-foreground font-medium" 
                          : "text-primary-foreground/70 border-transparent"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <type.icon className="h-4 w-4" />
                      {type.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/sobre"
              className={`text-sm font-medium py-2 border-l-2 pl-3 ${
                isActive("/sobre") 
                  ? "text-primary-foreground border-primary-foreground bg-primary-foreground/10" 
                  : "text-primary-foreground/80 border-transparent"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("nav.about")}
            </Link>

            <Link
              to="/contato"
              className={`text-sm font-medium py-2 border-l-2 pl-3 ${
                isActive("/contato") 
                  ? "text-primary-foreground border-primary-foreground bg-primary-foreground/10" 
                  : "text-primary-foreground/80 border-transparent"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("nav.contact")}
            </Link>

            {/* Language Switcher Mobile */}
            <div className="py-2">
              <LanguageSwitcher />
            </div>

            <div className="flex flex-col gap-2 mt-2">
              <Button asChild variant="secondary" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                <a href={EXTERNAL_URLS.GHL_BOOKING} target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)}>
                  {t("nav.bookDemo")}
                </a>
              </Button>
              <Button asChild variant="ghost" className="bg-primary-foreground/15 border border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/25 hover:border-primary-foreground/60">
                <a href="https://app.clickonepro.com/" target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)}>
                  {t("nav.login")}
                </a>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
