import { createClient } from '@supabase/supabase-js';

// Robust environment variable extraction with cleaning
const rawUrl = import.meta.env.VITE_SUPABASE_URL || '';
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Clean the URL (remove trailing slashes and whitespace)
const supabaseUrl = rawUrl.trim().replace(/\/$/, '');
const supabaseAnonKey = rawKey.trim();

// Debugging for Vercel - This will show exactly what is being sent to Supabase
if (typeof window !== 'undefined') {
  console.log('VK Luxe Identity Check:');
  console.log(' - URL Length:', supabaseUrl.length);
  console.log(' - Key Length:', supabaseAnonKey.length);
  console.log(' - Key Starts With:', supabaseAnonKey.substring(0, 5) + '...');
}

// Ensure createClient never receives an invalid URL which causes "Failed to Fetch"
const isUrlValid = supabaseUrl.startsWith('https://');
const finalUrl = isUrlValid ? supabaseUrl : 'https://identity-missing.vkluxe.com';

// If the key is too short or doesn't look like a JWT, it's likely wrong
const isKeyValid = supabaseAnonKey.length > 20;
const finalKey = isKeyValid ? supabaseAnonKey : 'invalid-key-placeholder';

export const supabase = createClient(finalUrl, finalKey);
