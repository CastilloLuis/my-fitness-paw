import type { LifeStage, WeightBand, CatProfile, ObesityStatus } from './types';

/**
 * Classify a cat's life stage based on age in months.
 *
 * Based on AAHA/AAFP Feline Life Stage Guidelines (2021):
 * - Kitten: 0–12 months
 * - Young Adult: 1–6 years (13–72 months)
 * - Mature Adult: 7–10 years (73–120 months)
 * - Senior: 11+ years (121+ months)
 */
export function classifyLifeStage(ageMonths: number): LifeStage {
  if (ageMonths <= 12) return 'kitten';
  if (ageMonths <= 72) return 'young_adult';
  if (ageMonths <= 120) return 'mature_adult';
  return 'senior';
}

/**
 * Classify weight band.
 * Based on typical domestic cat weight ranges:
 * - < 4 kg: small / underweight range
 * - 4–5.5 kg: average domestic cat
 * - > 5.5 kg: large / potentially overweight
 */
export function classifyWeightBand(weightKg: number): WeightBand {
  if (weightKg < 4) return 'lt_4kg';
  if (weightKg <= 5.5) return '4_to_5_5kg';
  return 'gt_5_5kg';
}

/**
 * Classify obesity status from BCS (preferred) or weight heuristic.
 *
 * With BCS (Body Condition Score 1–9):
 *   - BCS >= 8 → obese
 *   - BCS >= 7 → overweight
 *   - BCS 4–6 → normal
 *   - BCS 1–3 → normal (underweight, not obese)
 *
 * Without BCS (soft heuristic only — NOT a diagnosis):
 *   - weightKg > 6.5 → overweight
 *   - weightKg > 5.5 → unknown (depends on frame/breed)
 *   - else → normal
 *
 * Source: Cornell Feline Health Center — Obesity
 */
export function classifyObesityStatus(profile: CatProfile): ObesityStatus {
  const bcs = profile.bcs9 ?? profile.body_condition_score_1_to_9;
  if (bcs != null) {
    if (bcs >= 8) return 'obese';
    if (bcs >= 7) return 'overweight';
    return 'normal';
  }
  if (profile.weight_kg > 6.5) return 'overweight';
  if (profile.weight_kg <= 5.5) return 'normal';
  return 'unknown';
}

/**
 * Determine if a cat is overweight based on BCS and weight.
 * Uses the new obesity classification — overweight includes BCS 7+ or obese.
 */
export function isOverweight(profile: CatProfile): boolean {
  const status = classifyObesityStatus(profile);
  return status === 'overweight' || status === 'obese';
}

/**
 * Determine if cat is obese specifically (BCS >= 8).
 */
export function isObese(profile: CatProfile): boolean {
  return classifyObesityStatus(profile) === 'obese';
}

/**
 * Determine if cat is underweight (BCS 1-3).
 */
export function isUnderweight(profile: CatProfile): boolean {
  const bcs = profile.bcs9 ?? profile.body_condition_score_1_to_9;
  if (bcs != null) {
    return bcs <= 3;
  }
  return profile.weight_kg < 3 && profile.age_months > 12;
}

/**
 * Convert age in years to months. Handles null/undefined.
 */
export function yearsToMonths(years: number | null | undefined): number {
  if (years == null) return 36; // default to young adult (~3 years)
  return Math.round(years * 12);
}
