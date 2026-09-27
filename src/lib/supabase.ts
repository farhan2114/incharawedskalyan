import { createClient } from '@supabase/supabase-js';

export interface BlessingItem {
  id: string;
  name: string;
  city: string | null;
  message: string;
  created_at?: string;
}

const SUPABASE_URL = 'https://ekmobqyfwzyoqkpwihun.supabase.co';
const SUPABASE_KEY = 'sb_publishable_48RlgrD2RirZ85gyRJzsTA_kdNillw3';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const FALLBACK_KEY = 'vows_blessings_cache';

const defaultSeedBlessings: BlessingItem[] = [
  {
    id: 'seed-1',
    name: 'Karthik & Divya',
    city: 'Chennai',
    message: 'Wishing you both a lifetime of laughter, harmony and endless love together!',
    created_at: new Date().toISOString(),
  },
  {
    id: 'seed-2',
    name: 'Lakshmi Auntie',
    city: 'Madurai',
    message: 'May Lord Sundareswarar shower His divine blessings upon Aarthi and Nikhil on this beautiful beginning.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'seed-3',
    name: 'Siddharth Raman',
    city: 'Bengaluru',
    message: 'From the train rides to the mandapam, so happy to see this journey unfold. Heartiest congratulations!',
    created_at: new Date().toISOString(),
  },
];

export async function fetchBlessings(): Promise<BlessingItem[]> {
  try {
    const { data, error } = await supabase
      .from('blessings')
      .select('id, name, city, message, created_at')
      .order('created_at', { ascending: false })
      .limit(60);

    if (error) throw error;
    if (data && data.length > 0) {
      try {
        localStorage.setItem(FALLBACK_KEY, JSON.stringify(data));
      } catch (_) {}
      return data;
    }
  } catch (err) {
    console.warn('Supabase fetch failed, checking local cache:', err);
  }

  try {
    const cached = localStorage.getItem(FALLBACK_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (_) {}

  return defaultSeedBlessings;
}

export async function addBlessing(name: string, city: string | null, message: string): Promise<void> {
  const newBlessing: BlessingItem = {
    id: 'local-' + Date.now(),
    name: name.trim(),
    city: city ? city.trim() : null,
    message: message.trim(),
    created_at: new Date().toISOString(),
  };

  try {
    const { error } = await supabase
      .from('blessings')
      .insert({ name: newBlessing.name, city: newBlessing.city, message: newBlessing.message });
    if (error) throw error;
  } catch (err) {
    console.warn('Supabase insert failed, persisting locally:', err);
  }

  // Always update local cache
  try {
    const cached = localStorage.getItem(FALLBACK_KEY);
    const list: BlessingItem[] = cached ? JSON.parse(cached) : [...defaultSeedBlessings];
    list.unshift(newBlessing);
    localStorage.setItem(FALLBACK_KEY, JSON.stringify(list));
  } catch (_) {}
}
