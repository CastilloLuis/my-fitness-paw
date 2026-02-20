// ============================================
// Cat Fitness Module — Type Definitions
// Self-contained, extractable package
// ============================================

// --- Enums ---

export type LifeStage = 'kitten' | 'young_adult' | 'mature_adult' | 'senior';
export type Intensity = 'low' | 'moderate' | 'high';
export type JointImpact = 'low' | 'moderate' | 'high';
export type Supervision = 'none' | 'low' | 'medium' | 'high';
export type WeightBand = 'lt_4kg' | '4_to_5_5kg' | 'gt_5_5kg';
export type ActivityType = 'stalk' | 'chase' | 'pounce' | 'jump' | 'climb' | 'forage' | 'kick' | 'bat';
export type ObesityStatus = 'unknown' | 'normal' | 'overweight' | 'obese';
export type MERGoal = 'maintenance' | 'weight_loss' | 'growth';
export type RERMethod = 'exponential' | 'linear';

// --- Core data types ---

export interface Range {
  min: number;
  max: number;
  unit: string;
}

// --- Cat profile (input) ---

export interface CatProfile {
  age_months: number;
  weight_kg: number;
  /** Body Condition Score on 1–9 scale. 1=emaciated, 5=ideal, 9=obese */
  body_condition_score_1_to_9?: number;
  /** Alias for body_condition_score_1_to_9 */
  bcs9?: number;
  /** Whether the cat is neutered/spayed */
  neutered?: boolean | null;
  mobility_limitations: boolean;
  energy_level?: 'couch_potato' | 'balanced' | 'wild_hunter';
  is_indoor_only?: boolean;
  is_anxious?: boolean;
  /** Hot ambient temperature (increases heat stress risk) */
  ambient_hot?: boolean;
  /** Known cardiac or respiratory disease */
  known_cardiac_or_resp_disease?: boolean;
}

// --- Activity catalog ---

export type HazardTag =
  | 'linear_foreign_body'
  | 'choking'
  | 'entanglement'
  | 'falls'
  | 'overstimulation'
  | 'eye_risk'
  | 'battery_ingestion'
  | 'frustration'
  | 'small_parts';

export interface Activity {
  id: string;
  displayName: string;
  category: string;
  examples: string[];
  intensity: Intensity;
  jointImpact: JointImpact;
  supervision: Supervision;
  hazardTags: HazardTag[];
  safetyRules: string[];
  recommendedSessionStructure: string;
}

export interface ThingToAvoid {
  item: string;
  reason: string;
  hazardTags: HazardTag[];
}

// --- Energy calculations ---

export interface RERResult {
  /** Resting Energy Requirement in kcal/day */
  rerKcalPerDay: number;
  method: RERMethod;
  weightKg: number;
}

export interface MERResult {
  rerKcalPerDay: number;
  merKcalPerDay: number;
  multiplier: number;
  multiplierLabel: string;
  weightKg: number;
}

export interface SafetyConstraints {
  maxContinuousMinutes: Range;
  recommendedBreakMinutes: number;
  recommendedDailyTotalMinutes: Range;
  recommendedSessionsPerDay: Range;
  intensityCap: Intensity;
  stopRules: string[];
  warnings: string[];
  restSuggestion: string | null;
}

export interface PlayCalorieResult {
  rerKcalPerDay: number;
  merKcalPerDay: number | null;
  restingKcalPerMin: number;
  totalKcalDuringPlay: number;
  extraKcalAboveRest: number;
  intensityMultiplier: number;
  intensityLevel: Intensity;
  durationMinutes: number;
  obesityStatus: ObesityStatus;
  safety: SafetyConstraints;
}

export interface PlayPlanRecommendation {
  obesityStatus: ObesityStatus;
  lifeStage: LifeStage;
  safety: SafetyConstraints;
  progressionPlan: ProgressionWeek[];
}

// --- Play plan ---

export interface IntensityProfile {
  level: Intensity;
  description: string;
}

export interface PlayPlan {
  life_stage: LifeStage;
  weight_band: WeightBand;
  intensity_profile: IntensityProfile;
  sessions_per_day_range: Range;
  minutes_per_session_range: Range;
  total_minutes_per_day_range: Range;
  days_per_week: number;
  progression_plan: ProgressionWeek[] | null;
  stop_rules: string[];
  cooldown_notes: string;
  hunt_eat_groom_sleep_sequence: string;
}

export interface ProgressionWeek {
  week: number;
  sessions_per_day: number;
  minutes_per_session: Range;
  notes: string;
}

// --- Toy recommendations ---

export interface ToyRecommendation {
  toy_category: string;
  label: string;
  emoji: string;
  activity_types: ActivityType[];
  intensity: Intensity;
  joint_impact: JointImpact;
  best_for_life_stages: LifeStage[];
  best_for_weight_bands: WeightBand[];
  session_structure: string;
  safety_notes: string[];
  suitability_score: number; // 0-1, computed for this cat
}

// --- Calorie tracking (backward compat with app) ---

export interface CalorieEstimate {
  intensity: Intensity;
  weight_band: WeightBand;
  kcal_per_10min: Range;
}

export interface SessionCalorieResult {
  activity_type: string;
  duration_minutes: number;
  estimated_kcal: Range;
  intensity: Intensity;
}

export interface DailyCalorieSummary {
  total_estimated_kcal: Range;
  sessions_count: number;
  total_minutes: number;
  breakdown: SessionCalorieResult[];
}

export interface WeeklyCalorieSummary {
  total_estimated_kcal: Range;
  daily_average_kcal: Range;
  total_sessions: number;
  total_minutes: number;
  active_days: number;
}

// --- Top-level insights ---

export interface CatInsights {
  profile: CatProfile;
  play_plan: PlayPlan;
  toy_recommendations: ToyRecommendation[];
  today_calories: DailyCalorieSummary | null;
  weekly_calories: WeeklyCalorieSummary | null;
  warnings: string[];
  disclaimer: string;
}
