import { createClient } from '@supabase/supabase-js'

// get the supabase url and anon key from .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// create a supabase client using the url and anon key
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
)
