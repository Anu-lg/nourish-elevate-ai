/**
 * Simple streak tracker using localStorage.
 * Tracks daily completion — prevents duplicate marks on same day.
 */
import { useState, useCallback } from "react";

const STREAK_KEY = "nutriflex_streak";

interface StreakData {
  currentStreak: number;
  bestStreak: number;
  lastCompletedDate: string | null; // ISO date string "YYYY-MM-DD"
  completedDates: string[];         // list of completed "YYYY-MM-DD"
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function yesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

function loadStreak(): StreakData {
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<StreakData>;
      return {
        currentStreak:     parsed.currentStreak     ?? 0,
        bestStreak:        parsed.bestStreak        ?? 0,
        lastCompletedDate: parsed.lastCompletedDate ?? null,
        completedDates:    Array.isArray(parsed.completedDates) ? parsed.completedDates : [],
      };
    }
  } catch { /* noop */ }
  return { currentStreak: 0, bestStreak: 0, lastCompletedDate: null, completedDates: [] };
}

function saveStreak(data: StreakData) {
  try { localStorage.setItem(STREAK_KEY, JSON.stringify(data)); } catch { /* noop */ }
}

export function useStreak() {
  const [streak, setStreak] = useState<StreakData>(loadStreak);

  const isTodayCompleted = streak.completedDates.includes(today());

  const markToday = useCallback(() => {
    const todayStr = today();
    setStreak(prev => {
      // Prevent duplicate
      if (prev.completedDates.includes(todayStr)) return prev;

      const wasYesterdayDone = prev.lastCompletedDate === yesterday();
      const newCurrent = wasYesterdayDone ? prev.currentStreak + 1 : 1;
      const updated: StreakData = {
        currentStreak: newCurrent,
        bestStreak: Math.max(newCurrent, prev.bestStreak),
        lastCompletedDate: todayStr,
        completedDates: [...prev.completedDates, todayStr],
      };
      saveStreak(updated);
      return updated;
    });
  }, []);

  // Returns completion status for the current week (Mon–Sun)
  function getWeekStatus(): { day: string; short: string; done: boolean }[] {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const shorts = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const now = new Date();
    // Get Monday of current week
    const dayOfWeek = now.getDay(); // 0=Sun, 1=Mon...
    const monday = new Date(now);
    monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

    return days.map((day, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dateStr = d.toISOString().slice(0, 10);
      return { day, short: shorts[i]!, done: streak.completedDates.includes(dateStr) };
    });
  }

  return { streak, isTodayCompleted, markToday, getWeekStatus };
}
