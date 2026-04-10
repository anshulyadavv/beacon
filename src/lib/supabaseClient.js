import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Handle edge case where users paste the exact placeholder strings
const isMockKey = supabaseUrl === 'your-project-url' || !supabaseUrl || !supabaseUrl.startsWith('http');

let client;
try {
  if (isMockKey) {
    console.warn("Real Supabase keys not detected. App will fail to authenticate.");
    client = null;
  } else {
    client = createClient(supabaseUrl, supabaseAnonKey);
  }
} catch (e) {
  console.error("Supabase Initialization Error:", e);
  client = null;
}

export const supabase = client;
export const hasValidSupabase = !isMockKey && client !== null;
