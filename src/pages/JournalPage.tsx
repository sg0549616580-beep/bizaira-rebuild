import { useState, useEffect, useMemo } from "react";
import { useI18n } from "@/lib/i18n";
import {
  CalendarClock, Plus, Check, Clock, AlertTriangle, Lightbulb,
  Target, MessageSquare, Briefcase, Trash2, ChevronLeft, ChevronRight,
  Flag, CheckCircle2, Circle, X,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { format, startOfWeek, endOfWeek, addDays, addWeeks, subWeeks, addMonths, subMonths, isSameDay, isWithinInterval, startOfMonth, endOfMonth, isBefore } from "date-fns";
import { he, enUS } from "date-fns/locale";

type EntryType = "task" | "meeting" | "reminder" | "goal" | "idea" | "note" | "plan";
type Priority = "high" | "medium" | "low";

interface JournalEntry {
  id: string;
  type: EntryType;
  title: string;
  description: string;
  date: string;
  time: string;
  priority: Priority;
  completed: boolean;
  createdAt: string;
}

const STORAGE_KEY = "bizaira_journal";

const ENTRY_TYPES: { id: EntryType; icon: typeof Check; labelHe: string; labelEn: string; color: string }[] = [
  { id: "task", icon: CheckCircle2, labelHe: "משימה", labelEn: "Task", color: "text-blue-500" },
  { id: "meeting", icon: CalendarClock, labelHe: "פגישה", labelEn: "Meeting", color: "text-violet-500" },
  { id: "reminder", icon: Clock, labelHe: "תזכורת", labelEn: "Reminder", color: "text-amber-500" },
  { id: "goal", icon: Target, labelHe: "מטרה", labelEn: "Goal", color: "text-emerald-500" },
  { id: "idea", icon: Lightbulb, labelHe: "רעיון", labelEn: "Idea", color: "text-yellow-500" },
  { id: "note", icon: MessageSquare, labelHe: "הערה", labelEn: "Note", color: "text-slate-500" },
  { id: "plan", icon: Briefcase, labelHe: "תוכנית עבודה", labelEn: "Work Plan", color: "text-pink-500" },
];

const PRIORITY_CONFIG: Record<Priority, { labelHe: string; labelEn: string; color: string; bg: string }> = {
  high: { labelHe: "דחוף", labelEn: "Urgent", color: "text-red-600", bg: "bg-red-100 dark:bg-red-900/30" },
  medium: { labelHe: "רגיל", labelEn: "Normal", color: "text-amber-600", bg: "bg-amber-100 dark:bg-amber-900/30" },
  low: { labelHe: "נמוך", labelEn: "Low", color: "text-emerald-600", bg: "bg-emerald-100 dark:bg-emerald-900/30" },
};

const JournalPage = () => {
  const { lang } = useI18n();
  const isHe = lang === "he";
  const locale = isHe ? he : enUS;

  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [view, setView] = useState<"day" | "week" | "month">("day");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAdd, setShowAdd] = useState(false);
  const [newEntry, setNewEntry] = useState<Partial<JournalEntry>>({
    type: "task",
    priority: "medium",
    title: "",
    description: "",
    date: format(new Date(), "yyyy-MM-dd"),
    time: "",
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setEntries(JSON.parse(stored));
    } catch {}
  }, []);

  const save = (updated: JournalEntry[]) => {
    setEntries(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const addEntry = () => {
    if (!newEntry.title?.trim()) return;
    const entry: JournalEntry = {
      id: Date.now().toString(),
      type: newEntry.type || "task",
      title: newEntry.title.trim(),
      description: newEntry.description?.trim() || "",
      date: newEntry.date || format(new Date(), "yyyy-MM-dd"),
      time: newEntry.time || "",
      priority: newEntry.priority || "medium",
      completed: false,
      createdAt: new Date().toISOString(),
    };
    save([entry, ...entries]);
    setNewEntry({ type: "task", priority: "medium", title: "", description: "", date: format(new Date(), "yyyy-MM-dd"), time: "" });
    setShowAdd(false);
  };

  const toggleComplete = (id: string) => {
    save(entries.map(e => e.id === id ? { ...e, completed: !e.completed } : e));
  };

  const deleteEntry = (id: string) => {
    save(entries.filter(e => e.id !== id));
  };

  const navigate = (dir: number) => {
    if (view === "day") setCurrentDate(prev => addDays(prev, dir));
    else if (view === "week") setCurrentDate(prev => dir > 0 ? addWeeks(prev, 1) : subWeeks(prev, 1));
    else setCurrentDate(prev => dir > 0 ? addMonths(prev, 1) : subMonths(prev, 1));
  };

  const filteredEntries = useMemo(() => {
    return entries.filter(e => {
      const d = new Date(e.date);
      if (view === "day") return isSameDay(d, currentDate);
      if (view === "week") return isWithinInterval(d, { start: startOfWeek(currentDate, { weekStartsOn: 0 }), end: endOfWeek(currentDate, { weekStartsOn: 0 }) });
      return isWithinInterval(d, { start: startOfMonth(currentDate), end: endOfMonth(currentDate) });
    });
  }, [entries, view, currentDate]);

  const urgentEntries = filteredEntries.filter(e => e.priority === "high" && !e.completed);
  const todayTasks = filteredEntries.filter(e => (e.type === "task" || e.type === "meeting" || e.type === "reminder") && !e.completed);
  const ideas = filteredEntries.filter(e => e.type === "idea" || e.type === "note");
  const goals = filteredEntries.filter(e => e.type === "goal" || e.type === "plan");
  const completedCount = filteredEntries.filter(e => e.completed).length;
  const pendingCount = filteredEntries.filter(e => !e.completed).length;

  const dateLabel = () => {
    if (view === "day") return format(currentDate, "EEEE, d MMMM yyyy", { locale });
    if (view === "week") {
      const s = startOfWeek(currentDate, { weekStartsOn: 0 });
      const e = endOfWeek(currentDate, { weekStartsOn: 0 });
      return `${format(s, "d MMM", { locale })} - ${format(e, "d MMM yyyy", { locale })}`;
    }
    return format(currentDate, "MMMM yyyy", { locale });
  };

  const getTypeConfig = (type: EntryType) => ENTRY_TYPES.find(t => t.id === type)!;

  const EntryCard = ({ entry }: { entry: JournalEntry }) => {
    const config = getTypeConfig(entry.type);
    const pConfig = PRIORITY_CONFIG[entry.priority];
    const Icon = config.icon;
    return (
      <div className={`glass-card rounded-xl p-3.5 transition-all duration-200 hover:shadow-md ${entry.completed ? "opacity-60" : ""}`}>
        <div className="flex items-start gap-3">
          <button onClick={() => toggleComplete(entry.id)} className="mt-0.5 shrink-0">
            {entry.completed
              ? <CheckCircle2 size={20} className="text-emerald-500" />
              : <Circle size={20} className="text-muted-foreground/40 hover:text-primary transition-colors" />
            }
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Icon size={14} className={config.color} />
              <span className={`text-[10px] font-semibold uppercase tracking-wider ${config.color}`}>
                {isHe ? config.labelHe : config.labelEn}
              </span>
              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${pConfig.bg} ${pConfig.color}`}>
                {isHe ? pConfig.labelHe : pConfig.labelEn}
              </span>
            </div>
            <p className={`text-sm font-semibold text-foreground ${entry.completed ? "line-through" : ""}`}>{entry.title}</p>
            {entry.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{entry.description}</p>}
            <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground">
              <span>{format(new Date(entry.date), "d MMM", { locale })}</span>
              {entry.time && <span>{entry.time}</span>}
            </div>
          </div>
          <button onClick={() => deleteEntry(entry.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 transition-all shrink-0">
            <Trash2 size={14} className="text-muted-foreground hover:text-destructive" />
          </button>
        </div>
      </div>
    );
  };

  const Section = ({ title, icon: SIcon, children, count }: { title: string; icon: typeof Check; children: React.ReactNode; count?: number }) => (
    <div className="space-y-2.5">
      <div className="flex items-center gap-2">
        <SIcon size={16} className="text-primary" />
        <h3 className="text-sm font-bold text-foreground">{title}</h3>
        {count !== undefined && count > 0 && (
          <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">{count}</span>
        )}
      </div>
      {children}
    </div>
  );

  return (
    <div className="px-4 pt-5 pb-28" dir={isHe ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-foreground">{isHe ? "יומן עסקי חכם" : "Smart Business Journal"}</h1>
          <p className="text-xs text-muted-foreground mt-0.5">{isHe ? "ניהול משימות, תכנון והתקדמות" : "Tasks, planning & progress"}</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="gradient-glow text-primary-foreground p-2.5 rounded-xl shadow-md hover:scale-105 transition-transform"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-2.5 mb-5">
        {[
          { label: isHe ? "ממתינים" : "Pending", value: pendingCount, icon: Clock, color: "text-amber-500" },
          { label: isHe ? "דחופים" : "Urgent", value: urgentEntries.length, icon: AlertTriangle, color: "text-red-500" },
          { label: isHe ? "הושלמו" : "Done", value: completedCount, icon: CheckCircle2, color: "text-emerald-500" },
        ].map(stat => (
          <div key={stat.label} className="glass-card rounded-xl p-3 text-center">
            <stat.icon size={18} className={`${stat.color} mx-auto mb-1`} />
            <p className="text-lg font-bold text-foreground">{stat.value}</p>
            <p className="text-[10px] text-muted-foreground font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* View Tabs + Date Nav */}
      <div className="space-y-3 mb-5">
        <Tabs value={view} onValueChange={(v) => setView(v as any)} className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="day" className="flex-1 text-xs">{isHe ? "יומי" : "Day"}</TabsTrigger>
            <TabsTrigger value="week" className="flex-1 text-xs">{isHe ? "שבועי" : "Week"}</TabsTrigger>
            <TabsTrigger value="month" className="flex-1 text-xs">{isHe ? "חודשי" : "Month"}</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-muted transition-colors">
            {isHe ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
          <p className="text-sm font-semibold text-foreground">{dateLabel()}</p>
          <button onClick={() => navigate(1)} className="p-2 rounded-lg hover:bg-muted transition-colors">
            {isHe ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>
      </div>

      {/* Content Sections */}
      <div className="space-y-5">
        {urgentEntries.length > 0 && (
          <Section title={isHe ? "דורש טיפול מיידי" : "Needs Immediate Attention"} icon={AlertTriangle} count={urgentEntries.length}>
            <div className="space-y-2">{urgentEntries.map(e => <EntryCard key={e.id} entry={e} />)}</div>
          </Section>
        )}

        {todayTasks.length > 0 && (
          <Section title={isHe ? "משימות ופגישות" : "Tasks & Meetings"} icon={CheckCircle2} count={todayTasks.length}>
            <div className="space-y-2">{todayTasks.map(e => <EntryCard key={e.id} entry={e} />)}</div>
          </Section>
        )}

        {goals.length > 0 && (
          <Section title={isHe ? "מטרות ותוכניות" : "Goals & Plans"} icon={Target} count={goals.length}>
            <div className="space-y-2">{goals.map(e => <EntryCard key={e.id} entry={e} />)}</div>
          </Section>
        )}

        {ideas.length > 0 && (
          <Section title={isHe ? "רעיונות והערות" : "Ideas & Notes"} icon={Lightbulb} count={ideas.length}>
            <div className="space-y-2">{ideas.map(e => <EntryCard key={e.id} entry={e} />)}</div>
          </Section>
        )}

        {completedCount > 0 && (
          <Section title={isHe ? "הושלמו" : "Completed"} icon={CheckCircle2}>
            <div className="space-y-2">{filteredEntries.filter(e => e.completed).map(e => <EntryCard key={e.id} entry={e} />)}</div>
          </Section>
        )}

        {filteredEntries.length === 0 && (
          <div className="text-center py-12">
            <CalendarClock size={40} className="text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">{isHe ? "אין רשומות לתקופה הזו" : "No entries for this period"}</p>
            <button onClick={() => setShowAdd(true)} className="mt-3 text-sm font-semibold text-primary hover:underline">
              {isHe ? "הוסף רשומה ראשונה" : "Add first entry"}
            </button>
          </div>
        )}
      </div>

      {/* Add Entry Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-end sm:items-center justify-center" onClick={() => setShowAdd(false)}>
          <div onClick={e => e.stopPropagation()} className="w-full max-w-lg max-h-[90vh] bg-card border border-border rounded-t-3xl sm:rounded-3xl p-5 space-y-4 overflow-y-auto animate-fade-in-up">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">{isHe ? "רשומה חדשה" : "New Entry"}</h2>
              <button onClick={() => setShowAdd(false)} className="p-1.5 rounded-lg hover:bg-muted transition-all">
                <X size={18} className="text-muted-foreground" />
              </button>
            </div>

            {/* Type selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">{isHe ? "סוג" : "Type"}</label>
              <div className="flex flex-wrap gap-1.5">
                {ENTRY_TYPES.map(t => {
                  const Icon = t.icon;
                  const selected = newEntry.type === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setNewEntry(prev => ({ ...prev, type: t.id }))}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all border ${
                        selected
                          ? "bg-primary/10 border-primary/30 text-primary"
                          : "bg-muted/50 border-transparent text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      <Icon size={13} />
                      {isHe ? t.labelHe : t.labelEn}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">{isHe ? "כותרת" : "Title"}</label>
              <input
                value={newEntry.title || ""}
                onChange={e => setNewEntry(prev => ({ ...prev, title: e.target.value }))}
                placeholder={isHe ? "מה צריך לעשות?" : "What needs to be done?"}
                className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">{isHe ? "פירוט" : "Details"}</label>
              <textarea
                value={newEntry.description || ""}
                onChange={e => setNewEntry(prev => ({ ...prev, description: e.target.value }))}
                placeholder={isHe ? "פירוט נוסף (אופציונלי)..." : "Additional details (optional)..."}
                rows={3}
                className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 resize-none"
              />
            </div>

            {/* Date + Time */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">{isHe ? "תאריך" : "Date"}</label>
                <input
                  type="date"
                  value={newEntry.date || ""}
                  onChange={e => setNewEntry(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full bg-background/50 border border-border/50 rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">{isHe ? "שעה" : "Time"}</label>
                <input
                  type="time"
                  value={newEntry.time || ""}
                  onChange={e => setNewEntry(prev => ({ ...prev, time: e.target.value }))}
                  className="w-full bg-background/50 border border-border/50 rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
                />
              </div>
            </div>

            {/* Priority */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">{isHe ? "עדיפות" : "Priority"}</label>
              <div className="flex gap-2">
                {(Object.keys(PRIORITY_CONFIG) as Priority[]).map(p => {
                  const c = PRIORITY_CONFIG[p];
                  const selected = newEntry.priority === p;
                  return (
                    <button
                      key={p}
                      onClick={() => setNewEntry(prev => ({ ...prev, priority: p }))}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${
                        selected
                          ? `${c.bg} ${c.color} border-current`
                          : "bg-muted/50 border-transparent text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      <Flag size={12} />
                      {isHe ? c.labelHe : c.labelEn}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={addEntry}
              disabled={!newEntry.title?.trim()}
              className="w-full gradient-glow text-primary-foreground py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100"
            >
              <Plus size={16} />
              {isHe ? "הוסף ליומן" : "Add to Journal"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JournalPage;
