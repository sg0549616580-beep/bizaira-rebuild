import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Bot, Save, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AISetting {
  id: string;
  setting_key: string;
  setting_value: string;
  description: string | null;
}

const defaultSettings = [
  { setting_key: "default_model", setting_value: "google/gemini-3-flash-preview", description: "מודל AI ברירת מחדל" },
  { setting_key: "ai_provider", setting_value: "lovable", description: "ספק AI (lovable / openai / anthropic)" },
  { setting_key: "max_tokens", setting_value: "2048", description: "מספר טוקנים מקסימלי לתגובה" },
  { setting_key: "temperature", setting_value: "0.7", description: "טמפרטורת יצירתיות (0-1)" },
];

const availableModels = [
  "google/gemini-2.5-pro",
  "google/gemini-2.5-flash",
  "google/gemini-2.5-flash-lite",
  "google/gemini-3-flash-preview",
  "google/gemini-3.1-pro-preview",
  "openai/gpt-5",
  "openai/gpt-5-mini",
  "openai/gpt-5-nano",
  "openai/gpt-5.2",
];

const AdminAIPage = () => {
  const [settings, setSettings] = useState<AISetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [newSetting, setNewSetting] = useState({ setting_key: "", setting_value: "", description: "" });
  const { toast } = useToast();

  const fetchSettings = async () => {
    const { data } = await supabase.from("ai_settings").select("*").order("setting_key");
    if (data) setSettings(data as AISetting[]);
    setLoading(false);
  };

  useEffect(() => { fetchSettings(); }, []);

  const initDefaults = async () => {
    for (const s of defaultSettings) {
      await supabase.from("ai_settings").upsert(s, { onConflict: "setting_key" });
    }
    toast({ title: "הגדרות ברירת מחדל נטענו" });
    fetchSettings();
  };

  const updateSetting = async (id: string, value: string) => {
    await supabase.from("ai_settings").update({ setting_value: value, updated_at: new Date().toISOString() }).eq("id", id);
    toast({ title: "נשמר" });
    fetchSettings();
  };

  const handleCreate = async () => {
    if (!newSetting.setting_key) return;
    const { error } = await supabase.from("ai_settings").insert(newSetting);
    if (error) {
      toast({ title: "שגיאה", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "נוצר בהצלחה" });
      setShowNew(false);
      setNewSetting({ setting_key: "", setting_value: "", description: "" });
      fetchSettings();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("למחוק הגדרה זו?")) return;
    await supabase.from("ai_settings").delete().eq("id", id);
    toast({ title: "נמחק" });
    fetchSettings();
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" /></div>;

  return (
    <div dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">כלי AI</h1>
        <div className="flex gap-2">
          {settings.length === 0 && (
            <button onClick={initDefaults} className="bg-secondary text-secondary-foreground px-4 py-2 rounded-xl text-sm font-bold">
              טען ברירת מחדל
            </button>
          )}
          <button onClick={() => setShowNew(!showNew)} className="gradient-glow text-primary-foreground px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
            <Plus size={16} /> הוסף הגדרה
          </button>
        </div>
      </div>

      {showNew && (
        <div className="glass-card rounded-xl p-4 mb-4 space-y-3">
          <input placeholder="מפתח (key)" value={newSetting.setting_key} onChange={(e) => setNewSetting({ ...newSetting, setting_key: e.target.value })} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm" dir="ltr" />
          <input placeholder="ערך" value={newSetting.setting_value} onChange={(e) => setNewSetting({ ...newSetting, setting_value: e.target.value })} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm" dir="ltr" />
          <input placeholder="תיאור" value={newSetting.description} onChange={(e) => setNewSetting({ ...newSetting, description: e.target.value })} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm" />
          <button onClick={handleCreate} className="gradient-glow text-primary-foreground px-4 py-2 rounded-lg text-sm font-bold">צור</button>
        </div>
      )}

      <div className="space-y-4">
        {settings.map((s) => (
          <div key={s.id} className="glass-card rounded-xl p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="font-bold text-sm flex items-center gap-2">
                  <Bot size={14} className="text-primary" />
                  {s.description || s.setting_key}
                </div>
                <div className="text-[10px] text-muted-foreground font-mono mt-0.5" dir="ltr">{s.setting_key}</div>
              </div>
              <button onClick={() => handleDelete(s.id)} className="p-1.5 hover:bg-destructive/10 rounded-lg">
                <Trash2 size={14} className="text-destructive" />
              </button>
            </div>
            {s.setting_key === "default_model" ? (
              <select
                value={s.setting_value}
                onChange={(e) => updateSetting(s.id, e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm"
                dir="ltr"
              >
                {availableModels.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            ) : (
              <div className="flex gap-2">
                <input
                  defaultValue={s.setting_value}
                  onBlur={(e) => {
                    if (e.target.value !== s.setting_value) updateSetting(s.id, e.target.value);
                  }}
                  className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm"
                  dir="ltr"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminAIPage;
