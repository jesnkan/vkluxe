import { createClient } from '@supabase/supabase-js';

// Robust environment variable extraction with cleaning
const rawUrl = import.meta.env.VITE_SUPABASE_URL || '';
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Clean the URL (remove trailing slashes and whitespace)
const supabaseUrl = rawUrl.trim().replace(/\/$/, '');
const supabaseAnonKey = rawKey.trim();

// Detailed Debugging for the console
if (!supabaseUrl) console.error('VK Luxe Security: VITE_SUPABASE_URL is MISSING');
if (!supabaseAnonKey) console.error('VK Luxe Security: VITE_SUPABASE_ANON_KEY is MISSING');

// Ensure createClient never receives an invalid URL which causes "Failed to Fetch"
const isUrlValid = supabaseUrl.startsWith('https://');
const finalUrl = isUrlValid ? supabaseUrl : 'https://missing-identity.vkluxe.com';
const finalKey = supabaseAnonKey || 'missing-key';

export const supabase = createClient(finalUrl, finalKey);
