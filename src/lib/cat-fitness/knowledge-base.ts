import type { Range } from './types';

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
 */
export const TOY_CATALOG = [
  {
    toy_category: 'wand_feather_teaser',
    label: 'Wand / Feather Teaser',
    emoji: '\u{1FA84}',
    activity_types: ['stalk', 'chase', 'pounce', 'jump'] as const,
    intensity: 'moderate' as const,
    joint_impact: 'moderate' as const,
    best_for_life_stages: ['kitten', 'young_adult', 'mature_adult'] as const,
    best_for_weight_bands: ['lt_4kg', '4_to_5_5kg', 'gt_5_5kg'] as const,
    session_structure: 'Start slow (mimicking prey hiding) \u2192 build to active chase (2\u20133 min) \u2192 let cat "catch" prey \u2192 repeat 3\u20134 cycles \u2192 end with a catch and treat.',
    safety_notes: [
      'Never leave string/feather toys unattended \u2014 ingestion risk.',
      'Replace frayed feathers promptly.',
      'Let cat "win" regularly to prevent frustration.',
    ],
  },
  {
    toy_category: 'laser_pointer',
    label: 'Laser Pointer',
    emoji: '\u{1F534}',
    activity_types: ['chase', 'pounce'] as const,
    intensity: 'high' as const,
    joint_impact: 'moderate' as const,
    best_for_life_stages: ['kitten', 'young_adult'] as const,
    best_for_weight_bands: ['lt_4kg', '4_to_5_5kg'] as const,
    session_structure: 'Short bursts only (3\u20135 min). Move dot along floor in prey-like patterns. MUST end by leading dot to a physical toy or treat that cat can "catch".',
    safety_notes: [
      'ALWAYS end with a physical catch (treat or toy) \u2014 failure causes frustration and obsessive behavior.',
      'Never shine in eyes.',
      'Limit sessions to 5 minutes max.',
      'Not recommended for anxious cats or cats prone to compulsive behaviors.',
    ],
  },
  {
    toy_category: 'ball_track',
    label: 'Ball / Track Ball',
    emoji: '\u{1F3BE}',
    activity_types: ['bat', 'chase'] as const,
    intensity: 'moderate' as const,
    joint_impact: 'low' as const,
    best_for_life_stages: ['kitten', 'young_adult', 'mature_adult', 'senior'] as const,
    best_for_weight_bands: ['lt_4kg', '4_to_5_5kg', 'gt_5_5kg'] as const,
    session_structure: 'Roll ball to initiate. Let cat bat and chase. Works well for solo play between interactive sessions.',
    safety_notes: [
      'Choose balls too large to swallow.',
      'Avoid balls with small detachable parts.',
    ],
  },
  {
    toy_category: 'kicker_toy',
    label: 'Kicker Toy',
    emoji: '\u{1F3C8}',
    activity_types: ['kick', 'pounce'] as const,
    intensity: 'moderate' as const,
    joint_impact: 'low' as const,
    best_for_life_stages: ['kitten', 'young_adult', 'mature_adult'] as const,
    best_for_weight_bands: ['lt_4kg', '4_to_5_5kg', 'gt_5_5kg'] as const,
    session_structure: 'Present toy \u2192 cat grabs with front paws and bunny-kicks. Great for core engagement. 5\u201310 min sessions.',
    safety_notes: [
      'Check seams regularly for loose filling.',
      'Replace if fabric tears.',
    ],
  },
  {
    toy_category: 'crinkle_toy',
    label: 'Crinkle Toy',
    emoji: '\u{1F4E6}',
    activity_types: ['bat', 'pounce', 'stalk'] as const,
    intensity: 'low' as const,
    joint_impact: 'low' as const,
    best_for_life_stages: ['kitten', 'young_adult', 'mature_adult', 'senior'] as const,
    best_for_weight_bands: ['lt_4kg', '4_to_5_5kg', 'gt_5_5kg'] as const,
    session_structure: 'Toss or hide crinkle toys to encourage investigation and batting.',
    safety_notes: [
      'Ensure no small pieces can be chewed off and swallowed.',
    ],
  },
  {
    toy_category: 'puzzle_feeder',
    label: 'Puzzle Feeder / Food Dispensing',
    emoji: '\u{1F9E9}',
    activity_types: ['forage'] as const,
    intensity: 'low' as const,
    joint_impact: 'low' as const,
    best_for_life_stages: ['kitten', 'young_adult', 'mature_adult', 'senior'] as const,
    best_for_weight_bands: ['lt_4kg', '4_to_5_5kg', 'gt_5_5kg'] as const,
    session_structure: 'Fill with portion of daily kibble. Start with easiest difficulty, increase gradually. 10\u201320 min engagement. Ideal for weight management.',
    safety_notes: [
      'Count dispensed food as part of daily caloric intake.',
      'Clean regularly to prevent mold.',
      'Start with easy levels to prevent frustration.',
    ],
  },
  {
    toy_category: 'catnip_toy',
    label: 'Catnip Toy',
    emoji: '\u{1F33F}',
    activity_types: ['bat', 'kick', 'pounce'] as const,
    intensity: 'moderate' as const,
    joint_impact: 'low' as const,
    best_for_life_stages: ['young_adult', 'mature_adult'] as const,
    best_for_weight_bands: ['lt_4kg', '4_to_5_5kg', 'gt_5_5kg'] as const,
    session_structure: 'Present fresh catnip or catnip-infused toy. Response lasts 5\u201315 min. Allow 1\u20132 hour cooldown.',
    safety_notes: [
      'About 30\u201350% of cats do not respond to catnip (genetic).',
      'Kittens under 6 months rarely respond.',
      'Some cats become aggressive \u2014 discontinue if so.',
      'Silver vine is an alternative for non-responders.',
    ],
  },
  {
    toy_category: 'climbing_vertical',
    label: 'Climbing Tree / Vertical Space',
    emoji: '\u{1FAB5}',
    activity_types: ['climb', 'jump'] as const,
    intensity: 'high' as const,
    joint_impact: 'high' as const,
    best_for_life_stages: ['kitten', 'young_adult'] as const,
    best_for_weight_bands: ['lt_4kg', '4_to_5_5kg'] as const,
    session_structure: 'Encourage climbing by placing treats or toys at different levels.',
    safety_notes: [
      'Ensure tree is stable and secured \u2014 tip-over risk with large cats.',
      'Not recommended for senior cats or cats with joint issues.',
      'Overweight cats: ensure shelves support their weight.',
    ],
  },
  {
    toy_category: 'treat_scatter',
    label: 'Treat Scatter / Sniffing Game',
    emoji: '\u{1F443}',
    activity_types: ['forage', 'stalk'] as const,
    intensity: 'low' as const,
    joint_impact: 'low' as const,
    best_for_life_stages: ['kitten', 'young_adult', 'mature_adult', 'senior'] as const,
    best_for_weight_bands: ['lt_4kg', '4_to_5_5kg', 'gt_5_5kg'] as const,
    session_structure: 'Scatter a small number of treats (5\u201310) across a room or in a snuffle mat. 5\u201315 min.',
    safety_notes: [
      'Count scattered treats as part of daily caloric intake.',
      'Use low-calorie treats for overweight cats.',
    ],
  },
  {
    toy_category: 'automated_toy',
    label: 'Automated / Electronic Toy',
    emoji: '\u{1F916}',
    activity_types: ['chase', 'bat', 'pounce'] as const,
    intensity: 'moderate' as const,
    joint_impact: 'low' as const,
    best_for_life_stages: ['kitten', 'young_adult', 'mature_adult'] as const,
    best_for_weight_bands: ['lt_4kg', '4_to_5_5kg', 'gt_5_5kg'] as const,
    session_structure: 'Use as supplement, not replacement for interactive play. Limit to 10\u201315 min.',
    safety_notes: [
      'Supervise electronic toys \u2014 entanglement and battery risks.',
      'Rotate toys to prevent habituation.',
      'Not a substitute for interactive human-cat play.',
    ],
  },
];

/**
 * Universal stop rules — signs to immediately stop play.
 * Sources: Cornell, ISFM, AAHA, PDSA
 */
export const STOP_RULES = [
  'Open-mouth breathing or panting (cats should NOT pant like dogs \u2014 this indicates overexertion or respiratory distress). STOP immediately. Seek vet care if it persists beyond 2\u20133 minutes of rest.',
  'Collapse, inability to stand, or extreme lethargy \u2014 veterinary emergency.',
  'Blue, purple, or pale/white gums (cyanosis) \u2014 veterinary emergency.',
  'Coughing, gagging, or wheezing during play.',
  'Vomiting during or immediately after play.',
  'Limping, favoring a limb, or crying out in pain.',
  'Aggression escalation (hissing, growling, flattened ears with stiff body) \u2014 cat is overstimulated.',
  'Hiding or attempting to escape the play area \u2014 respect the cat\'s choice.',
  'Excessive drooling during play.',
  'Refusing to engage after being enticed \u2014 never force play.',
];

/**
 * Hunt-Eat-Groom-Sleep sequence recommendation.
 */
export const HUNT_EAT_GROOM_SLEEP =
  'Follow the natural feline cycle: HUNT (play session simulating predatory sequence) \u2192 EAT (offer a small meal or treat immediately after) \u2192 GROOM (cat will naturally groom) \u2192 SLEEP (cat will rest). This sequence produces the most satisfying and behaviorally complete play experience. Schedule play sessions before mealtimes when possible.';

export const DISCLAIMER =
  'All calorie estimates are approximate and based on standard veterinary energy equations (RER/MER) with conservative intensity multipliers. There is not strong direct published data for "kcal/min of cat play." Actual energy expenditure varies significantly based on individual metabolism, ambient temperature, play intensity, health status, and other factors. These figures are for general guidance only and should not replace veterinary advice. Consult a veterinarian for any weight-management program or if your cat shows signs of illness, injury, or distress during play. This app does not provide veterinary diagnosis.';
