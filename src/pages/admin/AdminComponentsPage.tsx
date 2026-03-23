import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit, Trash2, Save, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SiteComponent {
  id: string;
  component_type: string;
  label_he: string;
  label_en: string;
  target_url: string | null;
  page_slug: string | null;
  props: Record<string, any>;
}

const AdminComponentsPage = () => {
  const [components, setComponents] = useState<SiteComponent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<SiteComponent>>({});
  const [showNew, setShowNew] = useState(false);
  const [newComp, setNewComp] = useState({ component_type: "button", label_he: "", label_en: "", target_url: "" });
  const { toast } = useToast();

  const fetch = async () => {
    const { data } = await supabase.from("site_components").select("*").order("created_at");
    if (data) setComponents(data as SiteComponent[]);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const handleCreate = async () => {
    if (!newComp.label_he) return;
    const { error } = await supabase.from("site_components").insert(newComp);
    if (error) {
      toast({ title: "שגיאה", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "הרכיב נוצר בהצלחה" });
      setShowNew(false);
      setNewComp({ component_type: "button", label_he: "", label_en: "", target_url: "" });
      fetch();
    }
  };

  const handleSave = async (id: string) => {
    const { error } = await supabase.from("site_components").update({ ...editData, updated_at: new Date().toISOString() }).eq("id", id);
    if (error) {
      toast({ title: "שגיאה", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "נשמר" });
      setEditing(null);
      fetch();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("למחוק רכיב זה?")) return;
    await supabase.from("site_components").delete().eq("id", id);
    toast({ title: "הרכיב נמחק" });
    fetch();
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" /></div>;

  return (
    <div dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">ניהול רכיבים</h1>
        <button onClick={() => setShowNew(!showNew)} className="gradient-glow text-primary-foreground px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
          <Plus size={16} /> הוסף רכיב
        </button>
      </div>

      {showNew && (
        <div className="glass-card rounded-xl p-4 mb-4 space-y-3">
          <select
            value={newComp.component_type}
            onChange={(e) => setNewComp({ ...newComp, component_type: e.target.value })}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm"
          >
            <option value="button">כפתור</option>
            <option value="link">קישור</option>
            <option value="cta">קריאה לפעולה</option>
          </select>
          <input placeholder="טקסט בעברית" value={newComp.label_he} onChange={(e) => setNewComp({ ...newComp, label_he: e.target.value })} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm" />
          <input placeholder="English text" value={newComp.label_en} onChange={(e) => setNewComp({ ...newComp, label_en: e.target.value })} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm" dir="ltr" />
          <input placeholder="כתובת יעד (URL)" value={newComp.target_url} onChange={(e) => setNewComp({ ...newComp, target_url: e.target.value })} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm" dir="ltr" />
          <button onClick={handleCreate} className="gradient-glow text-primary-foreground px-4 py-2 rounded-lg text-sm font-bold">צור רכיב</button>
        </div>
      )}

      <div className="space-y-3">
        {components.map((comp) => (
          <div key={comp.id} className="glass-card rounded-xl p-4">
            {editing === comp.id ? (
              <div className="space-y-3">
                <select value={editData.component_type || ""} onChange={(e) => setEditData({ ...editData, component_type: e.target.value })} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm">
                  <option value="button">כפתור</option>
                  <option value="link">קישור</option>
                  <option value="cta">קריאה לפעולה</option>
                </select>
                <input value={editData.label_he || ""} onChange={(e) => setEditData({ ...editData, label_he: e.target.value })} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm" placeholder="טקסט בעברית" />
                <input value={editData.label_en || ""} onChange={(e) => setEditData({ ...editData, label_en: e.target.value })} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm" dir="ltr" placeholder="English text" />
                <input value={editData.target_url || ""} onChange={(e) => setEditData({ ...editData, target_url: e.target.value })} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm" dir="ltr" placeholder="URL" />
                <div className="flex gap-2">
                  <button onClick={() => handleSave(comp.id)} className="gradient-glow text-primary-foreground px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-1"><Save size={14} /> שמור</button>
                  <button onClick={() => setEditing(null)} className="bg-muted text-foreground px-4 py-2 rounded-lg text-sm">ביטול</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full font-bold uppercase">{comp.component_type}</span>
                    <span className="font-bold text-sm">{comp.label_he}</span>
                  </div>
                  {comp.target_url && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <ExternalLink size={10} />
                      <span dir="ltr">{comp.target_url}</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => { setEditing(comp.id); setEditData(comp); }} className="p-2 hover:bg-muted rounded-lg"><Edit size={16} className="text-primary" /></button>
                  <button onClick={() => handleDelete(comp.id)} className="p-2 hover:bg-destructive/10 rounded-lg"><Trash2 size={16} className="text-destructive" /></button>
                </div>
              </div>
            )}
          </div>
        ))}
        {components.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>אין רכיבים עדיין. לחץ "הוסף רכיב" כדי להתחיל.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminComponentsPage;
