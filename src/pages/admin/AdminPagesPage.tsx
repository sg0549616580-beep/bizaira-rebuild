import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit, Trash2, GripVertical, Save, Eye, EyeOff, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SitePage {
  id: string;
  slug: string;
  title_he: string;
  title_en: string;
  sections: any[];
  sort_order: number;
  is_published: boolean;
}

const AdminPagesPage = () => {
  const [pages, setPages] = useState<SitePage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<SitePage>>({});
  const [showNew, setShowNew] = useState(false);
  const [newPage, setNewPage] = useState({ slug: "", title_he: "", title_en: "" });
  const { toast } = useToast();

  const fetchPages = async () => {
    const { data } = await supabase
      .from("site_pages")
      .select("*")
      .order("sort_order");
    if (data) setPages(data as SitePage[]);
    setLoading(false);
  };

  useEffect(() => { fetchPages(); }, []);

  const handleCreate = async () => {
    if (!newPage.slug || !newPage.title_he) return;
    const { error } = await supabase.from("site_pages").insert({
      slug: newPage.slug,
      title_he: newPage.title_he,
      title_en: newPage.title_en || newPage.title_he,
      sort_order: pages.length,
    });
    if (error) {
      toast({ title: "שגיאה", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "העמוד נוצר בהצלחה" });
      setShowNew(false);
      setNewPage({ slug: "", title_he: "", title_en: "" });
      fetchPages();
    }
  };

  const handleSave = async (id: string) => {
    const { error } = await supabase.from("site_pages").update({
      ...editData,
      updated_at: new Date().toISOString(),
    }).eq("id", id);
    if (error) {
      toast({ title: "שגיאה", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "נשמר בהצלחה" });
      setEditing(null);
      fetchPages();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("בטוח למחוק את העמוד?")) return;
    await supabase.from("site_pages").delete().eq("id", id);
    toast({ title: "העמוד נמחק" });
    fetchPages();
  };

  const togglePublish = async (page: SitePage) => {
    await supabase.from("site_pages").update({ is_published: !page.is_published }).eq("id", page.id);
    fetchPages();
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" /></div>;

  return (
    <div dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">ניהול עמודים</h1>
        <button
          onClick={() => setShowNew(!showNew)}
          className="gradient-glow text-primary-foreground px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2"
        >
          <Plus size={16} /> הוסף עמוד
        </button>
      </div>

      {showNew && (
        <div className="glass-card rounded-xl p-4 mb-4 space-y-3">
          <input
            placeholder="slug (לדוגמה: about)"
            value={newPage.slug}
            onChange={(e) => setNewPage({ ...newPage, slug: e.target.value })}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm"
            dir="ltr"
          />
          <input
            placeholder="כותרת בעברית"
            value={newPage.title_he}
            onChange={(e) => setNewPage({ ...newPage, title_he: e.target.value })}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm"
          />
          <input
            placeholder="Title in English"
            value={newPage.title_en}
            onChange={(e) => setNewPage({ ...newPage, title_en: e.target.value })}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm"
            dir="ltr"
          />
          <button onClick={handleCreate} className="gradient-glow text-primary-foreground px-4 py-2 rounded-lg text-sm font-bold">
            צור עמוד
          </button>
        </div>
      )}

      <div className="space-y-3">
        {pages.map((page) => (
          <div key={page.id} className="glass-card rounded-xl p-4">
            {editing === page.id ? (
              <div className="space-y-3">
                <input
                  value={editData.title_he || ""}
                  onChange={(e) => setEditData({ ...editData, title_he: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-bold"
                  placeholder="כותרת בעברית"
                />
                <input
                  value={editData.title_en || ""}
                  onChange={(e) => setEditData({ ...editData, title_en: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm"
                  placeholder="Title in English"
                  dir="ltr"
                />
                <textarea
                  value={JSON.stringify(editData.sections || [], null, 2)}
                  onChange={(e) => {
                    try { setEditData({ ...editData, sections: JSON.parse(e.target.value) }); } catch {}
                  }}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-mono h-32"
                  dir="ltr"
                  placeholder="Sections (JSON)"
                />
                <div className="flex gap-2">
                  <button onClick={() => handleSave(page.id)} className="gradient-glow text-primary-foreground px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-1">
                    <Save size={14} /> שמור
                  </button>
                  <button onClick={() => setEditing(null)} className="bg-muted text-foreground px-4 py-2 rounded-lg text-sm">
                    ביטול
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <GripVertical size={16} className="text-muted-foreground cursor-grab" />
                  <div>
                    <div className="font-bold text-sm">{page.title_he}</div>
                    <div className="text-xs text-muted-foreground">/{page.slug}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => togglePublish(page)} className="p-2 hover:bg-muted rounded-lg" title={page.is_published ? "מפורסם" : "טיוטה"}>
                    {page.is_published ? <Eye size={16} className="text-green-600" /> : <EyeOff size={16} className="text-muted-foreground" />}
                  </button>
                  <button onClick={() => { setEditing(page.id); setEditData(page); }} className="p-2 hover:bg-muted rounded-lg">
                    <Edit size={16} className="text-primary" />
                  </button>
                  <button onClick={() => handleDelete(page.id)} className="p-2 hover:bg-destructive/10 rounded-lg">
                    <Trash2 size={16} className="text-destructive" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {pages.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <FileText size={32} className="mx-auto mb-2 opacity-50" />
            <p>אין עמודים עדיין. לחץ "הוסף עמוד" כדי להתחיל.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPagesPage;
