// create a supabase client using environment variables for the URL and anon key
import { createClient } from '@supabase/supabase-js'

// values in .env file 
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// export a single supabase client instance to the app
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
)
