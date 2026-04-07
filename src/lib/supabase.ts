import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY as string

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    'Supabase credentials missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_API_KEY in .env',
  )
}

export const supabase = createClient(supabaseUrl ?? '', supabaseKey ?? '')
