import type { CatProfile, PlayPlan, ProgressionWeek, IntensityProfile, Range } from './types';
import { classifyLifeStage, classifyWeightBand, isOverweight, isObese, isUnderweight } from './life-stage';
import { buildSafetyConstraints, classifyObesityStatus } from './energy';
import {
  BASELINE_INDOOR_TABLE,
  OVERWEIGHT_MODIFIERS,
  OBESE_MODIFIERS,
  SENIOR_MOBILITY_MODIFIERS,
  STOP_RULES,
  HUNT_EAT_GROOM_SLEEP,
} from './knowledge-base';

/**
 * Generate a personalized play plan for a cat based on their profile.
 *
 * Now includes obesity-aware safety constraints:
 * - Obese (BCS >= 8): 3–5 min micro-sessions, low intensity, mandatory rest
 * - Overweight (BCS 7): 5–8 min sessions, moderate cap
 * - Normal: standard play plan
 *
 * Sources: AAHA, VCA, Cornell
 */
export function generatePlayPlan(profile: CatProfile): PlayPlan {
  const lifeStage = classifyLifeStage(profile.age_months);
  const weightBand = classifyWeightBand(profile.weight_kg);
  const overweight = isOverweight(profile);
  const obese = isObese(profile);
  const underweight = isUnderweight(profile);
  const obesityStatus = classifyObesityStatus(profile);

  // Get safety constraints from the energy module
  const safety = buildSafetyConstraints(obesityStatus, profile);

  // Find baseline from table
  let baseline = BASELINE_INDOOR_TABLE.find(
    (row) => row.life_stage === lifeStage && row.weight_band === weightBand
  );
  if (!baseline) {
    baseline = BASELINE_INDOOR_TABLE.find((row) => row.life_stage === lifeStage);
  }
  if (!baseline) {
    baseline = BASELINE_INDOOR_TABLE[4]; // young_adult, 4_to_5_5kg
  }

  let sessionsPerDay: Range = { ...baseline.sessions_per_day };
  let minutesPerSession: Range = { ...baseline.minutes_per_session };
  let totalMinutesPerDay: Range = { ...baseline.total_minutes_per_day };
  let intensityLevel = baseline.intensity as 'low' | 'moderate' | 'high';
  const daysPerWeek = 7;
  let progressionPlan: ProgressionWeek[] | null = null;

  // === Obese cat overrides (strictest) ===
  if (obese) {
    sessionsPerDay = { ...OBESE_MODIFIERS.sessions_per_day_range };
    minutesPerSession = { ...OBESE_MODIFIERS.max_continuous_minutes };
    totalMinutesPerDay = { ...OBESE_MODIFIERS.daily_total_minutes };
    intensityLevel = OBESE_MODIFIERS.intensity_cap;
    // 6-week progression for obese cats
    progressionPlan = generateProgressionPlan(sessionsPerDay, minutesPerSession, 'obese');
  }
  // === Overweight (not obese) adjustments ===
  else if (overweight) {
    sessionsPerDay = {
      min: sessionsPerDay.min + OVERWEIGHT_MODIFIERS.sessions_per_day_add,
      max: sessionsPerDay.max + OVERWEIGHT_MODIFIERS.sessions_per_day_add,
      unit: 'sessions',
    };
    minutesPerSession = {
      min: Math.max(3, Math.round(minutesPerSession.min * OVERWEIGHT_MODIFIERS.minutes_per_session_multiply)),
      max: Math.max(5, Math.round(minutesPerSession.max * OVERWEIGHT_MODIFIERS.minutes_per_session_multiply)),
      unit: 'minutes',
    };
    // Cap to safety max continuous
    minutesPerSession.max = Math.min(minutesPerSession.max, safety.maxContinuousMinutes.max);

    if (intensityLevel === 'high') {
      intensityLevel = OVERWEIGHT_MODIFIERS.intensity_cap;
    }
    progressionPlan = generateProgressionPlan(sessionsPerDay, minutesPerSession, 'overweight');
  }

  // === Senior + mobility limitations ===
  if (lifeStage === 'senior' && profile.mobility_limitations) {
    intensityLevel = SENIOR_MOBILITY_MODIFIERS.intensity_cap;
    minutesPerSession.max = Math.min(
      minutesPerSession.max,
      SENIOR_MOBILITY_MODIFIERS.minutes_per_session_max
    );
  }

  // === Known cardiac/respiratory disease ===
  if (profile.known_cardiac_or_resp_disease) {
    intensityLevel = 'low';
    minutesPerSession = {
      min: Math.min(minutesPerSession.min, 3),
      max: Math.min(minutesPerSession.max, 5),
      unit: 'minutes',
    };
    if (!progressionPlan) {
      progressionPlan = generateProgressionPlan(sessionsPerDay, minutesPerSession, 'obese');
    }
  }

  // === Underweight adjustments ===
  if (underweight) {
    minutesPerSession = {
      min: Math.max(3, minutesPerSession.min - 2),
      max: Math.max(5, minutesPerSession.max - 3),
      unit: 'minutes',
    };
    intensityLevel = intensityLevel === 'high' ? 'moderate' : intensityLevel;
  }

  // === Energy level personality adjustments ===
  if (!obese && !profile.known_cardiac_or_resp_disease) {
    if (profile.energy_level === 'wild_hunter') {
      totalMinutesPerDay = {
        min: Math.round(totalMinutesPerDay.min * 1.25),
        max: Math.round(totalMinutesPerDay.max * 1.25),
        unit: 'minutes',
      };
    } else if (profile.energy_level === 'couch_potato') {
      totalMinutesPerDay = {
        min: Math.round(totalMinutesPerDay.min * 0.75),
        max: totalMinutesPerDay.max,
        unit: 'minutes',
      };
      if (!progressionPlan) {
        progressionPlan = generateProgressionPlan(sessionsPerDay, minutesPerSession, 'normal');
      }
    }
  }

  // === Anxious cat adjustments ===
  if (profile.is_anxious) {
    sessionsPerDay = {
      min: Math.max(sessionsPerDay.min, 3),
      max: Math.max(sessionsPerDay.max, 4),
      unit: 'sessions',
    };
    minutesPerSession = {
      min: Math.min(minutesPerSession.min, 5),
      max: Math.min(minutesPerSession.max, 8),
      unit: 'minutes',
    };
    intensityLevel = intensityLevel === 'high' ? 'moderate' : intensityLevel;
  }

  // Recalculate total
  totalMinutesPerDay = {
    min: sessionsPerDay.min * minutesPerSession.min,
    max: sessionsPerDay.max * minutesPerSession.max,
    unit: 'minutes',
  };

  // Enforce safety daily total cap for obese/overweight
  if (obese) {
    totalMinutesPerDay.max = Math.min(totalMinutesPerDay.max, OBESE_MODIFIERS.daily_total_minutes.max);
  }

  const intensityDescriptions: Record<string, string> = {
    low: 'Gentle, ground-level play with slow-moving toys. Ideal for seniors, obese cats, cats with mobility issues, or warm-up/cool-down.',
    moderate: 'Active play with moderate bursts of running, pouncing, and batting. Good for most adult cats. Not suitable for obese cats without veterinary approval.',
    high: 'Vigorous play with sprinting, jumping, and intense chase sequences. Best for young, healthy cats at normal weight with high energy.',
  };

  const intensityProfile: IntensityProfile = {
    level: intensityLevel,
    description: intensityDescriptions[intensityLevel],
  };

  // Build stop rules — add obesity-specific ones
  const stopRules = [...STOP_RULES];
  if (obese) {
    stopRules.unshift(
      'OBESE CAT: Stop after each 3\u20135 minute micro-session even if the cat seems willing to continue. Mandatory rest break of at least 10 minutes. Resume only if breathing is normal and relaxed.'
    );
  }

  return {
    life_stage: lifeStage,
    weight_band: weightBand,
    intensity_profile: intensityProfile,
    sessions_per_day_range: sessionsPerDay,
    minutes_per_session_range: minutesPerSession,
    total_minutes_per_day_range: totalMinutesPerDay,
    days_per_week: daysPerWeek,
    progression_plan: progressionPlan,
    stop_rules: stopRules,
    cooldown_notes:
      'End each session by gradually slowing toy movement over 1\u20132 minutes. Let the cat make a final "kill" (catch the toy). This prevents frustration and allows heart rate to normalize.',
    hunt_eat_groom_sleep_sequence: HUNT_EAT_GROOM_SLEEP,
  };
}

function generateProgressionPlan(
  targetSessions: Range,
  targetMinutes: Range,
  category: 'obese' | 'overweight' | 'normal'
): ProgressionWeek[] {
  const weeks: ProgressionWeek[] = [];
  const totalWeeks = category === 'obese' ? 6 : category === 'overweight' ? 4 : 3;

  for (let week = 1; week <= totalWeeks; week++) {
    const fraction = week / totalWeeks;
    const ramp = 0.5 + 0.5 * fraction;

    const sessions = Math.max(
      1,
      Math.round(targetSessions.min + (targetSessions.max - targetSessions.min) * Math.min(fraction, 1))
    );
    const minMins = Math.max(2, Math.round(targetMinutes.min * ramp));
    const maxMins = Math.max(3, Math.round(targetMinutes.max * ramp));

    let notes: string;
    if (week === 1) {
      if (category === 'obese') {
        notes = 'Start very gently. 2\u20133 minute micro-sessions only. Low intensity. Stop immediately if any panting or heavy breathing occurs. Mandatory 10+ minute rest between sessions.';
      } else if (category === 'overweight') {
        notes = 'Start gentle. Focus on engagement over exertion. Stop if panting. Rest 5+ minutes between sessions.';
      } else {
        notes = 'Introduce short play sessions. Focus on building a routine.';
      }
    } else if (week === totalWeeks) {
      notes = 'Full target duration. Cat should be comfortable with this level. Continue to monitor for fatigue.';
    } else {
      const pctIncrease = category === 'obese' ? '10\u201315%' : '15\u201320%';
      notes = `Gradually increase session length by ${pctIncrease} from previous week. Monitor for fatigue.`;
    }

    weeks.push({
      week,
      sessions_per_day: sessions,
      minutes_per_session: { min: minMins, max: maxMins, unit: 'minutes' },
      notes,
    });
  }

  return weeks;
}
