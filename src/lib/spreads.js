import { supabase } from './supabase';

//get all spreads for a journal
export async function getSpreads(journalId) {
  const { data, error } = await supabase
    .from('spreads')
    .select('*')
    .eq('journal_id', journalId)
    .order('created_at');

  // if error, throw it
  if (error) throw error;
  return data;
}

// save a spread, if id is provided update it
export async function saveSpread({ id, journal_id, name, canvas }) {
  if (id) {
    // update
    const { error } = await supabase
      .from('spreads')
      .update({ name, canvas, updated_at: new Date() })
      .eq('id', id);

    if (error) throw error;
  } else {
    // insert
    const { error } = await supabase
      .from('spreads')
      .insert([{ journal_id, name, canvas }]);

    if (error) throw error;
  }
}

// delete a spread by id
export async function deleteSpread(id) {
  const { error } = await supabase
    .from('spreads')
    .delete()
    .eq('id', id);

  if (error) throw error;
}