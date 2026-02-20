import { supabase } from '../client';
import type { Cat, CatInsert } from '../types';

export async function getCats(ownerId: string): Promise<Cat[]> {
  const { data, error } = await supabase
    .from('cats')
    .select('*')
    .eq('owner_id', ownerId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data;
}

export async function createCat(ownerId: string, cat: CatInsert): Promise<Cat> {
  const { data, error } = await supabase
    .from('cats')
    .insert({ ...cat, owner_id: ownerId })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateCat(catId: string, updates: Partial<CatInsert>): Promise<Cat> {
  const { data, error } = await supabase
    .from('cats')
    .update(updates)
    .eq('id', catId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteCat(catId: string): Promise<void> {
  const { error } = await supabase.from('cats').delete().eq('id', catId);
  if (error) throw error;
}
