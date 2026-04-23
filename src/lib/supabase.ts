import { createClient } from '@supabase/supabase-js';

// Robust environment variable extraction
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

// Debugging for Vercel
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('VK Luxe Security: Supabase Identity Missing. Check Vercel Environment Variables.');
}

// Ensure createClient never receives an empty string which causes a crash
const validUrl = supabaseUrl && supabaseUrl.startsWith('http') 
  ? supabaseUrl 
  : 'https://placeholder.supabase.co';

const validKey = supabaseAnonKey || 'placeholder';

export const supabase = createClient(validUrl, validKey);
