import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Save, Plus, Trash2, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SystemSetting {
  id: string;
  key: string;
  value: any;
}

const AdminSettingsPage = () => {
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const { toast } = useToast();

  const fetchSettings = async () => {
    const { data } = await supabase.from("system_settings").select("*").order("key");
    if (data) setSettings(data as SystemSetting[]);
    setLoading(false);
  };

  useEffect(() => { fetchSettings(); }, []);

  const handleCreate = async () => {
    if (!newKey) return;
    let parsedValue: any;
    try { parsedValue = JSON.parse(newValue); } catch { parsedValue = newValue; }
    const { error } = await supabase.from("system_settings").insert({ key: newKey, value: parsedValue });
    if (error) {
      toast({ title: "שגיאה", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "ההגדרה נוצרה" });
      setShowNew(false);
      setNewKey("");
      setNewValue("");
      fetchSettings();
    }
  };

  const updateSetting = async (id: string, value: string) => {
    let parsedValue: any;
    try { parsedValue = JSON.parse(value); } catch { parsedValue = value; }
    await supabase.from("system_settings").update({ value: parsedValue, updated_at: new Date().toISOString() }).eq("id", id);
    toast({ title: "נשמר" });
    fetchSettings();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("למחוק?")) return;
    await supabase.from("system_settings").delete().eq("id", id);
    toast({ title: "נמחק" });
    fetchSettings();
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" /></div>;

  return (
    <div dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">הגדרות מערכת</h1>
        <button onClick={() => setShowNew(!showNew)} className="gradient-glow text-primary-foreground px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
          <Plus size={16} /> הוסף הגדרה
        </button>
      </div>

      {showNew && (
        <div className="glass-card rounded-xl p-4 mb-4 space-y-3">
          <input placeholder="מפתח (key)" value={newKey} onChange={(e) => setNewKey(e.target.value)} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm" dir="ltr" />
          <textarea placeholder="ערך (JSON או טקסט)" value={newValue} onChange={(e) => setNewValue(e.target.value)} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm h-24" dir="ltr" />
          <button onClick={handleCreate} className="gradient-glow text-primary-foreground px-4 py-2 rounded-lg text-sm font-bold">צור</button>
        </div>
      )}

      <div className="space-y-4">
        {settings.map((s) => (
          <div key={s.id} className="glass-card rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="font-bold text-sm flex items-center gap-2">
                <Settings size={14} className="text-primary" />
                {s.key}
              </div>
              <button onClick={() => handleDelete(s.id)} className="p-1.5 hover:bg-destructive/10 rounded-lg">
                <Trash2 size={14} className="text-destructive" />
              </button>
            </div>
            <textarea
              defaultValue={typeof s.value === "string" ? s.value : JSON.stringify(s.value, null, 2)}
              onBlur={(e) => updateSetting(s.id, e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-mono h-20"
              dir="ltr"
            />
          </div>
        ))}
      </div>

      {settings.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Settings size={32} className="mx-auto mb-2 opacity-50" />
          <p>אין הגדרות מערכת. לחץ "הוסף הגדרה" כדי להתחיל.</p>
        </div>
      )}
    </div>
  );
};

export default AdminSettingsPage;
