import { supabase } from './supabase';

/**
 * Upgrades the current user's tier to "pro" in the profiles table.
 * Returns { error } — null error means success.
 */

// function to upgrade the user's tier to "pro"
export async function upgradeToPro() {

  // get the current authenticated user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  // if there was an error getting the user or if there is no authenticated user, return the error
  if (userError || !user) return { error: userError || new Error("No authenticated user") };

  // if the user is authenticated, update their tier to "pro"
  const { error } = await supabase
    .from("profiles")
    .update({ tier: "pro" })
    .eq("id", user.id);

  // return any error that occurred
  return { error };
}
