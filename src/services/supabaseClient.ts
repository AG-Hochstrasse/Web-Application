import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vbjdqaoodyxiuoltpsdq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZiamRxYW9vZHl4aXVvbHRwc2RxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU0NDQ5NjYsImV4cCI6MjA0MTAyMDk2Nn0.gBSyuzWxcUz11D91LLypUFFFGpZXLMUuDBBjWx2Yr9s';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    throw error;
  }

  return data;
};