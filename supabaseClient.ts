import { createClient } from '@supabase/supabase-js';

// Sustituye con tus llaves reales de Supabase (Project Settings > API)
const supabaseUrl = 'https://TU_URL_AQUÍ.supabase.co';
const supabaseAnonKey = 'TU_ANON_KEY_AQUÍ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
