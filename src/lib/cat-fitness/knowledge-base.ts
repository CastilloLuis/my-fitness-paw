import type { Range } from './types';
import i18n from '@/src/i18n';

// ============================================
// Veterinary-backed knowledge base
// Sources: AAHA/AAFP Life Stage Guidelines, Cornell Feline Health Center,
// ISFM Guidelines on Feline Environmental Needs, WSAVA, VCA Hospitals
// ============================================

/**
 * Baseline indoor play recommendations by life stage and weight band.
 *
 * Based on:
 * - ISFM recommendation of 2-3 play sessions per day
 * - Cornell Feline Health Center enrichment guidelines
 * - AAHA: 2–3 sessions of 10–15 min (short bursts)
 */
export const BASELINE_INDOOR_TABLE: Array<{
  life_stage: string;
  weight_band: string;
  sessions_per_day: Range;
  minutes_per_session: Range;
  total_minutes_per_day: Range;
  intensity: string;
}> = [
  // Kittens — high energy, short attention spans, frequent bursts
  { life_stage: 'kitten', weight_band: 'lt_4kg', sessions_per_day: { min: 3, max: 5, unit: 'sessions' }, minutes_per_session: { min: 5, max: 10, unit: 'minutes' }, total_minutes_per_day: { min: 20, max: 45, unit: 'minutes' }, intensity: 'high' },
  { life_stage: 'kitten', weight_band: '4_to_5_5kg', sessions_per_day: { min: 3, max: 4, unit: 'sessions' }, minutes_per_session: { min: 5, max: 10, unit: 'minutes' }, total_minutes_per_day: { min: 20, max: 40, unit: 'minutes' }, intensity: 'high' },

  // Young adults — peak physical ability
  { life_stage: 'young_adult', weight_band: 'lt_4kg', sessions_per_day: { min: 2, max: 3, unit: 'sessions' }, minutes_per_session: { min: 10, max: 15, unit: 'minutes' }, total_minutes_per_day: { min: 20, max: 40, unit: 'minutes' }, intensity: 'high' },
  { life_stage: 'young_adult', weight_band: '4_to_5_5kg', sessions_per_day: { min: 2, max: 3, unit: 'sessions' }, minutes_per_session: { min: 10, max: 15, unit: 'minutes' }, total_minutes_per_day: { min: 20, max: 40, unit: 'minutes' }, intensity: 'moderate' },
  { life_stage: 'young_adult', weight_band: 'gt_5_5kg', sessions_per_day: { min: 2, max: 3, unit: 'sessions' }, minutes_per_session: { min: 10, max: 15, unit: 'minutes' }, total_minutes_per_day: { min: 20, max: 40, unit: 'minutes' }, intensity: 'moderate' },

  // Mature adults — moderate energy
  { life_stage: 'mature_adult', weight_band: 'lt_4kg', sessions_per_day: { min: 2, max: 3, unit: 'sessions' }, minutes_per_session: { min: 8, max: 12, unit: 'minutes' }, total_minutes_per_day: { min: 15, max: 30, unit: 'minutes' }, intensity: 'moderate' },
  { life_stage: 'mature_adult', weight_band: '4_to_5_5kg', sessions_per_day: { min: 2, max: 3, unit: 'sessions' }, minutes_per_session: { min: 8, max: 12, unit: 'minutes' }, total_minutes_per_day: { min: 15, max: 30, unit: 'minutes' }, intensity: 'moderate' },
  { life_stage: 'mature_adult', weight_band: 'gt_5_5kg', sessions_per_day: { min: 2, max: 3, unit: 'sessions' }, minutes_per_session: { min: 8, max: 12, unit: 'minutes' }, total_minutes_per_day: { min: 15, max: 30, unit: 'minutes' }, intensity: 'low' },

  // Seniors — lower intensity, joint-friendly
  { life_stage: 'senior', weight_band: 'lt_4kg', sessions_per_day: { min: 2, max: 3, unit: 'sessions' }, minutes_per_session: { min: 5, max: 10, unit: 'minutes' }, total_minutes_per_day: { min: 10, max: 25, unit: 'minutes' }, intensity: 'low' },
  { life_stage: 'senior', weight_band: '4_to_5_5kg', sessions_per_day: { min: 2, max: 3, unit: 'sessions' }, minutes_per_session: { min: 5, max: 10, unit: 'minutes' }, total_minutes_per_day: { min: 10, max: 25, unit: 'minutes' }, intensity: 'low' },
  { life_stage: 'senior', weight_band: 'gt_5_5kg', sessions_per_day: { min: 1, max: 2, unit: 'sessions' }, minutes_per_session: { min: 5, max: 8, unit: 'minutes' }, total_minutes_per_day: { min: 8, max: 20, unit: 'minutes' }, intensity: 'low' },
];

/**
 * Overweight modifications — shorter, more frequent sessions.
 */
export const OVERWEIGHT_MODIFIERS = {
  sessions_per_day_add: 1,
  minutes_per_session_multiply: 0.7,
  intensity_cap: 'moderate' as const,
  notes: 'For overweight cats (BCS 7), use shorter, more frequent sessions to reduce joint stress. Prioritize low-impact activities. Always consult a veterinarian before starting a weight-loss exercise program.',
};

/**
 * Obese modifications — much shorter micro-sessions.
 */
export const OBESE_MODIFIERS = {
  sessions_per_day_range: { min: 2, max: 4, unit: 'sessions' } as Range,
  max_continuous_minutes: { min: 3, max: 5, unit: 'minutes' } as Range,
  daily_total_minutes: { min: 10, max: 15, unit: 'minutes' } as Range,
  intensity_cap: 'low' as const,
  rest_between_sessions_minutes: 10,
  notes: 'For obese cats (BCS 8–9), use very short micro-sessions (3–5 min) with mandatory rest breaks. Low intensity only. Gradual ramp: increase by 10–20% per week if tolerated. Consult a veterinarian before starting.',
};

/**
 * Senior mobility modifications.
 */
export const SENIOR_MOBILITY_MODIFIERS = {
  intensity_cap: 'low' as const,
  minutes_per_session_max: 8,
  preferred_activities: ['forage', 'bat', 'stalk'] as const,
  avoid_activities: ['jump', 'climb'] as const,
  notes: 'For seniors with mobility limitations, focus on ground-level play. Puzzle feeders and slow-moving toys on the floor are ideal.',
};

/**
 * Activity type → intensity mapping for backward compatibility.
 */
export const ACTIVITY_INTENSITY_MAP: Record<string, { intensity: 'low' | 'moderate' | 'high'; description: string }> = {
  wand: { intensity: 'moderate', description: 'Wand/feather teaser — stalking, pouncing, jumping' },
  laser: { intensity: 'high', description: 'Laser pointer — intense sprinting and chasing' },
  fetch: { intensity: 'high', description: 'Fetch — sprinting, retrieving, high cardio' },
  outdoor: { intensity: 'moderate', description: 'Outdoor exploration — walking, stalking, varied terrain' },
  free_roam: { intensity: 'low', description: 'Free roam / self-directed play — intermittent activity' },
};

/**
 * Legacy toy catalog — kept for backward compatibility with toy-recommender.
 * See activities.ts for the new comprehensive catalog.
 * Returns translated strings via i18n.t().
 */
export function getToyCalog() {
  return [
  {
    toy_category: 'wand_feather_teaser',
    label: i18n.t('catFitness.toyWandLabel'),
    emoji: '\u{1FA84}',
    activity_types: ['stalk', 'chase', 'pounce', 'jump'] as const,
    intensity: 'moderate' as const,
    joint_impact: 'moderate' as const,
    best_for_life_stages: ['kitten', 'young_adult', 'mature_adult'] as const,
    best_for_weight_bands: ['lt_4kg', '4_to_5_5kg', 'gt_5_5kg'] as const,
    session_structure: i18n.t('catFitness.toyWandSession'),
    safety_notes: [
      i18n.t('catFitness.toyWandSafety1'),
      i18n.t('catFitness.toyWandSafety2'),
      i18n.t('catFitness.toyWandSafety3'),
    ],
  },
  {
    toy_category: 'laser_pointer',
    label: i18n.t('catFitness.toyLaserLabel'),
    emoji: '\u{1F534}',
    activity_types: ['chase', 'pounce'] as const,
    intensity: 'high' as const,
    joint_impact: 'moderate' as const,
    best_for_life_stages: ['kitten', 'young_adult'] as const,
    best_for_weight_bands: ['lt_4kg', '4_to_5_5kg'] as const,
    session_structure: i18n.t('catFitness.toyLaserSession'),
    safety_notes: [
      i18n.t('catFitness.toyLaserSafety1'),
      i18n.t('catFitness.toyLaserSafety2'),
      i18n.t('catFitness.toyLaserSafety3'),
      i18n.t('catFitness.toyLaserSafety4'),
    ],
  },
  {
    toy_category: 'ball_track',
    label: i18n.t('catFitness.toyBallLabel'),
    emoji: '\u{1F3BE}',
    activity_types: ['bat', 'chase'] as const,
    intensity: 'moderate' as const,
    joint_impact: 'low' as const,
    best_for_life_stages: ['kitten', 'young_adult', 'mature_adult', 'senior'] as const,
    best_for_weight_bands: ['lt_4kg', '4_to_5_5kg', 'gt_5_5kg'] as const,
    session_structure: i18n.t('catFitness.toyBallSession'),
    safety_notes: [
      i18n.t('catFitness.toyBallSafety1'),
      i18n.t('catFitness.toyBallSafety2'),
    ],
  },
  {
    toy_category: 'kicker_toy',
    label: i18n.t('catFitness.toyKickerLabel'),
    emoji: '\u{1F3C8}',
    activity_types: ['kick', 'pounce'] as const,
    intensity: 'moderate' as const,
    joint_impact: 'low' as const,
    best_for_life_stages: ['kitten', 'young_adult', 'mature_adult'] as const,
    best_for_weight_bands: ['lt_4kg', '4_to_5_5kg', 'gt_5_5kg'] as const,
    session_structure: i18n.t('catFitness.toyKickerSession'),
    safety_notes: [
      i18n.t('catFitness.toyKickerSafety1'),
      i18n.t('catFitness.toyKickerSafety2'),
    ],
  },
  {
    toy_category: 'crinkle_toy',
    label: i18n.t('catFitness.toyCrinkleLabel'),
    emoji: '\u{1F4E6}',
    activity_types: ['bat', 'pounce', 'stalk'] as const,
    intensity: 'low' as const,
    joint_impact: 'low' as const,
    best_for_life_stages: ['kitten', 'young_adult', 'mature_adult', 'senior'] as const,
    best_for_weight_bands: ['lt_4kg', '4_to_5_5kg', 'gt_5_5kg'] as const,
    session_structure: i18n.t('catFitness.toyCrinkleSession'),
    safety_notes: [
      i18n.t('catFitness.toyCrinkleSafety1'),
    ],
  },
  {
    toy_category: 'puzzle_feeder',
    label: i18n.t('catFitness.toyPuzzleLabel'),
    emoji: '\u{1F9E9}',
    activity_types: ['forage'] as const,
    intensity: 'low' as const,
    joint_impact: 'low' as const,
    best_for_life_stages: ['kitten', 'young_adult', 'mature_adult', 'senior'] as const,
    best_for_weight_bands: ['lt_4kg', '4_to_5_5kg', 'gt_5_5kg'] as const,
    session_structure: i18n.t('catFitness.toyPuzzleSession'),
    safety_notes: [
      i18n.t('catFitness.toyPuzzleSafety1'),
      i18n.t('catFitness.toyPuzzleSafety2'),
      i18n.t('catFitness.toyPuzzleSafety3'),
    ],
  },
  {
    toy_category: 'catnip_toy',
    label: i18n.t('catFitness.toyCatnipLabel'),
    emoji: '\u{1F33F}',
    activity_types: ['bat', 'kick', 'pounce'] as const,
    intensity: 'moderate' as const,
    joint_impact: 'low' as const,
    best_for_life_stages: ['young_adult', 'mature_adult'] as const,
    best_for_weight_bands: ['lt_4kg', '4_to_5_5kg', 'gt_5_5kg'] as const,
    session_structure: i18n.t('catFitness.toyCatnipSession'),
    safety_notes: [
      i18n.t('catFitness.toyCatnipSafety1'),
      i18n.t('catFitness.toyCatnipSafety2'),
      i18n.t('catFitness.toyCatnipSafety3'),
      i18n.t('catFitness.toyCatnipSafety4'),
    ],
  },
  {
    toy_category: 'climbing_vertical',
    label: i18n.t('catFitness.toyClimbingLabel'),
    emoji: '\u{1FAB5}',
    activity_types: ['climb', 'jump'] as const,
    intensity: 'high' as const,
    joint_impact: 'high' as const,
    best_for_life_stages: ['kitten', 'young_adult'] as const,
    best_for_weight_bands: ['lt_4kg', '4_to_5_5kg'] as const,
    session_structure: i18n.t('catFitness.toyClimbingSession'),
    safety_notes: [
      i18n.t('catFitness.toyClimbingSafety1'),
      i18n.t('catFitness.toyClimbingSafety2'),
      i18n.t('catFitness.toyClimbingSafety3'),
    ],
  },
  {
    toy_category: 'treat_scatter',
    label: i18n.t('catFitness.toyTreatScatterLabel'),
    emoji: '\u{1F443}',
    activity_types: ['forage', 'stalk'] as const,
    intensity: 'low' as const,
    joint_impact: 'low' as const,
    best_for_life_stages: ['kitten', 'young_adult', 'mature_adult', 'senior'] as const,
    best_for_weight_bands: ['lt_4kg', '4_to_5_5kg', 'gt_5_5kg'] as const,
    session_structure: i18n.t('catFitness.toyTreatScatterSession'),
    safety_notes: [
      i18n.t('catFitness.toyTreatScatterSafety1'),
      i18n.t('catFitness.toyTreatScatterSafety2'),
    ],
  },
  {
    toy_category: 'automated_toy',
    label: i18n.t('catFitness.toyAutomatedLabel'),
    emoji: '\u{1F916}',
    activity_types: ['chase', 'bat', 'pounce'] as const,
    intensity: 'moderate' as const,
    joint_impact: 'low' as const,
    best_for_life_stages: ['kitten', 'young_adult', 'mature_adult'] as const,
    best_for_weight_bands: ['lt_4kg', '4_to_5_5kg', 'gt_5_5kg'] as const,
    session_structure: i18n.t('catFitness.toyAutomatedSession'),
    safety_notes: [
      i18n.t('catFitness.toyAutomatedSafety1'),
      i18n.t('catFitness.toyAutomatedSafety2'),
      i18n.t('catFitness.toyAutomatedSafety3'),
    ],
  },
  ];
}

/**
 * Universal stop rules — signs to immediately stop play.
 * Sources: Cornell, ISFM, AAHA, PDSA
 */
export function getStopRules(): string[] {
  return [
    i18n.t('catFitness.stopRulePanting'),
    i18n.t('catFitness.stopRuleCollapse'),
    i18n.t('catFitness.stopRuleCyanosis'),
    i18n.t('catFitness.stopRuleCoughing'),
    i18n.t('catFitness.stopRuleVomiting'),
    i18n.t('catFitness.stopRuleLimping'),
    i18n.t('catFitness.stopRuleAggression'),
    i18n.t('catFitness.stopRuleHiding'),
    i18n.t('catFitness.stopRuleDrooling'),
    i18n.t('catFitness.stopRuleRefusing'),
  ];
}

/**
 * Hunt-Eat-Groom-Sleep sequence recommendation.
 */
export function getHuntEatGroomSleep(): string {
  return i18n.t('catFitness.huntEatGroomSleep');
}

export function getDisclaimer(): string {
  return i18n.t('catFitness.disclaimer');
}
