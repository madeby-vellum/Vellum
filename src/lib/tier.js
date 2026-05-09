import { supabase } from './supabase';

/**
 * Upgrades the current user's tier to "pro" in the profiles table.
 * Returns { error } — null error means success.
 */
export async function upgradeToPro() {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) return { error: userError || new Error("No authenticated user") };

  const { error } = await supabase
    .from("profiles")
    .update({ tier: "pro" })
    .eq("id", user.id);

  return { error };
}
