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
import { DISCLAIMER } from './knowledge-base';

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
    warnings.push(
      'This cat is classified as obese (BCS 8\u20139). Obesity places significant strain on the heart, lungs, and joints. Play sessions have been limited to short, low-intensity micro-sessions with mandatory rest breaks. Consult your veterinarian before starting any exercise program.'
    );
    warnings.push(
      'IMPORTANT: Obese cats are at increased risk of respiratory distress during exertion. Stop immediately if open-mouth breathing, panting, or reluctance to continue is observed. Allow at least 10 minutes of rest between sessions.'
    );
  } else if (obesityStatus === 'overweight') {
    warnings.push(
      'This cat appears to be overweight (BCS 7). The play plan has been adjusted with shorter, more frequent sessions and capped intensity. Consult your veterinarian before starting a weight-loss exercise program.'
    );
  } else if (obesityStatus === 'unknown' && profile.weight_kg > 5.5) {
    warnings.push(
      'This cat\'s weight (' + profile.weight_kg + ' kg) may indicate overweight status depending on breed and frame. A Body Condition Score (BCS) assessment by your veterinarian is recommended for accurate classification.'
    );
  }

  if (isUnderweight(profile)) {
    warnings.push(
      'This cat may be underweight. Ensure adequate caloric intake before increasing exercise. Consult your veterinarian.'
    );
  }

  if (profile.known_cardiac_or_resp_disease) {
    warnings.push(
      'KNOWN CARDIAC OR RESPIRATORY DISEASE: Only very gentle, supervised play is appropriate. Stop at the first sign of labored breathing, coughing, or fatigue. Your veterinarian should approve any exercise program.'
    );
  }

  if (profile.mobility_limitations) {
    warnings.push(
      'Mobility limitations detected. Plan adjusted to low-impact activities only. Avoid jumping and climbing activities.'
    );
  }

  if (profile.is_anxious) {
    warnings.push(
      'Anxious cat profile. Sessions are kept shorter to prevent overstimulation. Avoid laser pointers and unpredictable automated toys.'
    );
  }

  if (profile.ambient_hot) {
    warnings.push(
      'Hot ambient temperature: cats dissipate heat poorly. Session lengths have been reduced. Ensure fresh water is available. Stop play if any panting occurs.'
    );
  }

  if (profile.age_months > 180) {
    warnings.push(
      'This is a geriatric cat (15+ years). Increased veterinary monitoring recommended. Watch closely for signs of pain or fatigue during play.'
    );
  }

  return {
    profile,
    play_plan: playPlan,
    toy_recommendations: toyRecommendations,
    today_calories: todayCalories,
    weekly_calories: weeklyCalories,
    warnings,
    disclaimer: DISCLAIMER,
  };
}
