import { supabase } from './supabase';

// create a new journal for current user
export async function createJournal({ title, coverType, coverId, coverImg }) {
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) throw userError || new Error("No user found");

  const { data, error } = await supabase
    .from("journals")
    .insert([
      {
        user_id: user.id,
        name: title,
        cover_type: coverType,
        cover_id: coverId,
        cover_image: coverImg || null,
      }
    ])
    .select()
    .single();

  if (error) throw error;

  return normalizeJournal(data);
}

// get all journals for current user, including spreads
export async function getJournals() {
  const { data, error } = await supabase
    .from('journals')
    .select(`
      *,
      spreads (*)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data.map(normalizeJournal);
}

// update journal title
export async function renameJournal(id, title) {
  const { data, error } = await supabase
    .from('journals')
    .update({ name: title })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  return normalizeJournal(data);
}

// delete journal and all associated spreads
export async function deleteJournal(id) {
  const { error } = await supabase
    .from('journals')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// normalize journal data for frontend
function normalizeJournal(j) {
  return {
    id: j.id,
    user_id: j.user_id,

    // UI fields
    title: j.name,
    coverId: j.cover_id,
    coverType: j.cover_type,
    coverImg: j.cover_image,

    // derived
    created: j.created_at
      ? new Date(j.created_at).toLocaleDateString()
      : "",

    spreads: j.spreads || []
  };
}