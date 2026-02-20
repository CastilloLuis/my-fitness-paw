import { describe, it, expect } from 'vitest';
import {
  calcRER,
  calcMER,
  estimatePlayCalories,
  recommendPlayPlan,
  classifyObesityStatus,
  buildSafetyConstraints,
} from '../energy';
import type { CatProfile } from '../types';

// --- RER ---

describe('calcRER', () => {
  it('computes exponential RER for a 4.5 kg cat', () => {
    // RER = 70 * (4.5 ^ 0.75)
    const result = calcRER(4.5);
    expect(result.method).toBe('exponential');
    expect(result.weightKg).toBe(4.5);
    // 70 * 4.5^0.75 ≈ 70 * 3.09 ≈ 216.3
    expect(result.rerKcalPerDay).toBeCloseTo(216.3, 0);
  });

  it('computes exponential RER for a 3 kg cat', () => {
    // 70 * 3^0.75 ≈ 70 * 2.28 ≈ 159.4
    const result = calcRER(3);
    expect(result.rerKcalPerDay).toBeCloseTo(159.4, 0);
  });

  it('computes exponential RER for a 7 kg cat', () => {
    // 70 * 7^0.75 ≈ 70 * 4.30 ≈ 301.4
    const result = calcRER(7);
    expect(result.rerKcalPerDay).toBeCloseTo(301.4, 0);
  });

  it('computes linear RER for a 4.5 kg cat', () => {
    // 30 * 4.5 + 70 = 135 + 70 = 205
    const result = calcRER(4.5, 'linear');
    expect(result.method).toBe('linear');
    expect(result.rerKcalPerDay).toBe(205);
  });

  it('throws on invalid weight', () => {
    expect(() => calcRER(0)).toThrow();
    expect(() => calcRER(-1)).toThrow();
  });
});

// --- MER ---

describe('calcMER', () => {
  it('uses kitten multiplier (2.5) for cats under 1 year', () => {
    const result = calcMER({ weightKg: 3, ageYears: 0.5 });
    expect(result.multiplier).toBe(2.5);
    expect(result.merKcalPerDay).toBeCloseTo(result.rerKcalPerDay * 2.5, 0);
  });

  it('uses neutered adult multiplier (1.2) by default', () => {
    const result = calcMER({ weightKg: 4.5 });
    expect(result.multiplier).toBe(1.2);
  });

  it('uses intact adult multiplier (1.4) when neutered=false', () => {
    const result = calcMER({ weightKg: 4.5, neutered: false });
    expect(result.multiplier).toBe(1.4);
  });

  it('uses weight loss multiplier (1.0) when goal=weight_loss', () => {
    const result = calcMER({ weightKg: 6, goal: 'weight_loss' });
    expect(result.multiplier).toBe(1.0);
    expect(result.merKcalPerDay).toBeCloseTo(result.rerKcalPerDay, 0);
  });

  it('uses growth multiplier when goal=growth', () => {
    const result = calcMER({ weightKg: 3, goal: 'growth' });
    expect(result.multiplier).toBe(2.5);
  });
});

// --- Obesity classification ---

describe('classifyObesityStatus', () => {
  const base: CatProfile = {
    age_months: 36,
    weight_kg: 4.5,
    mobility_limitations: false,
  };

  it('returns obese for BCS >= 8', () => {
    expect(classifyObesityStatus({ ...base, bcs9: 8 })).toBe('obese');
    expect(classifyObesityStatus({ ...base, bcs9: 9 })).toBe('obese');
  });

  it('returns overweight for BCS = 7', () => {
    expect(classifyObesityStatus({ ...base, bcs9: 7 })).toBe('overweight');
  });

  it('returns normal for BCS 4-6', () => {
    expect(classifyObesityStatus({ ...base, bcs9: 4 })).toBe('normal');
    expect(classifyObesityStatus({ ...base, bcs9: 5 })).toBe('normal');
    expect(classifyObesityStatus({ ...base, bcs9: 6 })).toBe('normal');
  });

  it('returns normal for BCS 1-3 (underweight, not obese)', () => {
    expect(classifyObesityStatus({ ...base, bcs9: 1 })).toBe('normal');
    expect(classifyObesityStatus({ ...base, bcs9: 3 })).toBe('normal');
  });

  it('uses body_condition_score_1_to_9 alias', () => {
    expect(classifyObesityStatus({ ...base, body_condition_score_1_to_9: 8 })).toBe('obese');
  });

  it('uses weight heuristic when BCS missing', () => {
    expect(classifyObesityStatus({ ...base, weight_kg: 7 })).toBe('overweight');
    expect(classifyObesityStatus({ ...base, weight_kg: 4 })).toBe('normal');
    expect(classifyObesityStatus({ ...base, weight_kg: 5.8 })).toBe('unknown');
  });

  it('throws on invalid BCS', () => {
    expect(() => classifyObesityStatus({ ...base, bcs9: 0 })).toThrow();
    expect(() => classifyObesityStatus({ ...base, bcs9: 10 })).toThrow();
  });
});

// --- Safety constraints ---

describe('buildSafetyConstraints', () => {
  const base: CatProfile = {
    age_months: 36,
    weight_kg: 4.5,
    mobility_limitations: false,
  };

  it('enforces 3-5 min max continuous for obese cats', () => {
    const safety = buildSafetyConstraints('obese', base);
    expect(safety.maxContinuousMinutes.min).toBe(3);
    expect(safety.maxContinuousMinutes.max).toBe(5);
    expect(safety.intensityCap).toBe('low');
    expect(safety.recommendedBreakMinutes).toBe(10);
    expect(safety.restSuggestion).toBeTruthy();
  });

  it('enforces 5-8 min max continuous for overweight cats', () => {
    const safety = buildSafetyConstraints('overweight', base);
    expect(safety.maxContinuousMinutes.min).toBe(5);
    expect(safety.maxContinuousMinutes.max).toBe(8);
    expect(safety.intensityCap).toBe('moderate');
  });

  it('allows 10-15 min for normal cats', () => {
    const safety = buildSafetyConstraints('normal', base);
    expect(safety.maxContinuousMinutes.min).toBe(10);
    expect(safety.maxContinuousMinutes.max).toBe(15);
    expect(safety.intensityCap).toBe('high');
  });

  it('caps to low intensity for cardiac/resp disease', () => {
    const safety = buildSafetyConstraints('normal', {
      ...base,
      known_cardiac_or_resp_disease: true,
    });
    expect(safety.intensityCap).toBe('low');
    expect(safety.maxContinuousMinutes.max).toBeLessThanOrEqual(4);
    expect(safety.warnings.some((w) => w.includes('CARDIAC OR RESPIRATORY'))).toBe(true);
  });

  it('reduces duration in hot ambient', () => {
    const normalSafety = buildSafetyConstraints('normal', base);
    const hotSafety = buildSafetyConstraints('normal', { ...base, ambient_hot: true });
    expect(hotSafety.maxContinuousMinutes.max).toBeLessThan(normalSafety.maxContinuousMinutes.max);
  });

  it('includes stop rules', () => {
    const safety = buildSafetyConstraints('normal', base);
    expect(safety.stopRules.length).toBeGreaterThan(5);
    expect(safety.stopRules.some((r) => r.toLowerCase().includes('panting'))).toBe(true);
    expect(safety.stopRules.some((r) => r.toLowerCase().includes('collapse'))).toBe(true);
    expect(safety.stopRules.some((r) => r.toLowerCase().includes('cyanosis'))).toBe(true);
  });

  it('adds obese warnings', () => {
    const safety = buildSafetyConstraints('obese', base);
    expect(safety.warnings.some((w) => w.includes('obese'))).toBe(true);
    expect(safety.warnings.some((w) => w.includes('respiratory distress'))).toBe(true);
  });

  it('daily total for obese is 10-15 min', () => {
    const safety = buildSafetyConstraints('obese', base);
    expect(safety.recommendedDailyTotalMinutes.min).toBe(10);
    expect(safety.recommendedDailyTotalMinutes.max).toBe(15);
  });
});

// --- Play calorie estimation ---

describe('estimatePlayCalories', () => {
  it('computes calories using restingKcalPerMin * multiplier * duration', () => {
    const result = estimatePlayCalories({
      weightKg: 4.5,
      durationMinutes: 10,
      intensity: 'moderate',
    });

    // RER ≈ 221.4, restingKcalPerMin ≈ 221.4/1440 ≈ 0.1538
    // moderate multiplier = 3.0
    // totalKcalDuringPlay = 0.1538 * 3.0 * 10 ≈ 4.61
    expect(result.restingKcalPerMin).toBeCloseTo(0.154, 2);
    expect(result.intensityMultiplier).toBe(3.0);
    expect(result.totalKcalDuringPlay).toBeCloseTo(4.6, 0);

    // extraKcalAboveRest = 0.1538 * (3.0 - 1) * 10 ≈ 3.08
    expect(result.extraKcalAboveRest).toBeCloseTo(3.1, 0);
  });

  it('uses low multiplier (2.0) for low intensity', () => {
    const result = estimatePlayCalories({
      weightKg: 4.5,
      durationMinutes: 10,
      intensity: 'low',
    });
    expect(result.intensityMultiplier).toBe(2.0);
  });

  it('uses high multiplier (5.0) for high intensity', () => {
    const result = estimatePlayCalories({
      weightKg: 4.5,
      durationMinutes: 10,
      intensity: 'high',
    });
    expect(result.intensityMultiplier).toBe(5.0);
  });

  it('includes obesity status and safety constraints', () => {
    const result = estimatePlayCalories({
      weightKg: 6,
      durationMinutes: 15,
      bcs9: 8,
      intensity: 'high',
    });
    expect(result.obesityStatus).toBe('obese');
    expect(result.intensityLevel).toBe('low'); // capped
    expect(result.safety.warnings.length).toBeGreaterThan(0);
  });

  it('warns when duration exceeds max continuous', () => {
    const result = estimatePlayCalories({
      weightKg: 6,
      durationMinutes: 20,
      bcs9: 8,
    });
    expect(result.safety.warnings.some((w) => w.includes('exceeds'))).toBe(true);
  });

  it('caps intensity for obese cats', () => {
    const result = estimatePlayCalories({
      weightKg: 7,
      durationMinutes: 5,
      bcs9: 9,
      intensity: 'high',
    });
    expect(result.intensityLevel).toBe('low');
  });

  it('returns MER when enough info provided', () => {
    const result = estimatePlayCalories({
      weightKg: 4.5,
      ageYears: 3,
      neutered: true,
      durationMinutes: 10,
    });
    expect(result.merKcalPerDay).not.toBeNull();
  });

  it('resolves intensity from activityId', () => {
    const result = estimatePlayCalories({
      weightKg: 4.5,
      durationMinutes: 10,
      activityId: 'laser_pointer',
    });
    // laser_pointer has intensity 'high'
    expect(result.intensityLevel).toBe('high');
  });

  it('throws on invalid inputs', () => {
    expect(() => estimatePlayCalories({ weightKg: 0, durationMinutes: 10 })).toThrow();
    expect(() => estimatePlayCalories({ weightKg: 4.5, durationMinutes: -1 })).toThrow();
  });

  it('scales linearly with duration', () => {
    const r5 = estimatePlayCalories({ weightKg: 4.5, durationMinutes: 5, intensity: 'moderate' });
    const r10 = estimatePlayCalories({ weightKg: 4.5, durationMinutes: 10, intensity: 'moderate' });
    // Allow rounding tolerance: the formula is linear but rounding to 1 decimal causes small diffs
    expect(r10.totalKcalDuringPlay).toBeCloseTo(r5.totalKcalDuringPlay * 2, 0);
  });

  it('scales with weight (heavier cat burns more)', () => {
    const light = estimatePlayCalories({ weightKg: 3, durationMinutes: 10, intensity: 'moderate' });
    const heavy = estimatePlayCalories({ weightKg: 6, durationMinutes: 10, intensity: 'moderate' });
    expect(heavy.totalKcalDuringPlay).toBeGreaterThan(light.totalKcalDuringPlay);
  });
});

// --- Play plan recommendation ---

describe('recommendPlayPlan', () => {
  it('returns obese plan for BCS 8+', () => {
    const plan = recommendPlayPlan({ weightKg: 6, bcs9: 8 });
    expect(plan.obesityStatus).toBe('obese');
    expect(plan.safety.intensityCap).toBe('low');
    expect(plan.progressionPlan.length).toBe(6); // 6-week plan
  });

  it('returns overweight plan for BCS 7', () => {
    const plan = recommendPlayPlan({ weightKg: 5, bcs9: 7 });
    expect(plan.obesityStatus).toBe('overweight');
    expect(plan.progressionPlan.length).toBe(4); // 4-week plan
  });

  it('returns normal plan for healthy cat', () => {
    const plan = recommendPlayPlan({ weightKg: 4.5 });
    expect(plan.obesityStatus).toBe('normal');
    expect(plan.progressionPlan.length).toBe(3); // 3-week plan
  });

  it('progression plan weeks are in order', () => {
    const plan = recommendPlayPlan({ weightKg: 6, bcs9: 8 });
    for (let i = 0; i < plan.progressionPlan.length; i++) {
      expect(plan.progressionPlan[i].week).toBe(i + 1);
    }
  });

  it('progression plan minutes increase over weeks', () => {
    const plan = recommendPlayPlan({ weightKg: 6, bcs9: 8 });
    const firstWeekMax = plan.progressionPlan[0].minutes_per_session.max;
    const lastWeekMax = plan.progressionPlan[plan.progressionPlan.length - 1].minutes_per_session.max;
    expect(lastWeekMax).toBeGreaterThanOrEqual(firstWeekMax);
  });
});
