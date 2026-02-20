import { supabase } from '../client';
import { startOfDay, endOfDay, startOfWeek, endOfWeek } from 'date-fns';
import type { PlaySession, SessionInsert } from '../types';

export async function getSessions(ownerId: string): Promise<PlaySession[]> {
  const { data, error } = await supabase
    .from('play_sessions')
    .select('*')
    .eq('owner_id', ownerId)
    .order('played_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getSessionsByCat(catId: string): Promise<PlaySession[]> {
  const { data, error } = await supabase
    .from('play_sessions')
    .select('*')
    .eq('cat_id', catId)
    .order('played_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getTodaySessions(ownerId: string): Promise<PlaySession[]> {
  const today = new Date();
  const { data, error } = await supabase
    .from('play_sessions')
    .select('*')
    .eq('owner_id', ownerId)
    .gte('played_at', startOfDay(today).toISOString())
    .lte('played_at', endOfDay(today).toISOString())
    .order('played_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getWeeklySessions(ownerId: string): Promise<PlaySession[]> {
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
  const { data, error } = await supabase
    .from('play_sessions')
    .select('*')
    .eq('owner_id', ownerId)
    .gte('played_at', weekStart.toISOString())
    .lte('played_at', weekEnd.toISOString())
    .order('played_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function createSession(ownerId: string, session: SessionInsert): Promise<PlaySession> {
  const { data, error } = await supabase
    .from('play_sessions')
    .insert({ ...session, owner_id: ownerId })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteSession(sessionId: string): Promise<void> {
  const { error } = await supabase.from('play_sessions').delete().eq('id', sessionId);
  if (error) throw error;
}
