import { createClient } from '@supabase/supabase-js';

// Estas líneas leen las llaves que pusimos en Vercel
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Aquí "exportamos" la variable supabase para que Login la pueda usar
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
