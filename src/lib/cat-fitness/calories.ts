// ============================================
// Calorie Calculations — Backward-compatible API
//
// This file wraps the new energy.ts module to maintain
// the Range-based API that the app UI consumes.
//
// For the new formula-based API, use energy.ts directly.
// ============================================

import type {
  Range,
  SessionCalorieResult,
  DailyCalorieSummary,
  WeeklyCalorieSummary,
  Intensity,
} from './types';
import { calcRER, estimatePlayCalories } from './energy';
import { getActivityById } from './activities';

// Map old activity type strings to new activity IDs
const ACTIVITY_TYPE_TO_ID: Record<string, string> = {
  wand: 'prey_mimic_wand',
  laser: 'laser_pointer',
  fetch: 'chase_pounce_fetch',
  outdoor: 'chase_pounce_ball', // closest match
  free_roam: 'foraging_treat_scatter', // closest match for low intensity
};

// Map old activity type strings to intensity
const ACTIVITY_TYPE_INTENSITY: Record<string, Intensity> = {
  wand: 'moderate',
  laser: 'high',
  fetch: 'high',
  outdoor: 'moderate',
  free_roam: 'low',
};

/**
 * Estimate calories burned for a single play session.
 * Returns a Range (min/max) for UI display.
 *
 * The range is computed as ±20% around the formula-based estimate
 * to account for individual variation.
 */
export function estimateSessionCalories(
  activityType: string,
  durationMinutes: number,
  weightKg: number,
  overrideIntensity?: Intensity
): SessionCalorieResult {
  // Determine intensity from activity type or override
  const intensity: Intensity =
    overrideIntensity ??
    ACTIVITY_TYPE_INTENSITY[activityType] ??
    (getActivityById(activityType)?.intensity ?? 'moderate');

  // Use the new formula
  const result = estimatePlayCalories({
    weightKg,
    durationMinutes,
    intensity,
  });

  // Create a range (±20%) to account for individual variation
  const base = result.totalKcalDuringPlay;
  const estimatedKcal: Range = {
    min: Math.round(base * 0.8 * 10) / 10,
    max: Math.round(base * 1.2 * 10) / 10,
    unit: 'kcal',
  };

  return {
    activity_type: activityType,
    duration_minutes: durationMinutes,
    estimated_kcal: estimatedKcal,
    intensity,
  };
}

/**
 * Calculate daily calorie summary from an array of sessions.
 */
export function calculateDailyCalories(
  sessions: Array<{ activity_type: string; duration_minutes: number }>,
  weightKg: number
): DailyCalorieSummary {
  const breakdown = sessions.map((s) =>
    estimateSessionCalories(s.activity_type, s.duration_minutes, weightKg)
  );

  const totalMin = breakdown.reduce((sum, b) => sum + b.estimated_kcal.min, 0);
  const totalMax = breakdown.reduce((sum, b) => sum + b.estimated_kcal.max, 0);
  const totalMinutes = sessions.reduce((sum, s) => sum + s.duration_minutes, 0);

  return {
    total_estimated_kcal: {
      min: Math.round(totalMin * 10) / 10,
      max: Math.round(totalMax * 10) / 10,
      unit: 'kcal',
    },
    sessions_count: sessions.length,
    total_minutes: totalMinutes,
    breakdown,
  };
}

/**
 * Calculate weekly calorie summary from daily session arrays.
 */
export function calculateWeeklyCalories(
  dailySessions: Array<Array<{ activity_type: string; duration_minutes: number }>>,
  weightKg: number
): WeeklyCalorieSummary {
  let totalMin = 0;
  let totalMax = 0;
  let totalSessions = 0;
  let totalMinutes = 0;
  let activeDays = 0;

  for (const day of dailySessions) {
    if (day.length > 0) {
      activeDays++;
      const daily = calculateDailyCalories(day, weightKg);
      totalMin += daily.total_estimated_kcal.min;
      totalMax += daily.total_estimated_kcal.max;
      totalSessions += daily.sessions_count;
      totalMinutes += daily.total_minutes;
    }
  }

  const daysCount = Math.max(activeDays, 1);

  return {
    total_estimated_kcal: {
      min: Math.round(totalMin * 10) / 10,
      max: Math.round(totalMax * 10) / 10,
      unit: 'kcal',
    },
    daily_average_kcal: {
      min: Math.round((totalMin / daysCount) * 10) / 10,
      max: Math.round((totalMax / daysCount) * 10) / 10,
      unit: 'kcal',
    },
    total_sessions: totalSessions,
    total_minutes: totalMinutes,
    active_days: activeDays,
  };
}

/**
 * Estimate Resting Energy Requirement (RER) for context.
 * RER (kcal/day) = 70 × (body_weight_kg)^0.75
 */
export function estimateRER(weightKg: number): number {
  return calcRER(weightKg).rerKcalPerDay;
}

/**
 * Get percentage of daily energy from play.
 */
export function playCaloriesAsPercentOfRER(
  playKcal: Range,
  weightKg: number
): { min: number; max: number } {
  const rer = estimateRER(weightKg);
  return {
    min: Math.round((playKcal.min / rer) * 100),
    max: Math.round((playKcal.max / rer) * 100),
  };
}
