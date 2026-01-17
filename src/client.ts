import { createClient } from '@supabase/supabase-js'

// Estas variables se configuran en el panel de Vercel (Environment Variables)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Faltan las variables de entorno de Supabase. Verifica tu configuración en Vercel.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
