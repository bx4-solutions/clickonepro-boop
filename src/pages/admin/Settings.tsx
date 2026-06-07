import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AdminAuthProvider, useAdminAuth } from "@/contexts/AdminAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Save, Eye, EyeOff, CheckCircle, AlertCircle, ArrowLeft, Key } from "lucide-react";

// ── Providers config ──────────────────────────────────────────────────────────

const PROVIDERS = [
  { id: "anthropic_api_key", label: "Claude",  sub: "Anthropic",      emoji: "🟣", placeholder: "sk-ant-api03-...", docsUrl: "https://console.anthropic.com/settings/keys" },
  { id: "openai_api_key",    label: "GPT-4o",  sub: "OpenAI",         emoji: "🟢", placeholder: "sk-proj-...",     docsUrl: "https://platform.openai.com/api-keys" },
  { id: "gemini_api_key",    label: "Gemini",  sub: "Google",         emoji: "🔵", placeholder: "AIza...",          docsUrl: "https://aistudio.google.com/app/apikey" },
  { id: "pexels_api_key",    label: "Pexels",  sub: "Imagens (free)", emoji: "🖼️", placeholder: "pexels-...",      docsUrl: "https://www.pexels.com/api/" },
] as const;

type ProviderId = typeof PROVIDERS[number]["id"];

// ── Main ──────────────────────────────────────────────────────────────────────

function SettingsContent() {
  const { user, isAdmin, isLoading: authLoading } = useAdminAuth();
  const navigate = useNavigate();

  const [keys,    setKeys]    = useState<Record<ProviderId, string>>({ anthropic_api_key: "", openai_api_key: "", gemini_api_key: "", pexels_api_key: "" });
  const [visible, setVisible] = useState<Record<string, boolean>>({});
  const [saving,  setSaving]  = useState<Record<string, boolean>>({});
  const [saved,   setSaved]   = useState<Record<string, boolean>>({});
  const [errors,  setErrors]  = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) navigate("/admin/login");
  }, [user, isAdmin, authLoading, navigate]);

  // Load saved keys
  useEffect(() => {
    if (!user || !isAdmin) return;
    (async () => {
      const { data } = await supabase
        .from("dashboard_settings")
        .select("key, value")
        .in("key", PROVIDERS.map((p) => p.id));
      if (data) {
        const loaded: Partial<Record<ProviderId, string>> = {};
        data.forEach((row) => { loaded[row.key as ProviderId] = row.value ?? ""; });
        setKeys((prev) => ({ ...prev, ...loaded }));
      }
      setLoading(false);
    })();
  }, [user, isAdmin]);

  const handleSave = async (id: ProviderId) => {
    setSaving((s) => ({ ...s, [id]: true }));
    setErrors((e) => ({ ...e, [id]: "" }));
    try {
      const { error } = await supabase.from("dashboard_settings").upsert({
        key: id, value: keys[id], updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      setSaved((s) => ({ ...s, [id]: true }));
      setTimeout(() => setSaved((s) => ({ ...s, [id]: false })), 3000);
    } catch (err: any) {
      setErrors((e) => ({ ...e, [id]: err.message }));
    } finally {
      setSaving((s) => ({ ...s, [id]: false }));
    }
  };

  const maskKey = (k: string) =>
    k.length <= 8 ? "•".repeat(k.length) : k.slice(0, 6) + "•".repeat(Math.min(k.length - 10, 24)) + k.slice(-4);

  if (authLoading || loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <Link to="/admin/dashboard">
            <button className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Key className="h-6 w-6 text-purple-400" /> Chaves de API
            </h1>
            <p className="text-zinc-400 text-sm mt-0.5">Configure os provedores de IA usados no gerador de artigos do blog.</p>
          </div>
        </div>

        {/* Cards */}
        <div className="space-y-5">
          {PROVIDERS.map((p) => {
            const hasKey = keys[p.id]?.trim().length > 0;
            const isVisible = visible[p.id];
            return (
              <div key={p.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">

                {/* Provider row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{p.emoji}</span>
                    <div>
                      <p className="font-semibold text-white">{p.label}</p>
                      <p className="text-xs text-zinc-500">{p.sub}</p>
                    </div>
                  </div>
                  {hasKey ? (
                    <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-1 rounded-full">
                      <CheckCircle className="h-3 w-3" /> Configurado
                    </span>
                  ) : (
                    <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded-full">Não configurado</span>
                  )}
                </div>

                {/* Input */}
                <div className="relative">
                  <input
                    type={isVisible ? "text" : "password"}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 pr-12 text-white font-mono text-sm placeholder-zinc-600 focus:outline-none focus:border-purple-500 transition-colors"
                    placeholder={p.placeholder}
                    value={isVisible ? keys[p.id] : hasKey ? maskKey(keys[p.id]) : ""}
                    onChange={(e) => setKeys((k) => ({ ...k, [p.id]: e.target.value }))}
                    onFocus={() => !isVisible && setVisible((v) => ({ ...v, [p.id]: true }))}
                    autoComplete="off"
                    spellCheck={false}
                  />
                  <button
                    type="button"
                    onClick={() => setVisible((v) => ({ ...v, [p.id]: !v[p.id] }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                  >
                    {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {/* Error */}
                {errors[p.id] && (
                  <p className="text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors[p.id]}
                  </p>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <a href={p.docsUrl} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-purple-400 hover:text-purple-300 underline underline-offset-2 transition-colors">
                    Obter chave grátis →
                  </a>
                  <button
                    onClick={() => handleSave(p.id)}
                    disabled={saving[p.id]}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                  >
                    {saving[p.id] ? <Loader2 className="h-4 w-4 animate-spin" />
                      : saved[p.id]  ? <CheckCircle className="h-4 w-4 text-emerald-300" />
                      : <Save className="h-4 w-4" />}
                    {saved[p.id] ? "Salvo!" : "Salvar"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Info */}
        <div className="mt-8 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 text-xs text-zinc-400 space-y-2">
          <p className="font-medium text-zinc-300">🔒 Segurança</p>
          <p>As chaves ficam no Supabase com acesso restrito a usuários autenticados. São enviadas via HTTPS para a Edge Function somente no momento da geração do artigo.</p>
          <p>Configure pelo menos <strong className="text-zinc-300">uma chave de IA</strong> para o gerador funcionar. O Gemini tem plano gratuito generoso.</p>
          <p className="mt-1">A chave <strong className="text-zinc-300">Pexels</strong> é opcional — melhora a qualidade das imagens geradas automaticamente. Gratuita em <a href="https://www.pexels.com/api/" target="_blank" rel="noopener noreferrer" className="text-purple-400 underline">pexels.com/api</a>.</p>
        </div>
      </div>
    </div>
  );
}

export default function Settings() {
  return (
    <AdminAuthProvider>
      <SettingsContent />
    </AdminAuthProvider>
  );
}
