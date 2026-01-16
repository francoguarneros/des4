import { createClient } from '@supabase/supabase-js';

// Verificamos que las variables existan para evitar errores silenciosos
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltan las variables de entorno de Supabase en Vercel.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
