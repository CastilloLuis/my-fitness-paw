import { describe, it, expect } from 'vitest';
import { ACTIVITIES, THINGS_TO_AVOID, getActivityById, getActivitiesByCategory } from '../activities';
import type { Activity } from '../types';

describe('ACTIVITIES catalog', () => {
  it('has unique IDs', () => {
    const ids = ACTIVITIES.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('all entries have required fields', () => {
    for (const activity of ACTIVITIES) {
      expect(activity.id).toBeTruthy();
      expect(activity.displayName).toBeTruthy();
      expect(activity.category).toBeTruthy();
      expect(activity.examples.length).toBeGreaterThan(0);
      expect(['low', 'moderate', 'high']).toContain(activity.intensity);
      expect(['low', 'moderate', 'high']).toContain(activity.jointImpact);
      expect(['none', 'low', 'medium', 'high']).toContain(activity.supervision);
      expect(Array.isArray(activity.hazardTags)).toBe(true);
      expect(Array.isArray(activity.safetyRules)).toBe(true);
      expect(activity.safetyRules.length).toBeGreaterThan(0);
      expect(activity.recommendedSessionStructure).toBeTruthy();
    }
  });

  // --- Required categories ---

  it('has chase & pounce category', () => {
    const items = getActivitiesByCategory('chase_and_pounce');
    expect(items.length).toBeGreaterThan(0);
  });

  it('has prey mimic category', () => {
    const items = getActivitiesByCategory('prey_mimic');
    expect(items.length).toBeGreaterThan(0);
  });

  it('has hide & ambush category', () => {
    const items = getActivitiesByCategory('hide_and_ambush');
    expect(items.length).toBeGreaterThan(0);
  });

  it('has foraging/food play category', () => {
    const items = getActivitiesByCategory('foraging_food_play');
    expect(items.length).toBeGreaterThan(0);
  });

  it('has kick & wrestle category', () => {
    const items = getActivitiesByCategory('kick_and_wrestle');
    expect(items.length).toBeGreaterThan(0);
  });

  it('has noise & novelty category', () => {
    const items = getActivitiesByCategory('noise_and_novelty');
    expect(items.length).toBeGreaterThan(0);
  });

  it('has climb/vertical space category', () => {
    const items = getActivitiesByCategory('climb_vertical_space');
    expect(items.length).toBeGreaterThan(0);
  });

  it('has scratch & play category', () => {
    const items = getActivitiesByCategory('scratch_and_play');
    expect(items.length).toBeGreaterThan(0);
  });

  it('has automated toys category', () => {
    const items = getActivitiesByCategory('automated_toys');
    expect(items.length).toBeGreaterThan(0);
  });

  it('has laser pointer category', () => {
    const items = getActivitiesByCategory('laser_pointer');
    expect(items.length).toBeGreaterThan(0);
  });

  // --- Laser pointer special rules ---

  it('laser pointer includes "end with catchable toy" rule', () => {
    const laser = getActivityById('laser_pointer');
    expect(laser).toBeDefined();
    expect(laser!.safetyRules.some((r) =>
      r.toLowerCase().includes('end') &&
      (r.toLowerCase().includes('physical') || r.toLowerCase().includes('catch'))
    )).toBe(true);
  });

  it('laser pointer has eye_risk hazard tag', () => {
    const laser = getActivityById('laser_pointer');
    expect(laser!.hazardTags).toContain('eye_risk');
  });

  it('laser pointer has frustration hazard tag', () => {
    const laser = getActivityById('laser_pointer');
    expect(laser!.hazardTags).toContain('frustration');
  });

  it('laser pointer requires high supervision', () => {
    const laser = getActivityById('laser_pointer');
    expect(laser!.supervision).toBe('high');
  });

  // --- Wand/feather safety ---

  it('wand teaser warns about string ingestion', () => {
    const wand = getActivityById('prey_mimic_wand');
    expect(wand).toBeDefined();
    expect(wand!.safetyRules.some((r) =>
      r.toLowerCase().includes('never leave') && r.toLowerCase().includes('unattended')
    )).toBe(true);
    expect(wand!.hazardTags).toContain('linear_foreign_body');
  });
});

describe('getActivityById', () => {
  it('returns activity for valid ID', () => {
    const activity = getActivityById('laser_pointer');
    expect(activity).toBeDefined();
    expect(activity!.displayName).toBe('Laser Pointer');
  });

  it('returns undefined for invalid ID', () => {
    expect(getActivityById('nonexistent')).toBeUndefined();
  });
});

describe('THINGS_TO_AVOID', () => {
  it('has items for all required hazardous materials', () => {
    const items = THINGS_TO_AVOID.map((t) => t.item.toLowerCase());
    expect(items.some((i) => i.includes('string') || i.includes('yarn'))).toBe(true);
    expect(items.some((i) => i.includes('ribbon') || i.includes('tinsel'))).toBe(true);
    expect(items.some((i) => i.includes('rubber band'))).toBe(true);
    expect(items.some((i) => i.includes('hair tie') || i.includes('elastic'))).toBe(true);
  });

  it('all avoid items have linear_foreign_body or choking hazard tag', () => {
    for (const item of THINGS_TO_AVOID) {
      const hasSafetyTag =
        item.hazardTags.includes('linear_foreign_body') ||
        item.hazardTags.includes('choking') ||
        item.hazardTags.includes('entanglement');
      expect(hasSafetyTag).toBe(true);
    }
  });

  it('string/yarn entry mentions linear foreign body', () => {
    const string = THINGS_TO_AVOID.find((t) => t.item.toLowerCase().includes('string'));
    expect(string).toBeDefined();
    expect(string!.reason.toLowerCase()).toContain('linear foreign body');
    expect(string!.hazardTags).toContain('linear_foreign_body');
  });

  it('all items have non-empty reason', () => {
    for (const item of THINGS_TO_AVOID) {
      expect(item.reason.length).toBeGreaterThan(10);
    }
  });
});
