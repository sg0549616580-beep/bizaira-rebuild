import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Trash2, Image as ImageIcon, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MediaItem {
  id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number | null;
  created_at: string;
}

const AdminMediaPage = () => {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const fetchMedia = async () => {
    const { data } = await supabase
      .from("media_library")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setMedia(data as MediaItem[]);
    setLoading(false);
  };

  useEffect(() => { fetchMedia(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    
    const ext = file.name.split(".").pop();
    const path = `uploads/${Date.now()}.${ext}`;
    
    const { error: uploadError } = await supabase.storage
      .from("media")
      .upload(path, file);
    
    if (uploadError) {
      toast({ title: "שגיאה בהעלאה", description: uploadError.message, variant: "destructive" });
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("media").getPublicUrl(path);

    await supabase.from("media_library").insert({
      file_name: file.name,
      file_url: urlData.publicUrl,
      file_type: file.type.startsWith("image") ? "image" : "file",
      file_size: file.size,
    });

    toast({ title: "הקובץ הועלה בהצלחה" });
    setUploading(false);
    fetchMedia();
  };

  const handleDelete = async (item: MediaItem) => {
    if (!confirm(`למחוק את ${item.file_name}?`)) return;
    await supabase.from("media_library").delete().eq("id", item.id);
    toast({ title: "הקובץ נמחק" });
    fetchMedia();
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({ title: "הקישור הועתק" });
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" /></div>;

  return (
    <div dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">ספריית מדיה</h1>
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="gradient-glow text-primary-foreground px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 disabled:opacity-50"
        >
          <Upload size={16} /> {uploading ? "מעלה..." : "העלה קובץ"}
        </button>
        <input ref={fileRef} type="file" className="hidden" accept="image/*,video/*,.pdf,.doc,.docx" onChange={handleUpload} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {media.map((item) => (
          <div key={item.id} className="glass-card rounded-xl overflow-hidden group">
            <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
              {item.file_type === "image" ? (
                <img src={item.file_url} alt={item.file_name} className="w-full h-full object-cover" />
              ) : (
                <ImageIcon size={32} className="text-muted-foreground" />
              )}
            </div>
            <div className="p-3">
              <p className="text-xs font-medium truncate">{item.file_name}</p>
              {item.file_size && (
                <p className="text-[10px] text-muted-foreground">{(item.file_size / 1024).toFixed(0)} KB</p>
              )}
              <div className="flex gap-1 mt-2">
                <button onClick={() => copyUrl(item.file_url)} className="p-1.5 hover:bg-muted rounded-lg" title="העתק קישור">
                  <Copy size={14} className="text-primary" />
                </button>
                <button onClick={() => handleDelete(item)} className="p-1.5 hover:bg-destructive/10 rounded-lg" title="מחק">
                  <Trash2 size={14} className="text-destructive" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {media.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <ImageIcon size={40} className="mx-auto mb-3 opacity-50" />
          <p>אין קבצים בספריה. לחץ "העלה קובץ" כדי להתחיל.</p>
        </div>
      )}
    </div>
  );
};

export default AdminMediaPage;
