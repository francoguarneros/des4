import { createClient } from '@supabase/supabase-js';

// BORRA LO QUE HAY Y PEGA TUS DATOS REALES ENTRE LAS COMILLAS
const supabaseUrl = 'https://pegatuurlreal.supabase.co'; 
const supabaseAnonKey = 'pega-tu-clave-anon-larga-aqui';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
