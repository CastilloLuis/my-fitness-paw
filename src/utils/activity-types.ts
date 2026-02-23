export interface ActivityType {
  id: string;
  /** ID from the cat-fitness catalog (for calorie/safety lookups) */
  catalogId: string | null;
  label: string;
  /** i18n key for a short user-facing description */
  desc: string;
  emoji: string;
  color: string;
  minutesGoal: number;
}

export const ACTIVITY_TYPES: ActivityType[] = [
  { id: 'wand', catalogId: 'prey_mimic_wand', label: 'activities.wand', desc: 'activities.wandDesc', emoji: '\u{1FA84}', color: '#E98A2A', minutesGoal: 10 },
  { id: 'fetch', catalogId: 'chase_pounce_fetch', label: 'activities.fetch', desc: 'activities.fetchDesc', emoji: '\u{1F3C3}', color: '#2F7D57', minutesGoal: 10 },
  { id: 'laser', catalogId: 'laser_pointer', label: 'activities.laser', desc: 'activities.laserDesc', emoji: '\u{1F534}', color: '#B33A2B', minutesGoal: 5 },
  { id: 'puzzle', catalogId: 'foraging_puzzle_feeder', label: 'activities.puzzle', desc: 'activities.puzzleDesc', emoji: '\u{1F9E9}', color: '#6B8E6B', minutesGoal: 15 },
  { id: 'kicker', catalogId: 'kick_wrestle_kicker', label: 'activities.kicker', desc: 'activities.kickerDesc', emoji: '\u{1F41F}', color: '#C06040', minutesGoal: 8 },
  { id: 'hide', catalogId: 'hide_ambush_box', label: 'activities.hide', desc: 'activities.hideDesc', emoji: '\u{1F4E6}', color: '#8B7355', minutesGoal: 12 },
  { id: 'climb', catalogId: 'climb_vertical_tree', label: 'activities.climb', desc: 'activities.climbDesc', emoji: '\u{1F9D7}', color: '#5A7A8A', minutesGoal: 10 },
  { id: 'catnip', catalogId: 'catnip_silvervine', label: 'activities.catnip', desc: 'activities.catnipDesc', emoji: '\u{1F33F}', color: '#4A8A5A', minutesGoal: 10 },
  { id: 'free_roam', catalogId: null, label: 'activities.freeRoam', desc: 'activities.freeRoamDesc', emoji: '\u{1F43E}', color: '#8A5A3C', minutesGoal: 15 },
];

export function getActivityType(id: string): ActivityType | undefined {
  return ACTIVITY_TYPES.find((a) => a.id === id);
}
