import { supabase } from './supabase';

// Upgrade the authenticated user's tier to "pro"
export async function upgradeToPro() {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) return { error: userError || new Error("No authenticated user") };

  // Update the user's profile in the "profiles" table to set the tier to "pro"
  const { error } = await supabase
    .from("profiles")
    .update({ tier: "pro" })
    .eq("id", user.id);

  // if error, throw it
  return { error };
}
