// ============================================
// Energy Calculations: RER, MER, Play Calorie Estimation
//
// RER (Resting Energy Requirement):
//   Exponential: 70 × (weightKg ^ 0.75)  — works for all weights
//   Linear:      30 × weightKg + 70       — alternate, less accurate at extremes
//
// MER (Maintenance Energy Requirement):
//   MER = RER × life-stage multiplier
//
// Play calorie estimation:
//   restingKcalPerMin = RER / 1440
//   totalKcalDuringPlay = restingKcalPerMin × intensityMultiplier × durationMinutes
//   extraKcalAboveRest  = restingKcalPerMin × (intensityMultiplier - 1) × durationMinutes
//
// Sources: see README.md for full citations
// ============================================

import type {
  CatProfile,
  Intensity,
  ObesityStatus,
  MERGoal,
  RERMethod,
  RERResult,
  MERResult,
  SafetyConstraints,
  PlayCalorieResult,
  PlayPlanRecommendation,
  ProgressionWeek,
  Range,
} from './types';
import { classifyLifeStage } from './life-stage';
import { getActivityById } from './activities';

// --- Constants ---

const MINUTES_PER_DAY = 1440;

/** Activity intensity multipliers over resting metabolic rate */
const INTENSITY_MULTIPLIERS: Record<Intensity, number> = {
  low: 2.0,
  moderate: 3.0,
  high: 5.0,
};

/** MER life-stage multipliers (starting points — adjust based on weight trend + BCS) */
const MER_MULTIPLIERS: Record<string, { factor: number; label: string }> = {
  kitten: { factor: 2.5, label: 'Kitten/juvenile (<1 year)' },
  neutered_adult: { factor: 1.2, label: 'Typical neutered adult' },
  intact_adult: { factor: 1.4, label: 'Intact adult' },
  weight_loss: { factor: 1.0, label: 'Obesity-prone / weight-loss baseline' },
};

// --- Stop rules with medical context ---

const EMERGENCY_STOP_RULES: string[] = [
  'Open-mouth breathing or panting that persists after play stops — cats should NOT pant like dogs; persistent panting indicates overexertion or respiratory distress. STOP immediately and monitor. Seek veterinary care if it continues beyond 2–3 minutes of rest. (AAHA, PDSA)',
  'Collapse or inability to stand — stop all activity immediately and seek emergency veterinary care.',
  'Blue, purple, or pale/white gums (cyanosis) — indicates severe oxygen deprivation. This is a veterinary emergency.',
  'Severe lethargy or unresponsiveness during or after play — stop immediately and contact your veterinarian.',
  'Coughing, gagging, or wheezing — may indicate respiratory distress, asthma exacerbation, or airway obstruction. Stop play and consult your vet.',
  'Vomiting during or immediately after play.',
  'Limping, favoring a limb, or crying out in pain — stop and assess for injury.',
  'Aggression escalation (hissing, growling, flattened ears, stiff body with dilated pupils) — cat is overstimulated. End session calmly.',
  'Hiding or actively fleeing the play area — respect the cat\'s choice to stop.',
  'Excessive drooling during play (not food-related).',
];

// --- Input validation ---

function validatePositive(value: number, name: string): void {
  if (typeof value !== 'number' || !isFinite(value) || value <= 0) {
    throw new Error(`${name} must be a positive number, got: ${value}`);
  }
}

function validateBCS(bcs: number): void {
  if (!Number.isInteger(bcs) || bcs < 1 || bcs > 9) {
    throw new Error(`BCS must be an integer between 1 and 9, got: ${bcs}`);
  }
}

// --- Obesity classification ---

/**
 * Classify obesity status from BCS (preferred) or weight heuristic.
 *
 * With BCS:
 *   - BCS >= 8 → obese
 *   - BCS >= 7 → overweight
 *   - BCS 4–6 → normal
 *   - BCS 1–3 → normal (underweight, but not obese)
 *
 * Without BCS (soft heuristic only — do NOT claim diagnosis):
 *   - weightKg > 6.5 → overweight (heuristic)
 *   - weightKg > 5.5 → unknown (possible overweight depending on frame)
 *   - else → unknown
 *
 * Source: Cornell Feline Health Center — Obesity
 */
export function classifyObesityStatus(profile: CatProfile): ObesityStatus {
  const bcs = profile.bcs9 ?? profile.body_condition_score_1_to_9;
  if (bcs != null) {
    validateBCS(bcs);
    if (bcs >= 8) return 'obese';
    if (bcs >= 7) return 'overweight';
    return 'normal';
  }
  // Weight-only heuristic — less reliable
  if (profile.weight_kg > 6.5) return 'overweight';
  if (profile.weight_kg <= 5.5) return 'normal';
  return 'unknown';
}

// --- RER ---

/**
 * Calculate Resting Energy Requirement (RER).
 *
 * Exponential (default): RER = 70 × (weightKg ^ 0.75) kcal/day
 * Linear (alternate):    RER = 30 × weightKg + 70 kcal/day
 *
 * Sources:
 * - WSAVA Feeding Instructions (exponential formula)
 * - MSD Vet Manual (RER formula and caveat that any formula is a starting point)
 * - Pet Nutrition Alliance RER/MER overview
 */
export function calcRER(weightKg: number, method: RERMethod = 'exponential'): RERResult {
  validatePositive(weightKg, 'weightKg');

  let rerKcalPerDay: number;
  if (method === 'linear') {
    rerKcalPerDay = 30 * weightKg + 70;
  } else {
    rerKcalPerDay = 70 * Math.pow(weightKg, 0.75);
  }

  return {
    rerKcalPerDay: Math.round(rerKcalPerDay * 10) / 10,
    method,
    weightKg,
  };
}

// --- MER ---

/**
 * Calculate Maintenance Energy Requirement (MER).
 *
 * MER = RER × life-stage multiplier
 *
 * Multipliers (starting points — adjust based on weight trend + BCS):
 *   - Kitten (<1 year): ~2.5 × RER
 *   - Neutered adult:   ~1.2 × RER
 *   - Intact adult:     ~1.4 × RER
 *   - Weight loss:      ~1.0 × RER
 *
 * Sources:
 * - MSD/Merck Daily Maintenance Energy Requirements table
 * - AAHA Weight Management Guidelines
 */
export function calcMER(params: {
  weightKg: number;
  ageYears?: number;
  neutered?: boolean | null;
  goal?: MERGoal;
}): MERResult {
  const { weightKg, ageYears, neutered, goal } = params;
  validatePositive(weightKg, 'weightKg');

  const rer = calcRER(weightKg);

  let multiplierKey: string;
  if (goal === 'weight_loss') {
    multiplierKey = 'weight_loss';
  } else if (goal === 'growth' || (ageYears != null && ageYears < 1)) {
    multiplierKey = 'kitten';
  } else if (neutered === false) {
    multiplierKey = 'intact_adult';
  } else {
    // Default to neutered adult (most common scenario)
    multiplierKey = 'neutered_adult';
  }

  const { factor, label } = MER_MULTIPLIERS[multiplierKey];
  const merKcalPerDay = rer.rerKcalPerDay * factor;

  return {
    rerKcalPerDay: rer.rerKcalPerDay,
    merKcalPerDay: Math.round(merKcalPerDay * 10) / 10,
    multiplier: factor,
    multiplierLabel: label,
    weightKg,
  };
}

// --- Safety constraints ---

/**
 * Build safety constraints based on obesity status and health conditions.
 *
 * Obese (BCS >= 8):
 *   - Max continuous: 3–5 min (low intensity), rest break required
 *   - Daily total: 10–15 min split into 2–4 micro-sessions
 *   - Ramp: +10–20% per week if tolerated
 *
 * Overweight (BCS = 7):
 *   - Max continuous: 5–8 min
 *   - Daily total: 15–25 min split into sessions
 *
 * Normal (BCS 4–6):
 *   - Max continuous: 10–15 min typical adult play sessions
 *
 * Sources: AAHA, VCA, Cornell
 */
export function buildSafetyConstraints(
  obesityStatus: ObesityStatus,
  profile: CatProfile
): SafetyConstraints {
  const warnings: string[] = [];
  let maxContinuous: Range;
  let breakMinutes: number;
  let dailyTotal: Range;
  let sessionsPerDay: Range;
  let intensityCap: Intensity;
  let restSuggestion: string | null = null;

  switch (obesityStatus) {
    case 'obese':
      maxContinuous = { min: 3, max: 5, unit: 'minutes' };
      breakMinutes = 10;
      dailyTotal = { min: 10, max: 15, unit: 'minutes' };
      sessionsPerDay = { min: 2, max: 4, unit: 'sessions' };
      intensityCap = 'low';
      restSuggestion =
        'After each micro-session (3–5 min), allow a full rest period of at least 10 minutes. If the cat shows any signs of heavy breathing, extend rest to 30 minutes or more. Increase session duration by only 10–20% per week if the cat tolerates it without distress.';
      warnings.push(
        'This cat is classified as obese (BCS 8–9). Obesity places extra strain on the heart, lungs, and joints. Play sessions must be short, low-intensity micro-sessions with mandatory rest breaks. Consult your veterinarian before starting any exercise program.'
      );
      warnings.push(
        'Obese cats are at increased risk of respiratory distress during exertion. Watch closely for open-mouth breathing, panting, or reluctance to continue. Stop immediately if any of these occur.'
      );
      break;

    case 'overweight':
      maxContinuous = { min: 5, max: 8, unit: 'minutes' };
      breakMinutes = 5;
      dailyTotal = { min: 15, max: 25, unit: 'minutes' };
      sessionsPerDay = { min: 2, max: 4, unit: 'sessions' };
      intensityCap = 'moderate';
      restSuggestion =
        'Rest for at least 5 minutes between sessions. Increase duration by 10–20% per week if tolerated. If the cat is not yet used to regular play, start at the lower end and progress gradually over 3–4 weeks.';
      warnings.push(
        'This cat is classified as overweight (BCS 7). Sessions should be shorter and more frequent with moderate intensity. Gradual ramps are important — do not push for rapid increases in duration or intensity.'
      );
      break;

    default: // normal or unknown
      maxContinuous = { min: 10, max: 15, unit: 'minutes' };
      breakMinutes = 3;
      dailyTotal = { min: 20, max: 40, unit: 'minutes' };
      sessionsPerDay = { min: 2, max: 3, unit: 'sessions' };
      intensityCap = 'high';
      break;
  }

  // Additional warnings for specific conditions
  if (profile.known_cardiac_or_resp_disease) {
    intensityCap = 'low';
    maxContinuous = { min: 2, max: 4, unit: 'minutes' };
    breakMinutes = Math.max(breakMinutes, 15);
    restSuggestion =
      'This cat has known cardiac or respiratory disease. Only very gentle, low-intensity activity is recommended. Rest for at least 15 minutes between sessions. Consult your veterinarian for a specific exercise plan.';
    warnings.push(
      'KNOWN CARDIAC OR RESPIRATORY DISEASE: Only very gentle, supervised play is appropriate. Stop at the first sign of labored breathing, coughing, or fatigue. Your veterinarian should approve any exercise program.'
    );
  }

  if (profile.ambient_hot) {
    // Reduce effort in heat
    if (maxContinuous.max > 5) {
      maxContinuous = { min: Math.max(2, maxContinuous.min - 2), max: Math.max(4, maxContinuous.max - 3), unit: 'minutes' };
    }
    warnings.push(
      'Hot ambient temperature detected. Cats dissipate heat poorly. Reduce session length and intensity. Ensure fresh water is available. Stop play if any panting occurs.'
    );
  }

  if (profile.mobility_limitations) {
    intensityCap = 'low';
    warnings.push(
      'Mobility limitations present. Only low-impact, ground-level activities recommended. Avoid jumping or climbing.'
    );
  }

  const lifeStage = classifyLifeStage(profile.age_months);
  if (lifeStage === 'senior') {
    if (intensityCap === 'high') intensityCap = 'moderate';
    if (maxContinuous.max > 12) {
      maxContinuous = { ...maxContinuous, max: 12 };
    }
    warnings.push(
      'Senior cat: monitor closely for signs of pain or fatigue. Seniors may need longer warm-up periods and gentler activities.'
    );
  }

  if (profile.age_months > 180) {
    warnings.push(
      'Geriatric cat (15+ years): increased veterinary monitoring recommended. Very gentle play only.'
    );
  }

  return {
    maxContinuousMinutes: maxContinuous,
    recommendedBreakMinutes: breakMinutes,
    recommendedDailyTotalMinutes: dailyTotal,
    recommendedSessionsPerDay: sessionsPerDay,
    intensityCap,
    stopRules: EMERGENCY_STOP_RULES,
    warnings,
    restSuggestion,
  };
}

// --- Play calorie estimation ---

/**
 * Estimate calories burned during a play session.
 *
 * Model:
 *   restingKcalPerMin = RER / 1440
 *   totalKcalDuringPlay = restingKcalPerMin × intensityMultiplier × durationMinutes
 *   extraKcalAboveRest  = restingKcalPerMin × (intensityMultiplier - 1) × durationMinutes
 *
 * IMPORTANT: This is an explicit approximation. There is not strong direct
 * published data for "kcal/min of cat play." This model uses standard vet
 * energy equations and conservative intensity multipliers for UX estimation.
 *
 * Sources: see README for full citations on measurement limitations
 */
export function estimatePlayCalories(params: {
  weightKg: number;
  ageYears?: number;
  activityId?: string;
  durationMinutes: number;
  neutered?: boolean | null;
  bcs9?: number;
  intensity?: Intensity;
  ambientHot?: boolean;
  knownCardiacOrRespDisease?: boolean;
}): PlayCalorieResult {
  const {
    weightKg,
    ageYears,
    activityId,
    durationMinutes,
    neutered,
    bcs9,
    intensity: overrideIntensity,
    ambientHot,
    knownCardiacOrRespDisease,
  } = params;

  validatePositive(weightKg, 'weightKg');
  validatePositive(durationMinutes, 'durationMinutes');

  // Determine intensity
  let intensityLevel: Intensity = overrideIntensity ?? 'moderate';
  if (activityId && !overrideIntensity) {
    const activity = getActivityById(activityId);
    if (activity) {
      intensityLevel = activity.intensity;
    }
  }

  // Build profile for safety
  const profile: CatProfile = {
    age_months: ageYears != null ? Math.round(ageYears * 12) : 36,
    weight_kg: weightKg,
    bcs9,
    neutered,
    mobility_limitations: false,
    ambient_hot: ambientHot,
    known_cardiac_or_resp_disease: knownCardiacOrRespDisease,
  };

  const obesityStatus = classifyObesityStatus(profile);
  const safety = buildSafetyConstraints(obesityStatus, profile);

  // Cap intensity based on safety
  if (
    (safety.intensityCap === 'low' && intensityLevel !== 'low') ||
    (safety.intensityCap === 'moderate' && intensityLevel === 'high')
  ) {
    intensityLevel = safety.intensityCap;
    safety.warnings.push(
      `Intensity was capped to "${safety.intensityCap}" based on this cat's health profile.`
    );
  }

  // Duration warning
  if (durationMinutes > safety.maxContinuousMinutes.max) {
    safety.warnings.push(
      `Requested duration (${durationMinutes} min) exceeds the recommended maximum continuous play of ${safety.maxContinuousMinutes.min}–${safety.maxContinuousMinutes.max} min for this cat. Break the session into shorter segments with rest periods of at least ${safety.recommendedBreakMinutes} minutes between them.`
    );
  }

  // Calculate RER + MER
  const rer = calcRER(weightKg);
  let mer: MERResult | null = null;
  if (ageYears != null || neutered != null) {
    mer = calcMER({ weightKg, ageYears, neutered });
  }

  // Play calorie estimation
  const restingKcalPerMin = rer.rerKcalPerDay / MINUTES_PER_DAY;
  const multiplier = INTENSITY_MULTIPLIERS[intensityLevel];
  const totalKcalDuringPlay = restingKcalPerMin * multiplier * durationMinutes;
  const extraKcalAboveRest = restingKcalPerMin * (multiplier - 1) * durationMinutes;

  return {
    rerKcalPerDay: rer.rerKcalPerDay,
    merKcalPerDay: mer?.merKcalPerDay ?? null,
    restingKcalPerMin: Math.round(restingKcalPerMin * 1000) / 1000,
    totalKcalDuringPlay: Math.round(totalKcalDuringPlay * 10) / 10,
    extraKcalAboveRest: Math.round(extraKcalAboveRest * 10) / 10,
    intensityMultiplier: multiplier,
    intensityLevel,
    durationMinutes,
    obesityStatus,
    safety,
  };
}

// --- Play plan recommendation ---

/**
 * Recommend a play plan based on cat profile with safety constraints
 * and a progressive ramp schedule.
 *
 * Sources:
 * - AAHA: 2–3 sessions, 10–15 min; short bursts
 * - VCA: obese cats — increase activity gradually
 * - Cornell: cardiovascular burden in obese cats
 */
export function recommendPlayPlan(params: {
  weightKg: number;
  ageYears?: number;
  neutered?: boolean | null;
  bcs9?: number;
  mobilityLimitations?: boolean;
  knownCardiacOrRespDisease?: boolean;
  ambientHot?: boolean;
}): PlayPlanRecommendation {
  const {
    weightKg,
    ageYears,
    neutered,
    bcs9,
    mobilityLimitations,
    knownCardiacOrRespDisease,
    ambientHot,
  } = params;

  validatePositive(weightKg, 'weightKg');

  const profile: CatProfile = {
    age_months: ageYears != null ? Math.round(ageYears * 12) : 36,
    weight_kg: weightKg,
    bcs9,
    neutered,
    mobility_limitations: mobilityLimitations ?? false,
    known_cardiac_or_resp_disease: knownCardiacOrRespDisease,
    ambient_hot: ambientHot,
  };

  const obesityStatus = classifyObesityStatus(profile);
  const lifeStage = classifyLifeStage(profile.age_months);
  const safety = buildSafetyConstraints(obesityStatus, profile);

  // Build progression plan
  const progressionPlan = buildProgressionPlan(obesityStatus, safety);

  return {
    obesityStatus,
    lifeStage,
    safety,
    progressionPlan,
  };
}

/**
 * Build a gradual progression plan.
 * Obese cats get 6 weeks (very slow ramp).
 * Overweight cats get 4 weeks.
 * Normal cats get 3 weeks (if starting from sedentary).
 */
function buildProgressionPlan(
  obesityStatus: ObesityStatus,
  safety: SafetyConstraints
): ProgressionWeek[] {
  const weeks: ProgressionWeek[] = [];
  const totalWeeks = obesityStatus === 'obese' ? 6 : obesityStatus === 'overweight' ? 4 : 3;

  const targetMinPerSession = safety.maxContinuousMinutes;
  const targetSessions = safety.recommendedSessionsPerDay;

  for (let week = 1; week <= totalWeeks; week++) {
    const fraction = week / totalWeeks;
    // Start at 50% of target and ramp to 100%
    const ramp = 0.5 + 0.5 * fraction;

    const sessionsPerDay = Math.max(
      1,
      Math.round(targetSessions.min + (targetSessions.max - targetSessions.min) * Math.min(fraction, 1))
    );

    const minPerSession: Range = {
      min: Math.max(2, Math.round(targetMinPerSession.min * ramp)),
      max: Math.max(3, Math.round(targetMinPerSession.max * ramp)),
      unit: 'minutes',
    };

    let notes: string;
    if (week === 1) {
      if (obesityStatus === 'obese') {
        notes = 'Start very gently. Focus on engagement, not exertion. Low intensity only. Stop immediately if any panting or heavy breathing occurs.';
      } else if (obesityStatus === 'overweight') {
        notes = 'Start gentle. Short sessions at low-to-moderate intensity. Monitor breathing throughout.';
      } else {
        notes = 'Introduce short play sessions. Focus on building a consistent routine.';
      }
    } else if (week === totalWeeks) {
      notes = 'Full target duration reached. Maintain this level. Continue to monitor for signs of fatigue.';
    } else {
      const pctIncrease = obesityStatus === 'obese' ? '10–15%' : '15–20%';
      notes = `Gradually increase session length by ${pctIncrease} from previous week. Monitor for fatigue and adjust accordingly.`;
    }

    weeks.push({ week, sessions_per_day: sessionsPerDay, minutes_per_session: minPerSession, notes });
  }

  return weeks;
}
