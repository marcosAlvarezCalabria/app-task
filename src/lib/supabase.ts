import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string)
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string)

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Faltan variables de entorno: VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY son requeridas. ' +
    'Crea un archivo .env basado en .env.example'
  )
}

// El cliente de Supabase gestiona los tokens internamente via cookies seguras
// NO se usa localStorage para tokens (seguridad contra XSS)
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Supabase JS v2 usa cookies por defecto en entornos de servidor
    // En el navegador, gestiona la sesión de forma segura sin exponer tokens en localStorage
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

export default supabase
