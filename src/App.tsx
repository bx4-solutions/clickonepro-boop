import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";
import ScrollToTop from "./components/ScrollToTop";
import PageLoader from "./components/PageLoader";

// Lazy load all pages for better performance
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const RecepcionistaIAVoz = lazy(() => import("./pages/produto/RecepcionistaIAVoz"));
const AtendenteIAConversacional = lazy(() => import("./pages/produto/AtendenteIAConversacional"));
const InfraestruturaVertical = lazy(() => import("./pages/produto/InfraestruturaVertical"));
const Setores = lazy(() => import("./pages/setores/Setores"));
const SetorDetalhe = lazy(() => import("./pages/setores/SetorDetalhe"));
const Sobre = lazy(() => import("./pages/Sobre"));
const AgendarDemo = lazy(() => import("./pages/AgendarDemo"));
const Contato = lazy(() => import("./pages/Contato"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Obrigado = lazy(() => import("./pages/Obrigado"));
const PequenaEmpresa = lazy(() => import("./pages/empresas/PequenaEmpresa"));
const MediaEmpresa = lazy(() => import("./pages/empresas/MediaEmpresa"));
const NegociosLocais = lazy(() => import("./pages/empresas/NegociosLocais"));
const GenerateDemoAudio = lazy(() => import("./pages/admin/GenerateDemoAudio"));
const GenerateLPImages = lazy(() => import("./pages/admin/GenerateLPImages"));
const LPBuilder = lazy(() => import("./pages/admin/LPBuilder"));
const LPEditor = lazy(() => import("./pages/admin/LPEditor"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const BlogManager = lazy(() => import("./pages/admin/BlogManager"));
const BlogEditor = lazy(() => import("./pages/admin/BlogEditor"));
const Settings = lazy(() => import("./pages/admin/Settings"));
const Login = lazy(() => import("./pages/admin/Login"));
const PrivacyPolicy = lazy(() => import("./pages/legal/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/legal/TermsOfService"));
const PerdendoClientes = lazy(() => import("./pages/lp/PerdendoClientes"));
const DynamicLP = lazy(() => import("./pages/lp/DynamicLP"));

// QueryClient with default settings
const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AdminAuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/produto/recepcionista-ia-voz" element={<RecepcionistaIAVoz />} />
                <Route path="/produto/atendente-ia-conversacional" element={<AtendenteIAConversacional />} />
                <Route path="/produto/infraestrutura-vertical" element={<InfraestruturaVertical />} />
                <Route path="/setores" element={<Setores />} />
                <Route path="/setores/:slug" element={<SetorDetalhe />} />
                <Route path="/empresas/pequena-empresa" element={<PequenaEmpresa />} />
                <Route path="/empresas/media-empresa" element={<MediaEmpresa />} />
                <Route path="/empresas/negocios-locais" element={<NegociosLocais />} />
                <Route path="/sobre" element={<Sobre />} />
                <Route path="/contato" element={<Contato />} />
                <Route path="/agendar-demo" element={<AgendarDemo />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/obrigado" element={<Obrigado />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/lp/perdendo-clientes" element={<PerdendoClientes />} />
                <Route path="/lp/:slug" element={<DynamicLP />} />
                <Route path="/admin/generate-audio" element={<GenerateDemoAudio />} />
                <Route path="/admin/generate-lp-images" element={<GenerateLPImages />} />
                <Route path="/admin/lp-builder" element={<LPBuilder />} />
                <Route path="/admin/lp-builder/:id" element={<LPEditor />} />
                <Route path="/admin/login" element={<Login />} />
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/blog" element={<BlogManager />} />
                <Route path="/admin/blog/new" element={<BlogEditor />} />
                <Route path="/admin/blog/edit/:id" element={<BlogEditor />} />
                <Route path="/admin/settings" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </AdminAuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
