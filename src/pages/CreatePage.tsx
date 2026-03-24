import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SparkleIcon from "@/components/SparkleIcon";
import { useI18n } from "@/lib/i18n";
import {
  Camera, MessageSquare, BarChart3, CalendarClock, DollarSign,
  StickyNote, Plus, Trash2, Lightbulb, X,
} from "lucide-react";

interface Note {
  id: string;
  text: string;
  date: string;
  color: string;
}

const NOTE_COLORS = [
  "bg-yellow-100/80 dark:bg-yellow-900/30 border-yellow-300/50",
  "bg-pink-100/80 dark:bg-pink-900/30 border-pink-300/50",
  "bg-blue-100/80 dark:bg-blue-900/30 border-blue-300/50",
  "bg-green-100/80 dark:bg-green-900/30 border-green-300/50",
  "bg-purple-100/80 dark:bg-purple-900/30 border-purple-300/50",
  "bg-orange-100/80 dark:bg-orange-900/30 border-orange-300/50",
];

const CreatePage = () => {
  const navigate = useNavigate();
  const { t, lang } = useI18n();
  const isHe = lang === "he";

  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [showNotes, setShowNotes] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("bizaira_notes");
      if (stored) setNotes(JSON.parse(stored));
    } catch { /* ignore */ }
  }, []);

  const saveNotes = (updated: Note[]) => {
    setNotes(updated);
    localStorage.setItem("bizaira_notes", JSON.stringify(updated));
  };

  const addNote = () => {
    if (!newNote.trim()) return;
    const note: Note = {
      id: Date.now().toString(),
      text: newNote.trim(),
      date: new Date().toLocaleDateString(isHe ? "he-IL" : "en-US"),
      color: NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)],
    };
    saveNotes([note, ...notes]);
    setNewNote("");
  };

  const deleteNote = (id: string) => {
    saveNotes(notes.filter(n => n.id !== id));
  };

  const suggestions = isHe
    ? ["💡 רעיון למוצר חדש", "📋 משימות לשבוע", "🎯 מטרות החודש", "💬 משוב מלקוחה", "📸 רעיון לפוסט"]
    : ["💡 New product idea", "📋 Weekly tasks", "🎯 Monthly goals", "💬 Client feedback", "📸 Post idea"];

  const toolTypes = [
    { id: "product", icon: Camera, titleKey: "tool.photos.title", descKey: "tool.photos.desc", route: "/create/product-photos" },
    { id: "message", icon: MessageSquare, titleKey: "tool.messages.title", descKey: "tool.messages.desc", route: "/create/messages" },
    { id: "analytics", icon: BarChart3, titleKey: "tool.analytics.title", descKey: "tool.analytics.desc", route: "/create/analytics" },
    { id: "time", icon: CalendarClock, titleKey: "tool.time.title", descKey: "tool.time.desc", route: "/create/time" },
    { id: "pricing", icon: DollarSign, titleKey: "tool.pricing.title", descKey: "tool.pricing.desc", route: "/create/pricing" },
    { id: "notes", icon: StickyNote, titleKey: "tool.notes.title", descKey: "tool.notes.desc", route: "" },
  ];

  return (
    <div className="px-4 pt-6 pb-24">
      <div className="flex items-center gap-2 mb-6">
        <SparkleIcon size={20} />
        <h1 className="text-xl font-bold text-foreground">{t("create.title")}</h1>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {toolTypes.map((tool, i) => {
          const IconComp = tool.icon;
          return (
            <button
              key={tool.id}
              onClick={() => tool.route ? navigate(tool.route) : setShowNotes(true)}
              className="glass-card rounded-2xl p-4 text-start hover:scale-[1.03] hover:glow-shadow transition-all duration-300 group animate-fade-in-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center mb-2">
                <IconComp size={20} className="text-secondary-foreground" />
              </div>
              <div className="font-semibold text-sm text-foreground group-hover:gradient-glow-text transition-all">
                {t(tool.titleKey)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {t(tool.descKey)}
              </div>
            </button>
          );
        })}
      </div>

      {/* Notes Panel */}
      {showNotes && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-end sm:items-center justify-center" onClick={() => setShowNotes(false)}>
          <div onClick={e => e.stopPropagation()} className="w-full max-w-lg max-h-[85vh] bg-card border border-border rounded-t-3xl sm:rounded-3xl p-5 space-y-4 overflow-y-auto animate-fade-in-up">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <StickyNote size={18} className="text-primary" />
                {isHe ? "היומן שלי" : "My Journal"}
              </h2>
              <button onClick={() => setShowNotes(false)} className="p-1.5 rounded-lg hover:bg-muted transition-all">
                <X size={18} className="text-muted-foreground" />
              </button>
            </div>

            {/* Add note */}
            <div className="flex gap-2">
              <input
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addNote()}
                placeholder={isHe ? "כתבי פתק, רעיון או תזכורת..." : "Write a note, idea or reminder..."}
                className="flex-1 bg-background/50 border border-border/50 rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
              />
              <button onClick={addNote} className="gradient-glow text-primary-foreground p-2.5 rounded-xl hover:scale-105 transition-all">
                <Plus size={18} />
              </button>
            </div>

            {/* Suggestions */}
            {notes.length === 0 && (
              <div className="glass-card rounded-xl p-3 space-y-2">
                <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Lightbulb size={12} className="text-primary" />
                  {isHe ? "רעיונות למה לרשום:" : "Ideas for what to write:"}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {suggestions.map(s => (
                    <button key={s} onClick={() => setNewNote(s)} className="px-2.5 py-1.5 rounded-lg bg-muted text-[11px] text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Notes list */}
            <div className="space-y-2">
              {notes.map(note => (
                <div key={note.id} className={`rounded-xl p-3 border ${note.color} transition-all`}>
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm text-foreground whitespace-pre-wrap flex-1">{note.text}</p>
                    <button onClick={() => deleteNote(note.id)} className="p-1 rounded-lg hover:bg-background/50 transition-all shrink-0">
                      <Trash2 size={13} className="text-muted-foreground" />
                    </button>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1.5">{note.date}</p>
                </div>
              ))}
            </div>

            {notes.length > 0 && (
              <p className="text-center text-[10px] text-muted-foreground">
                {isHe ? `${notes.length} פתקים שמורים` : `${notes.length} saved notes`}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePage;
