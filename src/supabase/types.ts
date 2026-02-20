export type EnergyLevel = 'couch_potato' | 'balanced' | 'wild_hunter';

export interface Profile {
  id: string;
  display_name: string | null;
  created_at: string;
}

export interface Cat {
  id: string;
  owner_id: string;
  name: string;
  breed: string | null;
  age_years: number | null;
  weight_kg: number | null;
  energy_level: EnergyLevel;
  emoji: string;
  image_base64: string | null;
  created_at: string;
}

export interface PlaySession {
  id: string;
  cat_id: string;
  owner_id: string;
  activity_type: string;
  duration_minutes: number;
  notes: string | null;
  played_at: string;
}

export interface CatInsert {
  name: string;
  breed?: string | null;
  age_years?: number | null;
  weight_kg?: number | null;
  energy_level?: EnergyLevel;
  emoji?: string;
  image_base64?: string | null;
}

export interface SessionInsert {
  cat_id: string;
  activity_type: string;
  duration_minutes: number;
  notes?: string | null;
  played_at?: string;
}
