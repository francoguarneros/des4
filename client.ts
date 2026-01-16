import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Esta es la variable que el resto del sistema busca
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
