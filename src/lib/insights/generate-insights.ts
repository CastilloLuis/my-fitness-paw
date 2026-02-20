import type { PlaySession, Cat } from '@/src/supabase/types';
import { ACTIVITY_TYPES, getActivityType } from '@/src/utils/activity-types';

export interface InsightCard {
  id: string;
  emoji: string;
  headline: string;
  metric: string;
  cta?: { label: string; route: string };
}

// Helpers
function daysBetween(a: Date, b: Date): number {
  const msPerDay = 86400000;
  return Math.floor(Math.abs(a.getTime() - b.getTime()) / msPerDay);
}

function getHour(dateStr: string): number {
  return new Date(dateStr).getHours();
}

function formatMinutes(mins: number): string {
  if (mins >= 60) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  }
  return `${mins}m`;
}

// 1. Time-of-day pattern
function timeOfDayInsight(sessions: PlaySession[]): InsightCard | null {
  if (sessions.length < 5) return null;

  const buckets = { morning: 0, afternoon: 0, evening: 0 };
  for (const s of sessions) {
    const h = getHour(s.played_at);
    if (h < 12) buckets.morning++;
    else if (h < 17) buckets.afternoon++;
    else buckets.evening++;
  }

  const entries = Object.entries(buckets) as [string, number][];
  entries.sort((a, b) => b[1] - a[1]);
  const [topPeriod, topCount] = entries[0];
  const pct = Math.round((topCount / sessions.length) * 100);
  if (pct < 40) return null;

  const labels: Record<string, string> = {
    morning: 'Morning',
    afternoon: 'Afternoon',
    evening: 'Evening',
  };
  const emojis: Record<string, string> = {
    morning: '\u{1F305}',
    afternoon: '\u2600\uFE0F',
    evening: '\u{1F319}',
  };

  return {
    id: 'time-of-day',
    emoji: emojis[topPeriod],
    headline: `${labels[topPeriod]} player`,
    metric: `${pct}% of sessions are in the ${topPeriod}`,
  };
}

// 2. Duration trend (last 7 vs prior 7 sessions)
function durationTrendInsight(sessions: PlaySession[]): InsightCard | null {
  if (sessions.length < 6) return null;

  const sorted = [...sessions].sort(
    (a, b) => new Date(b.played_at).getTime() - new Date(a.played_at).getTime()
  );

  const half = Math.floor(sorted.length / 2);
  const recent = sorted.slice(0, half);
  const older = sorted.slice(half);

  const avgRecent =
    recent.reduce((s, x) => s + x.duration_minutes, 0) / recent.length;
  const avgOlder =
    older.reduce((s, x) => s + x.duration_minutes, 0) / older.length;

  if (avgOlder === 0) return null;
  const change = Math.round(((avgRecent - avgOlder) / avgOlder) * 100);
  if (Math.abs(change) < 10) return null;

  const trending = change > 0;
  return {
    id: 'duration-trend',
    emoji: trending ? '\u{1F4C8}' : '\u{1F4C9}',
    headline: trending ? 'Sessions getting longer' : 'Sessions getting shorter',
    metric: `${Math.abs(change)}% ${trending ? 'longer' : 'shorter'} recently (avg ${formatMinutes(Math.round(avgRecent))})`,
  };
}

// 3. Activity preference
function activityPreferenceInsight(sessions: PlaySession[]): InsightCard | null {
  if (sessions.length < 3) return null;

  const counts: Record<string, number> = {};
  for (const s of sessions) {
    counts[s.activity_type] = (counts[s.activity_type] ?? 0) + 1;
  }

  const entries = Object.entries(counts);
  entries.sort((a, b) => b[1] - a[1]);
  const [topActivity, topCount] = entries[0];
  const pct = Math.round((topCount / sessions.length) * 100);

  const activity = getActivityType(topActivity);
  if (!activity) return null;

  return {
    id: 'activity-preference',
    emoji: activity.emoji,
    headline: `${activity.label} fan`,
    metric: `${pct}% of sessions (${topCount} total)`,
  };
}

// 4. Streak status
function streakInsight(sessions: PlaySession[]): InsightCard | null {
  if (sessions.length === 0) return null;

  const sorted = [...sessions].sort(
    (a, b) => new Date(b.played_at).getTime() - new Date(a.played_at).getTime()
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const latestDate = new Date(sorted[0].played_at);
  latestDate.setHours(0, 0, 0, 0);

  if (daysBetween(today, latestDate) > 1) return null;

  let streak = 1;
  let prev = latestDate;
  for (let i = 1; i < sorted.length; i++) {
    const d = new Date(sorted[i].played_at);
    d.setHours(0, 0, 0, 0);
    const diff = daysBetween(prev, d);
    if (diff === 0) continue;
    if (diff === 1) {
      streak++;
      prev = d;
    } else {
      break;
    }
  }

  if (streak < 2) return null;

  return {
    id: 'streak',
    emoji: '\u{1F525}',
    headline: `${streak}-day streak!`,
    metric: `Keep it going — play today to extend`,
  };
}

// 5. Consistency score (sessions per week over last 4 weeks)
function consistencyInsight(sessions: PlaySession[]): InsightCard | null {
  if (sessions.length < 4) return null;

  const now = Date.now();
  const fourWeeksAgo = now - 28 * 86400000;
  const recent = sessions.filter(
    (s) => new Date(s.played_at).getTime() >= fourWeeksAgo
  );

  if (recent.length < 4) return null;

  const weeksWithActivity = new Set(
    recent.map((s) => {
      const d = new Date(s.played_at);
      const weekStart = new Date(d);
      weekStart.setDate(d.getDate() - d.getDay());
      weekStart.setHours(0, 0, 0, 0);
      return weekStart.getTime();
    })
  );

  const score = Math.round((weeksWithActivity.size / 4) * 100);
  if (score < 50) return null;

  const labels: Record<string, string> = {};
  let label: string;
  if (score === 100) label = 'Perfect consistency';
  else if (score >= 75) label = 'Strong consistency';
  else label = 'Building momentum';

  return {
    id: 'consistency',
    emoji: '\u{1F3AF}',
    headline: label,
    metric: `Active ${weeksWithActivity.size} of last 4 weeks`,
  };
}

// 6. Multi-cat comparison
function multiCatInsight(
  sessions: PlaySession[],
  cats: Cat[]
): InsightCard | null {
  if (cats.length < 2 || sessions.length < 3) return null;

  const minutesByCat: Record<string, number> = {};
  for (const s of sessions) {
    minutesByCat[s.cat_id] = (minutesByCat[s.cat_id] ?? 0) + s.duration_minutes;
  }

  const entries = Object.entries(minutesByCat);
  if (entries.length < 2) return null;

  entries.sort((a, b) => b[1] - a[1]);
  const [topId, topMins] = entries[0];
  const [lowId, lowMins] = entries[entries.length - 1];

  const topCat = cats.find((c) => c.id === topId);
  const lowCat = cats.find((c) => c.id === lowId);
  if (!topCat || !lowCat) return null;

  const diff = topMins - lowMins;
  if (diff < 5) return null;

  return {
    id: 'multi-cat',
    emoji: '\u{1F408}',
    headline: `${lowCat.name} needs love`,
    metric: `${formatMinutes(diff)} less playtime than ${topCat.name}`,
    cta: { label: 'Play now', route: '/session/live' },
  };
}

// 7. Personal bests
function personalBestInsight(sessions: PlaySession[]): InsightCard | null {
  if (sessions.length < 2) return null;

  const sorted = [...sessions].sort(
    (a, b) => b.duration_minutes - a.duration_minutes
  );
  const longest = sorted[0];

  // Only show if there's a session from last 7 days that's the personal best
  const sevenDaysAgo = Date.now() - 7 * 86400000;
  const longestDate = new Date(longest.played_at).getTime();
  if (longestDate < sevenDaysAgo) return null;

  return {
    id: 'personal-best',
    emoji: '\u{1F3C6}',
    headline: 'New personal best!',
    metric: `${formatMinutes(longest.duration_minutes)} — your longest session`,
  };
}

export function generateInsights(
  sessions: PlaySession[],
  cats: Cat[]
): InsightCard[] {
  const generators = [
    () => streakInsight(sessions),
    () => personalBestInsight(sessions),
    () => durationTrendInsight(sessions),
    () => activityPreferenceInsight(sessions),
    () => timeOfDayInsight(sessions),
    () => consistencyInsight(sessions),
    () => multiCatInsight(sessions, cats),
  ];

  const results: InsightCard[] = [];
  for (const gen of generators) {
    const card = gen();
    if (card) results.push(card);
  }

  return results;
}
