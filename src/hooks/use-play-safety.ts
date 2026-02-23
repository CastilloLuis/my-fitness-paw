import { useMemo } from 'react';
import i18n from '@/src/i18n';
import { buildSafetyConstraints, classifyObesityStatus } from '@/src/lib/cat-fitness/energy';
import { yearsToMonths } from '@/src/lib/cat-fitness/life-stage';
import type { SafetyConstraints, ObesityStatus, CatProfile } from '@/src/lib/cat-fitness/types';
import type { Cat } from '@/src/supabase/types';

export interface PlaySafety {
  obesityStatus: ObesityStatus;
  safety: SafetyConstraints;
  /** Max continuous play in milliseconds */
  maxContinuousMs: number;
  /** Whether any safety limits apply (overweight/obese) */
  hasLimits: boolean;
  /** Short label for the timer warning */
  timerWarning: string | null;
}

/**
 * Compute play safety constraints for a cat.
 * Uses the cat-fitness algorithm's weight-based heuristic
 * when BCS is not available in the database.
 */
export function usePlaySafety(cat: Cat | null | undefined): PlaySafety | null {
  return useMemo(() => {
    if (!cat || cat.weight_kg == null) return null;

    const profile: CatProfile = {
      age_months: yearsToMonths(cat.age_years),
      weight_kg: cat.weight_kg,
      mobility_limitations: false,
      energy_level: cat.energy_level,
    };

    const obesityStatus = classifyObesityStatus(profile);
    const safety = buildSafetyConstraints(obesityStatus, profile);

    const maxContinuousMs = safety.maxContinuousMinutes.max * 60 * 1000;

    const hasLimits = obesityStatus === 'overweight' || obesityStatus === 'obese';

    let timerWarning: string | null = null;
    if (obesityStatus === 'obese') {
      timerWarning = i18n.t('catFitness.obeseTimerWarning', { min: safety.maxContinuousMinutes.min, max: safety.maxContinuousMinutes.max });
    } else if (obesityStatus === 'overweight') {
      timerWarning = i18n.t('catFitness.overweightTimerWarning', { min: safety.maxContinuousMinutes.min, max: safety.maxContinuousMinutes.max });
    }

    return { obesityStatus, safety, maxContinuousMs, hasLimits, timerWarning };
  }, [cat?.id, cat?.weight_kg, cat?.age_years, cat?.energy_level]);
}
