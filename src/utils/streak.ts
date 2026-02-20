import { startOfDay, subDays, isSameDay } from 'date-fns';

export function calculateStreak(sessionDates: Date[]): number {
  if (sessionDates.length === 0) return 0;

  const sorted = sessionDates
    .map((d) => startOfDay(d))
    .sort((a, b) => b.getTime() - a.getTime());

  const unique = sorted.filter(
    (date, i, arr) => i === 0 || !isSameDay(date, arr[i - 1])
  );

  const today = startOfDay(new Date());
  let streak = 0;

  // Check if played today or yesterday to start the streak
  if (isSameDay(unique[0], today) || isSameDay(unique[0], subDays(today, 1))) {
    streak = 1;
    for (let i = 1; i < unique.length; i++) {
      const expected = subDays(unique[0], i);
      if (isSameDay(unique[i], expected)) {
        streak++;
      } else {
        break;
      }
    }
  }

  return streak;
}
