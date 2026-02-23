// ============================================
// Cat Fitness Module — Public API
//
// Self-contained module for feline fitness calculations.
// Can be extracted as a standalone package.
//
// Usage:
//   import { generateCatInsights } from '@/src/lib/cat-fitness';
//   const insights = generateCatInsights(catProfile, todaySessions, weeklySessions);
//
// New energy API:
//   import { calcRER, calcMER, estimatePlayCalories, recommendPlayPlan } from '@/src/lib/cat-fitness';
// ============================================

// --- Types ---
export type {
  CatProfile,
  CatInsights,
  PlayPlan,
  ToyRecommendation,
  SessionCalorieResult,
  DailyCalorieSummary,
  WeeklyCalorieSummary,
  Range,
  LifeStage,
  WeightBand,
  Intensity,
  ObesityStatus,
  MERGoal,
  RERMethod,
  RERResult,
  MERResult,
  SafetyConstraints,
  PlayCalorieResult,
  PlayPlanRecommendation,
  Activity,
  ThingToAvoid,
  HazardTag,
  Supervision,
  JointImpact,
} from './types';

// --- Life stage / classification ---
export { classifyLifeStage, classifyWeightBand, yearsToMonths, isOverweight, isObese, isUnderweight, classifyObesityStatus } from './life-stage';

// --- Play plan ---
export { generatePlayPlan } from './play-plan';

// --- Backward-compatible calorie API (Range-based, used by app UI) ---
export { estimateSessionCalories, calculateDailyCalories, calculateWeeklyCalories, estimateRER, playCaloriesAsPercentOfRER } from './calories';

// --- New energy API (formula-based) ---
export { calcRER, calcMER, estimatePlayCalories, recommendPlayPlan, buildSafetyConstraints } from './energy';
export { classifyObesityStatus as classifyObesityStatusFromEnergy } from './energy';

// --- Activity catalog ---
export { ACTIVITIES, THINGS_TO_AVOID, getActivityById, getActivitiesByCategory } from './activities';

// --- Toy recommender ---
export { recommendToys } from './toy-recommender';

// --- Main entry point ---
import type { CatProfile, CatInsights } from './types';
import { generatePlayPlan } from './play-plan';
import { recommendToys } from './toy-recommender';
import { calculateDailyCalories, calculateWeeklyCalories } from './calories';
import { isOverweight, isObese, isUnderweight } from './life-stage';
import { classifyObesityStatus } from './energy';
import { getDisclaimer } from './knowledge-base';
import i18n from '@/src/i18n';

/**
 * Generate complete insights for a cat.
 * This is the main entry point for the module.
 */
export function generateCatInsights(
  profile: CatProfile,
  todaySessions: Array<{ activity_type: string; duration_minutes: number }> | null,
  weeklySessions: Array<Array<{ activity_type: string; duration_minutes: number }>> | null
): CatInsights {
  const playPlan = generatePlayPlan(profile);
  const toyRecommendations = recommendToys(profile);

  const todayCalories = todaySessions && todaySessions.length > 0
    ? calculateDailyCalories(todaySessions, profile.weight_kg)
    : null;

  const weeklyCalories = weeklySessions
    ? calculateWeeklyCalories(weeklySessions, profile.weight_kg)
    : null;

  // Generate warnings
  const warnings: string[] = [];
  const obesityStatus = classifyObesityStatus(profile);

  if (obesityStatus === 'obese') {
    warnings.push(i18n.t('catFitness.warningObese1'));
    warnings.push(i18n.t('catFitness.warningObese2'));
  } else if (obesityStatus === 'overweight') {
    warnings.push(i18n.t('catFitness.warningOverweight'));
  } else if (obesityStatus === 'unknown' && profile.weight_kg > 5.5) {
    warnings.push(i18n.t('catFitness.warningUnknownWeight', { weight: profile.weight_kg }));
  }

  if (isUnderweight(profile)) {
    warnings.push(i18n.t('catFitness.warningUnderweight'));
  }

  if (profile.known_cardiac_or_resp_disease) {
    warnings.push(i18n.t('catFitness.warningCardiac'));
  }

  if (profile.mobility_limitations) {
    warnings.push(i18n.t('catFitness.warningMobility'));
  }

  if (profile.is_anxious) {
    warnings.push(i18n.t('catFitness.warningAnxious'));
  }

  if (profile.ambient_hot) {
    warnings.push(i18n.t('catFitness.warningHot'));
  }

  if (profile.age_months > 180) {
    warnings.push(i18n.t('catFitness.warningGeriatric'));
  }

  return {
    profile,
    play_plan: playPlan,
    toy_recommendations: toyRecommendations,
    today_calories: todayCalories,
    weekly_calories: weeklyCalories,
    warnings,
    disclaimer: getDisclaimer(),
  };
}
