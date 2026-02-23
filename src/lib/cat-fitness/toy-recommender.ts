import type { CatProfile, ToyRecommendation, LifeStage, WeightBand } from './types';
import { classifyLifeStage, classifyWeightBand, isOverweight } from './life-stage';
import { getToyCalog, SENIOR_MOBILITY_MODIFIERS } from './knowledge-base';

/**
 * Generate ranked toy recommendations for a specific cat profile.
 * Returns toys sorted by suitability score (1 = perfect match, 0 = poor match).
 */
export function recommendToys(profile: CatProfile): ToyRecommendation[] {
  const lifeStage = classifyLifeStage(profile.age_months);
  const weightBand = classifyWeightBand(profile.weight_kg);
  const overweight = isOverweight(profile);
  const hasMobility = profile.mobility_limitations;

  return getToyCalog().map((toy) => {
    let score = 0.5; // base score

    // Life stage match
    if (toy.best_for_life_stages.includes(lifeStage as any)) {
      score += 0.2;
    } else {
      score -= 0.15;
    }

    // Weight band match
    if (toy.best_for_weight_bands.includes(weightBand as any)) {
      score += 0.1;
    }

    // Overweight: prefer low joint impact, penalize high intensity
    if (overweight) {
      if (toy.joint_impact === 'low') score += 0.15;
      if (toy.joint_impact === 'high') score -= 0.2;
      if (toy.intensity === 'high') score -= 0.1;
      // Puzzle feeders are great for weight management
      if (toy.toy_category === 'puzzle_feeder') score += 0.2;
    }

    // Mobility limitations: penalize high joint impact
    if (hasMobility) {
      if (toy.joint_impact === 'high') score -= 0.3;
      if (toy.joint_impact === 'moderate') score -= 0.1;
      if (toy.joint_impact === 'low') score += 0.15;

      // Check if activity types include senior-avoid types
      const avoidTypes = SENIOR_MOBILITY_MODIFIERS.avoid_activities as readonly string[];
      const hasAvoidType = toy.activity_types.some((a) => avoidTypes.includes(a));
      if (hasAvoidType) score -= 0.2;
    }

    // Anxious cats: penalize laser, high intensity
    if (profile.is_anxious) {
      if (toy.toy_category === 'laser_pointer') score -= 0.35;
      if (toy.intensity === 'high') score -= 0.15;
      if (toy.toy_category === 'puzzle_feeder') score += 0.1;
      if (toy.toy_category === 'treat_scatter') score += 0.1;
    }

    // Energy level boost
    if (profile.energy_level === 'wild_hunter') {
      if (toy.intensity === 'high') score += 0.1;
    } else if (profile.energy_level === 'couch_potato') {
      if (toy.intensity === 'low') score += 0.1;
      if (toy.intensity === 'high') score -= 0.1;
    }

    // Senior cats: boost ground-level, low-impact toys
    if (lifeStage === 'senior') {
      if (toy.joint_impact === 'low') score += 0.1;
      if (toy.toy_category === 'puzzle_feeder' || toy.toy_category === 'treat_scatter') {
        score += 0.15;
      }
    }

    // Kittens: boost interactive, varied activity toys
    if (lifeStage === 'kitten') {
      if (toy.activity_types.length >= 3) score += 0.1;
      if (toy.toy_category === 'wand_feather_teaser') score += 0.1;
    }

    // Clamp score
    score = Math.max(0, Math.min(1, score));

    return {
      toy_category: toy.toy_category,
      label: toy.label,
      emoji: toy.emoji,
      activity_types: toy.activity_types as any,
      intensity: toy.intensity,
      joint_impact: toy.joint_impact,
      best_for_life_stages: toy.best_for_life_stages as any,
      best_for_weight_bands: toy.best_for_weight_bands as any,
      session_structure: toy.session_structure,
      safety_notes: toy.safety_notes,
      suitability_score: Math.round(score * 100) / 100,
    };
  })
    .sort((a, b) => b.suitability_score - a.suitability_score);
}
