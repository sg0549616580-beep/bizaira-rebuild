import { useState, useEffect, useCallback } from "react";

interface HistoryEntry {
  date: string;
  data: Record<string, number | string>;
}

interface SmartMemoryResult {
  history: HistoryEntry[];
  saveEntry: (data: Record<string, number | string>) => void;
  getProgressMessages: (currentData: Record<string, number>, lang: "he" | "en") => string[];
  lastEntry: HistoryEntry | null;
}

export function useSmartMemory(featureKey: string): SmartMemoryResult {
  const storageKey = `bizaira_memory_${featureKey}`;
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) setHistory(JSON.parse(stored));
    } catch { /* ignore */ }
  }, [storageKey]);

  const saveEntry = useCallback((data: Record<string, number | string>) => {
    const entry: HistoryEntry = { date: new Date().toISOString(), data };
    setHistory(prev => {
      const updated = [...prev, entry].slice(-20); // keep last 20
      localStorage.setItem(storageKey, JSON.stringify(updated));
      return updated;
    });
  }, [storageKey]);

  const lastEntry = history.length > 0 ? history[history.length - 1] : null;

  const getProgressMessages = useCallback((currentData: Record<string, number>, lang: "he" | "en"): string[] => {
    if (history.length === 0) return [];
    const prev = history[history.length - 1];
    const messages: string[] = [];
    const isHe = lang === "he";

    for (const key of Object.keys(currentData)) {
      const current = currentData[key];
      const previous = Number(prev.data[key]) || 0;
      if (previous === 0 || current === 0) continue;

      const diff = ((current - previous) / previous) * 100;

      if (key === "revenue" || key === "profit" || key === "hourlyValue") {
        if (diff > 5) {
          messages.push(isHe ? `🎉 וואו, השתפרת! עלייה של ${Math.round(diff)}% לעומת הפעם הקודמת` : `🎉 Wow, you improved! ${Math.round(diff)}% increase vs last time`);
        } else if (diff < -5) {
          messages.push(isHe ? `📉 ירידה קלה של ${Math.round(Math.abs(diff))}% — אל דאגה, זה חלק מהתהליך` : `📉 Slight dip of ${Math.round(Math.abs(diff))}% — don't worry, it's part of the process`);
        } else {
          messages.push(isHe ? `✨ יציבות מצוינת! הנתונים דומים לפעם הקודמת` : `✨ Great stability! Numbers are similar to last time`);
        }
      }

      if (key === "hours" || key === "burnout") {
        if (diff < -5) {
          messages.push(isHe ? `⏰ הפעם עשית את זה בפחות זמן — כל הכבוד!` : `⏰ You did it in less time this time — great job!`);
        } else if (diff > 10) {
          messages.push(isHe ? `⚡ שימי לב — העומס עלה לעומת הפעם הקודמת` : `⚡ Heads up — workload increased vs last time`);
        }
      }

      if (key === "recommendedPrice") {
        if (diff > 0) {
          messages.push(isHe ? `💰 המחיר המומלץ עלה — סימן שאת בכיוון הנכון!` : `💰 Recommended price went up — you're on the right track!`);
        }
      }
    }

    if (messages.length === 0 && history.length > 0) {
      messages.push(isHe ? `📊 יש לנו נתונים מ-${history.length} פעמים קודמות — ממשיכים לעקוב!` : `📊 We have data from ${history.length} previous sessions — tracking your progress!`);
    }

    return messages.slice(0, 3);
  }, [history]);

  return { history, saveEntry, getProgressMessages, lastEntry };
}
