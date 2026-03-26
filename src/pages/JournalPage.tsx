import { useState, useEffect, useMemo, useCallback } from "react";
import { useI18n } from "@/lib/i18n";
import {
  Plus, Check, Clock, Star, StarOff, ChevronLeft, ChevronRight,
  Trash2, X, CalendarDays, Bell, BellOff, CalendarClock, Edit3,
  SkipForward, CheckCircle2, Circle, AlertCircle,
} from "lucide-react";
import { format, addDays, isSameDay, startOfWeek, parseISO, isToday, isPast } from "date-fns";
import { he, enUS } from "date-fns/locale";

const STORAGE_KEY = "bizaira_tasks_v2";

type TaskType = "task" | "meeting";
type TaskStatus = "pending" | "done" | "postponed";

interface Task {
  id: string;
  title: string;
  type: TaskType;
  date: string;
  time: string;
  important: boolean;
  status: TaskStatus;
  reminder: boolean;
  createdAt: string;
  reminderFired?: boolean;
}

const todayStr = () => format(new Date(), "yyyy-MM-dd");

const loadTasks = (): Task[] => {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    return s ? JSON.parse(s) : [];
  } catch { return []; }
};

const saveTasks = (tasks: Task[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

type View = "day" | "week";
type AddModalState = { open: boolean; defaultDate: string };

const JournalPage = () => {
  const { lang } = useI18n();
  const isHe = lang === "he";
  const locale = isHe ? he : enUS;

  const [tasks, setTasks] = useState<Task[]>(loadTasks);
  const [view, setView] = useState<View>("day");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [addModal, setAddModal] = useState<AddModalState>({ open: false, defaultDate: todayStr() });
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [notifGranted, setNotifGranted] = useState(
    typeof Notification !== "undefined" ? Notification.permission === "granted" : false
  );

  // Form state
  const emptyForm = useCallback((date: string): Partial<Task> => ({
    title: "", type: "task", date, time: "", important: false, reminder: false,
  }), []);
  const [form, setForm] = useState<Partial<Task>>(emptyForm(todayStr()));

  const updateTasks = (updated: Task[]) => {
    setTasks(updated);
    saveTasks(updated);
  };

  // Reminder polling
  useEffect(() => {
    if (!notifGranted) return;
    const interval = setInterval(() => {
      const now = new Date();
      const nowStr = format(now, "HH:mm");
      const nowDate = format(now, "yyyy-MM-dd");
      const updated = tasks.map(t => {
        if (t.reminder && !t.reminderFired && t.status === "pending" && t.time && t.date === nowDate && t.time === nowStr) {
          new Notification(isHe ? `⏰ תזכורת: ${t.title}` : `⏰ Reminder: ${t.title}`, {
            body: isHe ? `שעה: ${t.time}` : `Time: ${t.time}`,
            icon: "/favicon.ico",
          });
          return { ...t, reminderFired: true };
        }
        return t;
      });
      if (updated.some((t, i) => t.reminderFired !== tasks[i]?.reminderFired)) {
        updateTasks(updated);
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [tasks, notifGranted, isHe]);

  const requestNotifications = async () => {
    if (typeof Notification === "undefined") return;
    const result = await Notification.requestPermission();
    setNotifGranted(result === "granted");
  };

  const openAdd = (date?: string) => {
    const d = date || format(currentDate, "yyyy-MM-dd");
    setEditingTask(null);
    setForm(emptyForm(d));
    setAddModal({ open: true, defaultDate: d });
  };

  const openEdit = (task: Task) => {
    setEditingTask(task);
    setForm({ ...task });
    setAddModal({ open: true, defaultDate: task.date });
  };

  const submitForm = () => {
    if (!form.title?.trim()) return;
    if (editingTask) {
      updateTasks(tasks.map(t => t.id === editingTask.id ? { ...t, ...form } as Task : t));
    } else {
      const newTask: Task = {
        id: Date.now().toString(),
        title: form.title!.trim(),
        type: form.type || "task",
        date: form.date || todayStr(),
        time: form.time || "",
        important: form.important || false,
        status: "pending",
        reminder: form.reminder || false,
        createdAt: new Date().toISOString(),
      };
      updateTasks([...tasks, newTask]);
    }
    setAddModal({ open: false, defaultDate: todayStr() });
    setEditingTask(null);
    setForm(emptyForm(todayStr()));
  };

  const complete = (id: string) => {
    updateTasks(tasks.map(t => t.id === id ? { ...t, status: t.status === "done" ? "pending" : "done" } : t));
  };

  const postpone = (id: string) => {
    updateTasks(tasks.map(t => {
      if (t.id !== id) return t;
      const next = format(addDays(parseISO(t.date), 1), "yyyy-MM-dd");
      return { ...t, date: next, status: "pending", reminderFired: false };
    }));
  };

  const toggleImportant = (id: string) => {
    updateTasks(tasks.map(t => t.id === id ? { ...t, important: !t.important } : t));
  };

  const deleteTask = (id: string) => {
    updateTasks(tasks.filter(t => t.id !== id));
  };

  // Daily tasks
  const dayTasks = useMemo(() => {
    const dayStr = format(currentDate, "yyyy-MM-dd");
    return tasks.filter(t => t.date === dayStr);
  }, [tasks, currentDate]);

  const importantPending = useMemo(() => dayTasks.filter(t => t.important && t.status !== "done"), [dayTasks]);
  const meetingsSorted = useMemo(() =>
    dayTasks.filter(t => t.type === "meeting" && t.status !== "done").sort((a, b) => a.time.localeCompare(b.time)),
    [dayTasks]);
  const regularTasks = useMemo(() =>
    dayTasks.filter(t => t.type === "task" && !t.important && t.status !== "done"),
    [dayTasks]);
  const doneTasks = useMemo(() => dayTasks.filter(t => t.status === "done"), [dayTasks]);

  // Weekly view
  const weekStart = useMemo(() => startOfWeek(currentDate, { weekStartsOn: 0 }), [currentDate]);
  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);

  const weekTasksForDay = useCallback((d: Date) => {
    const s = format(d, "yyyy-MM-dd");
    return tasks.filter(t => t.date === s);
  }, [tasks]);

  const prevDay = () => setCurrentDate(d => addDays(d, -1));
  const nextDay = () => setCurrentDate(d => addDays(d, 1));
  const goToday = () => setCurrentDate(new Date());

  const isCurrentDay = isToday(currentDate);
  const dayLabel = format(currentDate, "EEEE, d MMMM", { locale });

  // Task card
  const TaskCard = ({ task }: { task: Task }) => {
    const done = task.status === "done";
    const overdue = !done && task.time && isPast(new Date(`${task.date}T${task.time}`));
    return (
      <div className={`
        glass-card rounded-2xl p-3.5 transition-all duration-200
        ${done ? "opacity-50" : ""}
        ${task.important && !done ? "border border-amber-400/30 bg-amber-50/10" : ""}
        ${task.type === "meeting" ? "border-s-4 border-violet-400" : ""}
      `}>
        <div className="flex items-start gap-3">
          {/* Complete toggle */}
          <button
            onClick={() => complete(task.id)}
            className="shrink-0 mt-0.5 transition-transform hover:scale-110"
          >
            {done
              ? <CheckCircle2 size={22} className="text-emerald-500" />
              : <Circle size={22} className="text-muted-foreground/40 hover:text-primary transition-colors" />
            }
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              {task.type === "meeting" && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-violet-500 bg-violet-100/50 dark:bg-violet-900/30 px-1.5 py-0.5 rounded-full">
                  {isHe ? "פגישה" : "Meeting"}
                </span>
              )}
              {task.important && !done && (
                <span className="text-[10px] font-bold text-amber-600 bg-amber-100/60 dark:bg-amber-900/30 px-1.5 py-0.5 rounded-full">
                  {isHe ? "חשוב" : "Important"}
                </span>
              )}
              {overdue && (
                <span className="text-[10px] font-bold text-red-500 bg-red-100/60 dark:bg-red-900/30 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                  <AlertCircle size={9} /> {isHe ? "באיחור" : "Late"}
                </span>
              )}
            </div>
            <p className={`text-sm font-semibold leading-snug ${done ? "line-through text-muted-foreground" : "text-foreground"}`}>
              {task.title}
            </p>
            {task.time && (
              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                <Clock size={11} />
                <span dir="ltr">{task.time}</span>
                {task.reminder && <Bell size={10} className="text-primary/60 ms-1" />}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 shrink-0">
            {!done && (
              <>
                <button
                  onClick={() => toggleImportant(task.id)}
                  className="p-1.5 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all"
                  title={isHe ? "סמן כחשוב" : "Mark important"}
                >
                  {task.important
                    ? <Star size={14} className="text-amber-500 fill-amber-500" />
                    : <StarOff size={14} className="text-muted-foreground/50" />
                  }
                </button>
                <button
                  onClick={() => postpone(task.id)}
                  className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                  title={isHe ? "דחה למחר" : "Postpone to tomorrow"}
                >
                  <SkipForward size={14} className="text-blue-500/70" />
                </button>
                <button
                  onClick={() => openEdit(task)}
                  className="p-1.5 rounded-lg hover:bg-muted transition-all"
                >
                  <Edit3 size={13} className="text-muted-foreground/60" />
                </button>
              </>
            )}
            <button
              onClick={() => deleteTask(task.id)}
              className="p-1.5 rounded-lg hover:bg-destructive/10 transition-all"
            >
              <Trash2 size={13} className="text-muted-foreground/50 hover:text-destructive transition-colors" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const SectionHeader = ({ title, count, accent }: { title: string; count?: number; accent?: string }) => (
    <div className={`flex items-center gap-2 mb-2.5 ${accent || ""}`}>
      <h3 className="text-sm font-bold text-foreground">{title}</h3>
      {count !== undefined && count > 0 && (
        <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">{count}</span>
      )}
    </div>
  );

  return (
    <div className="pb-28" dir={isHe ? "rtl" : "ltr"}>
      {/* Top Header */}
      <div className="sticky top-0 z-20 bg-background/90 backdrop-blur-md border-b border-border/50 px-4 pt-5 pb-3">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-lg font-bold text-foreground">
              {isHe ? "ניהול משימות" : "Task Manager"}
            </h1>
            <p className="text-xs text-muted-foreground">
              {isHe ? "מה יש לי לעשות היום" : "What do I need to do today"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {!notifGranted && (
              <button
                onClick={requestNotifications}
                className="p-2 rounded-xl bg-muted/60 hover:bg-muted transition-all"
                title={isHe ? "הפעל תזכורות" : "Enable reminders"}
              >
                <BellOff size={16} className="text-muted-foreground" />
              </button>
            )}
            {notifGranted && (
              <div className="p-2 rounded-xl bg-primary/10" title={isHe ? "תזכורות פעילות" : "Reminders active"}>
                <Bell size={16} className="text-primary" />
              </div>
            )}
            <button
              onClick={() => openAdd()}
              className="gradient-glow text-primary-foreground px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5 shadow-md hover:scale-105 transition-transform"
            >
              <Plus size={16} />
              {isHe ? "הוסף משימה" : "Add Task"}
            </button>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex gap-2">
          {(["day", "week"] as View[]).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                view === v
                  ? "gradient-glow text-primary-foreground shadow-md"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted"
              }`}
            >
              {v === "day" ? <CalendarDays size={13} /> : <CalendarClock size={13} />}
              {v === "day" ? (isHe ? "יומי" : "Daily") : (isHe ? "שבועי" : "Weekly")}
            </button>
          ))}
        </div>
      </div>

      {/* DAILY VIEW */}
      {view === "day" && (
        <div className="px-4 pt-4 space-y-4">
          {/* Date navigator */}
          <div className="flex items-center justify-between">
            <button onClick={prevDay} className="p-2 rounded-xl hover:bg-muted transition-all">
              {isHe ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
            <div className="text-center">
              <p className="text-sm font-bold text-foreground capitalize">{dayLabel}</p>
              {isCurrentDay && (
                <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  {isHe ? "היום" : "Today"}
                </span>
              )}
            </div>
            <button onClick={nextDay} className="p-2 rounded-xl hover:bg-muted transition-all">
              {isHe ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </button>
          </div>

          {!isCurrentDay && (
            <button
              onClick={goToday}
              className="w-full text-xs text-primary font-semibold bg-primary/5 hover:bg-primary/10 py-2 rounded-xl transition-all"
            >
              {isHe ? "← חזור להיום" : "← Back to Today"}
            </button>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: isHe ? "ממתינות" : "Pending", value: dayTasks.filter(t => t.status !== "done").length, color: "text-blue-500" },
              { label: isHe ? "חשובות" : "Important", value: importantPending.length, color: "text-amber-500" },
              { label: isHe ? "הושלמו" : "Done", value: doneTasks.length, color: "text-emerald-500" },
            ].map(s => (
              <div key={s.label} className="glass-card rounded-2xl p-3 text-center">
                <p className={`text-xl font-extrabold ${s.color}`}>{s.value}</p>
                <p className="text-[10px] font-medium text-muted-foreground mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Important tasks */}
          {importantPending.length > 0 && (
            <div>
              <SectionHeader title={isHe ? "⭐ משימות חשובות" : "⭐ Important Tasks"} count={importantPending.length} />
              <div className="space-y-2">
                {importantPending.map(t => <TaskCard key={t.id} task={t} />)}
              </div>
            </div>
          )}

          {/* Meetings sorted by time */}
          {meetingsSorted.length > 0 && (
            <div>
              <SectionHeader title={isHe ? "🗓 פגישות" : "🗓 Meetings"} count={meetingsSorted.length} />
              <div className="space-y-2">
                {meetingsSorted.map(t => <TaskCard key={t.id} task={t} />)}
              </div>
            </div>
          )}

          {/* Regular tasks */}
          {regularTasks.length > 0 && (
            <div>
              <SectionHeader title={isHe ? "📋 משימות" : "📋 Tasks"} count={regularTasks.length} />
              <div className="space-y-2">
                {regularTasks.map(t => <TaskCard key={t.id} task={t} />)}
              </div>
            </div>
          )}

          {/* Completed */}
          {doneTasks.length > 0 && (
            <div>
              <SectionHeader title={isHe ? "✅ הושלמו" : "✅ Completed"} />
              <div className="space-y-2">
                {doneTasks.map(t => <TaskCard key={t.id} task={t} />)}
              </div>
            </div>
          )}

          {/* Empty */}
          {dayTasks.length === 0 && (
            <div className="text-center py-14">
              <div className="w-16 h-16 rounded-3xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <Check size={28} className="text-muted-foreground/30" />
              </div>
              <p className="text-sm font-semibold text-muted-foreground">
                {isHe ? "אין משימות ליום זה" : "No tasks for this day"}
              </p>
              <button
                onClick={() => openAdd(format(currentDate, "yyyy-MM-dd"))}
                className="mt-3 text-sm font-bold text-primary hover:underline"
              >
                {isHe ? "+ הוסף משימה ראשונה" : "+ Add first task"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* WEEKLY VIEW */}
      {view === "week" && (
        <div className="px-4 pt-4 space-y-4">
          {/* Week Navigator */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentDate(d => addDays(d, -7))}
              className="p-2 rounded-xl hover:bg-muted transition-all"
            >
              {isHe ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
            <p className="text-sm font-bold text-foreground">
              {format(weekStart, "d MMM", { locale })} — {format(addDays(weekStart, 6), "d MMM yyyy", { locale })}
            </p>
            <button
              onClick={() => setCurrentDate(d => addDays(d, 7))}
              className="p-2 rounded-xl hover:bg-muted transition-all"
            >
              {isHe ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </button>
          </div>

          {/* Back to today */}
          {!weekDays.some(d => isToday(d)) && (
            <button
              onClick={goToday}
              className="w-full text-xs text-primary font-semibold bg-primary/5 hover:bg-primary/10 py-2 rounded-xl transition-all"
            >
              {isHe ? "← חזור לשבוע הנוכחי" : "← Back to This Week"}
            </button>
          )}

          {/* Day columns */}
          <div className="space-y-3">
            {weekDays.map(day => {
              const dayTasks = weekTasksForDay(day);
              const pending = dayTasks.filter(t => t.status !== "done");
              const done = dayTasks.filter(t => t.status === "done").length;
              const isCurrentDay = isToday(day);
              const dayName = format(day, "EEEE", { locale });
              const dayNum = format(day, "d MMM", { locale });

              return (
                <div
                  key={day.toISOString()}
                  className={`glass-card rounded-2xl p-4 transition-all ${
                    isCurrentDay ? "border border-primary/30 shadow-md" : ""
                  }`}
                >
                  {/* Day header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-extrabold ${
                        isCurrentDay ? "gradient-glow text-primary-foreground" : "bg-muted text-foreground"
                      }`}>
                        {format(day, "d")}
                      </div>
                      <div>
                        <p className={`text-sm font-bold capitalize ${isCurrentDay ? "text-primary" : "text-foreground"}`}>
                          {dayName}
                        </p>
                        <p className="text-[10px] text-muted-foreground">{dayNum}</p>
                      </div>
                      {isCurrentDay && (
                        <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                          {isHe ? "היום" : "Today"}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {done > 0 && (
                        <span className="text-[10px] text-emerald-600 bg-emerald-100/60 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full font-semibold">
                          {done} {isHe ? "✓" : "✓"}
                        </span>
                      )}
                      <button
                        onClick={() => openAdd(format(day, "yyyy-MM-dd"))}
                        className="p-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 transition-all"
                      >
                        <Plus size={14} className="text-primary" />
                      </button>
                    </div>
                  </div>

                  {/* Tasks for this day */}
                  {pending.length > 0 ? (
                    <div className="space-y-1.5">
                      {pending.map(t => (
                        <div
                          key={t.id}
                          className={`flex items-center gap-2 px-2 py-1.5 rounded-xl cursor-pointer hover:bg-muted/50 transition-all group ${
                            t.important ? "bg-amber-50/30 dark:bg-amber-900/10" : ""
                          }`}
                          onClick={() => { setCurrentDate(day); setView("day"); }}
                        >
                          <button
                            onClick={e => { e.stopPropagation(); complete(t.id); }}
                            className="shrink-0"
                          >
                            <Circle size={15} className="text-muted-foreground/40 hover:text-primary transition-colors" />
                          </button>
                          {t.type === "meeting" && (
                            <div className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
                          )}
                          {t.important && (
                            <Star size={10} className="text-amber-500 fill-amber-500 shrink-0" />
                          )}
                          <span className="text-xs text-foreground font-medium truncate flex-1">{t.title}</span>
                          {t.time && (
                            <span className="text-[10px] text-muted-foreground shrink-0" dir="ltr">{t.time}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground/50 text-center py-1">
                      {done > 0
                        ? (isHe ? "כל המשימות הושלמו 🎉" : "All tasks done 🎉")
                        : (isHe ? "אין משימות" : "No tasks")}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {addModal.open && (
        <div
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-end sm:items-center justify-center"
          onClick={() => setAddModal({ open: false, defaultDate: todayStr() })}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="w-full max-w-lg bg-card border border-border rounded-t-3xl sm:rounded-3xl p-5 space-y-4 max-h-[90vh] overflow-y-auto shadow-xl"
            dir={isHe ? "rtl" : "ltr"}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-foreground">
                {editingTask
                  ? (isHe ? "ערוך משימה" : "Edit Task")
                  : (isHe ? "משימה חדשה" : "New Task")}
              </h2>
              <button
                onClick={() => setAddModal({ open: false, defaultDate: todayStr() })}
                className="p-1.5 rounded-lg hover:bg-muted transition-all"
              >
                <X size={18} className="text-muted-foreground" />
              </button>
            </div>

            {/* Type */}
            <div className="flex gap-2">
              {([
                { id: "task", labelHe: "📋 משימה", labelEn: "📋 Task" },
                { id: "meeting", labelHe: "🗓 פגישה", labelEn: "🗓 Meeting" },
              ] as const).map(({ id, labelHe, labelEn }) => (
                <button
                  key={id}
                  onClick={() => setForm(f => ({ ...f, type: id }))}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
                    form.type === id
                      ? "gradient-glow text-primary-foreground border-transparent shadow-md"
                      : "bg-muted/60 text-muted-foreground border-transparent hover:bg-muted"
                  }`}
                >
                  {isHe ? labelHe : labelEn}
                </button>
              ))}
            </div>

            {/* Title */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
                {isHe ? "כותרת" : "Title"} *
              </label>
              <input
                autoFocus
                value={form.title || ""}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                onKeyDown={e => e.key === "Enter" && submitForm()}
                placeholder={isHe ? "מה צריך לעשות?" : "What needs to be done?"}
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 transition-all"
              />
            </div>

            {/* Date + Time */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
                  {isHe ? "תאריך" : "Date"}
                </label>
                <input
                  type="date"
                  value={form.date || ""}
                  onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
                  {isHe ? "שעה" : "Time"}
                </label>
                <input
                  type="time"
                  value={form.time || ""}
                  onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
                />
              </div>
            </div>

            {/* Flags */}
            <div className="flex gap-3">
              <button
                onClick={() => setForm(f => ({ ...f, important: !f.important }))}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold flex-1 transition-all border ${
                  form.important
                    ? "bg-amber-100/80 dark:bg-amber-900/30 border-amber-400/30 text-amber-700 dark:text-amber-400"
                    : "bg-muted/60 border-transparent text-muted-foreground hover:bg-muted"
                }`}
              >
                {form.important ? <Star size={15} className="fill-amber-500 text-amber-500" /> : <StarOff size={15} />}
                {isHe ? "חשוב" : "Important"}
              </button>

              <button
                onClick={() => {
                  if (!notifGranted) { requestNotifications(); return; }
                  setForm(f => ({ ...f, reminder: !f.reminder }));
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold flex-1 transition-all border ${
                  form.reminder
                    ? "bg-primary/10 border-primary/20 text-primary"
                    : "bg-muted/60 border-transparent text-muted-foreground hover:bg-muted"
                }`}
              >
                {form.reminder ? <Bell size={15} /> : <BellOff size={15} />}
                {isHe ? "תזכורת" : "Remind"}
              </button>
            </div>

            {form.reminder && !form.time && (
              <p className="text-xs text-amber-600 bg-amber-100/60 dark:bg-amber-900/20 px-3 py-2 rounded-xl">
                {isHe ? "⚠️ הוסף שעה כדי לקבל תזכורת" : "⚠️ Add a time to receive a reminder"}
              </p>
            )}

            {/* Submit */}
            <button
              onClick={submitForm}
              disabled={!form.title?.trim()}
              className="w-full gradient-glow text-primary-foreground py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-md"
            >
              <Plus size={16} />
              {editingTask
                ? (isHe ? "שמור שינויים" : "Save Changes")
                : (isHe ? "הוסף משימה" : "Add Task")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JournalPage;
