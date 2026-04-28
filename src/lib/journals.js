import { supabase } from './supabase';

/* =========================
   CREATE JOURNAL
========================= */
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

  // normalize for frontend
  return normalizeJournal(data);
}


/* =========================
   GET JOURNALS
========================= */
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


/* =========================
   RENAME JOURNAL
========================= */
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


/* =========================
   DELETE JOURNAL
========================= */
export async function deleteJournal(id) {
  const { error } = await supabase
    .from('journals')
    .delete()
    .eq('id', id);

  if (error) throw error;
}


/* =========================
   NORMALIZER (CRUCIAL FIX)
========================= */
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