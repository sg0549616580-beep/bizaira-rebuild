import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Users, Download, Shield, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
  id: string;
  full_name: string | null;
  business_type: string | null;
  plan: string;
  credits_total: number;
  credits_used: number;
  marketing_consent: boolean;
  onboarding_completed: boolean;
  created_at: string;
}

const AdminUsersPage = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchUsers = async () => {
    const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    if (data) setUsers(data as UserProfile[]);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const exportMarketing = () => {
    const marketingUsers = users.filter((u) => u.marketing_consent);
    const emails = marketingUsers.map((u) => u.full_name ? `${u.full_name}` : u.id).join("\n");
    const blob = new Blob([emails], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "marketing-users.txt";
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: `יוצאו ${marketingUsers.length} משתמשים שיווקיים` });
  };

  const toggleAdmin = async (userId: string, currentlyAdmin: boolean) => {
    if (currentlyAdmin) {
      await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", "admin");
    } else {
      await supabase.from("user_roles").insert({ user_id: userId, role: "admin" as any });
    }
    toast({ title: currentlyAdmin ? "הרשאת מנהל הוסרה" : "הרשאת מנהל ניתנה" });
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" /></div>;

  return (
    <div dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">ניהול משתמשים</h1>
        <button onClick={exportMarketing} className="bg-secondary text-secondary-foreground px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
          <Download size={16} /> ייצוא שיווקי
        </button>
      </div>

      <div className="glass-card rounded-xl p-4 mb-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-foreground">{users.length}</div>
            <div className="text-xs text-muted-foreground">סה"כ משתמשים</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{users.filter(u => u.marketing_consent).length}</div>
            <div className="text-xs text-muted-foreground">הסכימו לשיווק</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">{users.filter(u => u.plan === "pro").length}</div>
            <div className="text-xs text-muted-foreground">מנויי PRO</div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {users.map((user) => (
          <div key={user.id} className="glass-card rounded-xl p-4 flex items-center justify-between">
            <div>
              <div className="font-bold text-sm">{user.full_name || "ללא שם"}</div>
              <div className="text-xs text-muted-foreground">
                {user.plan === "pro" ? "PRO" : "Free"} · קרדיטים: {user.credits_total - user.credits_used}/{user.credits_total}
                {user.marketing_consent && " · 📧 שיווק"}
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5">
                נרשם: {new Date(user.created_at).toLocaleDateString("he-IL")}
              </div>
            </div>
            <div className="flex items-center gap-1">
              {user.marketing_consent ? (
                <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full">שיווק ✓</span>
              ) : (
                <span className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full">ללא שיווק</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {users.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Users size={32} className="mx-auto mb-2 opacity-50" />
          <p>אין משתמשים רשומים עדיין.</p>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
