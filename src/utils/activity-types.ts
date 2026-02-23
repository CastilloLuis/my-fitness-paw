export interface ActivityType {
  id: string;
  /** ID from the cat-fitness catalog (for calorie/safety lookups) */
  catalogId: string | null;
  label: string;
  emoji: string;
  color: string;
  minutesGoal: number;
}

export const ACTIVITY_TYPES: ActivityType[] = [
  { id: 'wand', catalogId: 'prey_mimic_wand', label: 'activities.wand', emoji: '\u{1FA84}', color: '#E98A2A', minutesGoal: 10 },
  { id: 'fetch', catalogId: 'chase_pounce_fetch', label: 'activities.fetch', emoji: '\u{1F3C3}', color: '#2F7D57', minutesGoal: 10 },
  { id: 'laser', catalogId: 'laser_pointer', label: 'activities.laser', emoji: '\u{1F534}', color: '#B33A2B', minutesGoal: 5 },
  { id: 'puzzle', catalogId: 'foraging_puzzle_feeder', label: 'activities.puzzle', emoji: '\u{1F9E9}', color: '#6B8E6B', minutesGoal: 15 },
  { id: 'kicker', catalogId: 'kick_wrestle_kicker', label: 'activities.kicker', emoji: '\u{1F41F}', color: '#C06040', minutesGoal: 8 },
  { id: 'hide', catalogId: 'hide_ambush_box', label: 'activities.hide', emoji: '\u{1F4E6}', color: '#8B7355', minutesGoal: 12 },
  { id: 'climb', catalogId: 'climb_vertical_tree', label: 'activities.climb', emoji: '\u{1F9D7}', color: '#5A7A8A', minutesGoal: 10 },
  { id: 'catnip', catalogId: 'catnip_silvervine', label: 'activities.catnip', emoji: '\u{1F33F}', color: '#4A8A5A', minutesGoal: 10 },
  { id: 'free_roam', catalogId: null, label: 'activities.freeRoam', emoji: '\u{1F43E}', color: '#8A5A3C', minutesGoal: 15 },
];

export function getActivityType(id: string): ActivityType | undefined {
  return ACTIVITY_TYPES.find((a) => a.id === id);
}
