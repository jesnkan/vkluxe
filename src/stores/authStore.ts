import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Session, User } from '@supabase/supabase-js';

interface AuthState {
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  
  // Actions
  setSession: (session: Session | null) => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  user: null,
  isAdmin: false,
  isLoading: true,

  setSession: async (session) => {
    const user = session?.user ?? null;
    let isAdmin = false;

    // Set loading to true while we verify roles
    set({ isLoading: true });

    console.log('setSession: checking roles for', user?.email, 'ID:', user?.id);

    if (user) {
      // 1. Check if email matches admin email from env (case-insensitive)
      const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
      if (adminEmail && user.email?.toLowerCase() === adminEmail.toLowerCase().trim()) {
        console.log('Admin match: Env Email');
        isAdmin = true;
      }

      // 2. Check user metadata for role (case-insensitive)
      if (!isAdmin && user.user_metadata?.role?.toLowerCase() === 'admin') {
        console.log('Admin match: User Metadata');
        isAdmin = true;
      }

      // 3. Check user_roles table
      if (!isAdmin) {
        try {
          const { data, error } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .maybeSingle();

          if (!error && data?.role?.toLowerCase() === 'admin') {
            console.log('Admin match: user_roles table');
            isAdmin = true;
          }
        } catch (e) {
          console.error('user_roles query failed:', e);
        }
      }

      // 4. Fallback: Check profiles table (common pattern)
      if (!isAdmin) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .maybeSingle();

          if (!error && data?.role?.toLowerCase() === 'admin') {
            console.log('Admin match: profiles table');
            isAdmin = true;
          }
        } catch (e) {
          // profiles table might not exist, that's fine
        }
      }
      
      // 5. Ultimate Fallback for the specified default admin email
      if (!isAdmin && user.email?.toLowerCase() === 'admin@vkluxe.com') {
        console.log('Admin match: Default Admin Email');
        isAdmin = true;
      }

      // 6. Ensure user has a role record if they don't (Client Auto-Provision)
      if (!isAdmin && session) {
        try {
          const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .maybeSingle();
          
          if (!roleData) {
            console.log('Auto-provisioning client role for user');
            await supabase
              .from('user_roles')
              .upsert([{ user_id: user.id, role: 'client' }], { onConflict: 'user_id' });
          }
        } catch (e) {
          console.warn('Silent role provision failed:', e);
        }
      }
    }

    console.log('Final Auth State:', { hasSession: !!session, isAdmin });

    set({ 
      session, 
      user,
      isAdmin,
      isLoading: false 
    });
  },

  signOut: async () => {
    try {
      console.log('authStore: Starting signOut sequence');
      await supabase.auth.signOut();
      console.log('authStore: Supabase signOut successful');
    } catch (err) {
      console.error('authStore: Supabase signOut error:', err);
    } finally {
      console.log('authStore: Clearing local session state and redirecting');
      set({ session: null, user: null, isAdmin: false });
      // Force redirect to home to clear any restricted views
      window.location.href = '/';
    }
  },

  initialize: async () => {
    set({ isLoading: true });
    
    // Get initial session
    const { data: { session } } = await supabase.auth.getSession();
    await get().setSession(session);

    // Listen for changes
    supabase.auth.onAuthStateChange(async (_event, session) => {
      await get().setSession(session);
    });
  }
}));
