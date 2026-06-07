import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { AdminAuthProvider, useAdminAuth } from "@/contexts/AdminAuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Loader2, Sparkles, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  useCategories,
  useCreatePost,
  useUpdatePost,
  useAllPosts,
} from "@/hooks/useBlogPosts";
import { supabase } from "@/integrations/supabase/client";
import RichTextEditor from "@/components/RichTextEditor";
import CoverImageGenerator from "@/components/CoverImageGenerator";
import CategorySelector from "@/components/CategorySelector";

const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

const calculateReadTime = (content: string): number => {
  const wordsPerMinute = 200;
  const textContent = content.replace(/<[^>]*>/g, " ");
  const words = textContent.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
};

const BlogEditorContent = () => {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAdmin, isLoading: authLoading } = useAdminAuth();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [author, setAuthor] = useState("ClickOne AI Team");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiTopic, setAiTopic] = useState("");
  const [aiKeywords, setAiKeywords] = useState("");

  const { data: posts } = useAllPosts();
  const createPost = useCreatePost();
  const updatePost = useUpdatePost();

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate("/admin/login");
    }
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (isEditing && posts) {
      const post = posts.find((p) => p.id === id);
      if (post) {
        setTitle(post.title);
        setSlug(post.slug);
        setExcerpt(post.excerpt || "");
        setContent(post.content);
        setCoverImage(post.cover_image || "");
        setCategoryId(post.category_id || "");
        setAuthor(post.author);
        setMetaTitle(post.meta_title || "");
        setMetaDescription(post.meta_description || "");
      }
    }
  }, [isEditing, id, posts]);

  useEffect(() => {
    if (!isEditing && title) {
      setSlug(generateSlug(title));
    }
  }, [title, isEditing]);

  const handleSave = async (status: "draft" | "published") => {
    if (!title || !content) {
      toast({
        title: "Erro",
        description: "Título e conteúdo são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const postData = {
        title,
        slug,
        excerpt: excerpt || null,
        content,
        cover_image: coverImage || null,
        category_id: categoryId || null,
        author,
        status,
        published_at: status === "published" ? new Date().toISOString() : null,
        read_time: calculateReadTime(content),
        meta_title: metaTitle || null,
        meta_description: metaDescription || null,
      };

      if (isEditing) {
        await updatePost.mutateAsync({ id, ...postData });
        toast({ title: "Post atualizado com sucesso" });
      } else {
        await createPost.mutateAsync(postData);
        toast({ title: "Post criado com sucesso" });
        navigate("/admin/blog");
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateArticle = async () => {
    if (!aiTopic.trim()) {
      toast({ title: "Digite o tema do artigo", variant: "destructive" });
      return;
    }
    setIsGenerating(true);
    setShowAIModal(false);
    try {
      const { data, error } = await supabase.functions.invoke("generate-blog-article", {
        body: { title: aiTopic, keywords: aiKeywords },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setTitle(data.title || aiTopic);
      setSlug(data.slug || generateSlug(aiTopic));
      setContent(data.content || "");
      setExcerpt(data.excerpt || "");
      setMetaTitle(data.metaTitle || "");
      setMetaDescription(data.metaDescription || "");
      setAiTopic("");
      setAiKeywords("");
      toast({ title: "✅ Artigo gerado com sucesso!", description: "Revise e publique quando estiver pronto." });
    } catch (err: any) {
      toast({ title: "Erro ao gerar artigo", description: err.message, variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateContentImage = async (prompt: string): Promise<string> => {
    try {
      const { data, error } = await supabase.functions.invoke(
        "generate-blog-image",
        {
          body: {
            title: prompt,
            type: "content",
          },
        }
      );

      if (error) throw error;

      if (data?.imageUrl) {
        return data.imageUrl;
      }

      throw new Error("No image generated");
    } catch (error: any) {
      toast({
        title: "Erro ao gerar imagem",
        description: error.message,
        variant: "destructive",
      });
      return "";
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/admin/blog">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">
                {isEditing ? "Editar Post" : "Novo Post"}
              </h1>
              <p className="text-muted-foreground">
                {isEditing
                  ? "Atualize seu post do blog"
                  : "Crie um novo post para o blog"}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-purple-500 text-purple-400 hover:bg-purple-500/10"
              onClick={() => setShowAIModal(true)}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              {isGenerating ? "Gerando..." : "Gerar com IA"}
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSave("draft")}
              disabled={isSaving || isGenerating}
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Salvar Rascunho
            </Button>
            <Button onClick={() => handleSave("published")} disabled={isSaving || isGenerating}>
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Publicar
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Conteúdo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Digite o título do post"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="post-url-slug"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="excerpt">Resumo</Label>
                  <Textarea
                    id="excerpt"
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Breve descrição do post (aparece na listagem)"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Conteúdo</Label>
                  <RichTextEditor
                    content={content}
                    onChange={setContent}
                    onGenerateImage={handleGenerateContentImage}
                    placeholder="Escreva o conteúdo do seu post aqui..."
                  />
                  <p className="text-xs text-muted-foreground">
                    Tempo estimado de leitura: {calculateReadTime(content)} min
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Categoria</Label>
                  <CategorySelector
                    value={categoryId}
                    onChange={setCategoryId}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="author">Autor</Label>
                  <Input
                    id="author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Nome do autor"
                  />
                </div>
                <CoverImageGenerator
                  value={coverImage}
                  onChange={setCoverImage}
                  postTitle={title}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SEO</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="metaTitle">Meta Título</Label>
                  <Input
                    id="metaTitle"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    placeholder="Título para SEO"
                  />
                  <p className="text-xs text-muted-foreground">
                    {metaTitle.length}/60 caracteres
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metaDescription">Meta Descrição</Label>
                  <Textarea
                    id="metaDescription"
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    placeholder="Descrição para SEO"
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    {metaDescription.length}/160 caracteres
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* ── AI Article Generator Modal ── */}
      {showAIModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-purple-500/40 rounded-2xl p-8 w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-purple-500/20 rounded-xl p-2">
                  <Sparkles className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Gerar Artigo com IA</h2>
                  <p className="text-sm text-zinc-400">Claude vai escrever um artigo SEO completo</p>
                </div>
              </div>
              <button onClick={() => setShowAIModal(false)} className="text-zinc-500 hover:text-white transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">
                  Tema / Título do Artigo <span className="text-purple-400">*</span>
                </label>
                <input
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder='Ex: "Deck Building Cost in Marietta GA 2026"'
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleGenerateArticle()}
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">
                  Palavras-chave (opcional)
                </label>
                <input
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder='Ex: "deck cost, composite deck, Marietta GA"'
                  value={aiKeywords}
                  onChange={(e) => setAiKeywords(e.target.value)}
                />
              </div>
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 text-sm text-zinc-400">
                💡 O Claude vai gerar automaticamente: título, slug, conteúdo completo (1.200–1.800 palavras), excerpt, meta title e meta description — tudo otimizado para o nicho SidingDepot.
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAIModal(false)}
                className="flex-1 py-3 rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleGenerateArticle}
                disabled={!aiTopic.trim()}
                className="flex-1 py-3 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Sparkles className="h-4 w-4" />
                Gerar Artigo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const BlogEditor = () => {
  return (
    <AdminAuthProvider>
      <BlogEditorContent />
    </AdminAuthProvider>
  );
};

export default BlogEditor;
