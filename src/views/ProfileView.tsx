import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Package, Heart, MapPin, CreditCard, Settings, LogOut, Mail, Lock, User, ArrowRight, ShieldCheck, Plus } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useUserStore } from '../stores/userStore';
import { supabase } from '../lib/supabase';
import type { ViewState } from '../types';

interface ProfileViewProps {
  onNavigate: (view: ViewState) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onNavigate }) => {
  const { session, user, signOut, isLoading: authLoading } = useAuthStore();
  const { favorites = [] } = useUserStore();
  
  console.log('ProfileView Render:', { authLoading, hasSession: !!session, favoritesCount: favorites.length });
  
  // Auth Form State
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        // Basic frontend validation to prevent "Invalid Email" before sending to Supabase
        if (!email.includes('@') || !email.includes('.')) {
          throw new Error('Please enter a formal email identity.');
        }

        const { error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: email.split('@')[0],
              role: 'client'
            }
          }
        });
        
        if (signUpError) {
          // If we hit a rate limit, it's possible the user already created the account and is retrying.
          // Let's attempt a silent login as a fallback for a better MVP experience.
          if (signUpError.message.toLowerCase().includes('rate limit') || signUpError.status === 429) {
            const { error: fallbackSignInError } = await supabase.auth.signInWithPassword({
              email: email.trim(),
              password,
            });
            
            if (!fallbackSignInError) {
               // Fallback succeeded, they are logged in!
               return;
            }
            // If fallback fails, show the rate limit error
            throw new Error('Our security systems have temporarily throttled registration due to high demand. Please wait a few moments before trying again, or check your email for a confirmation link.');
          }
          throw signUpError;
        }

        alert(`Acquisition successful! A confirmation manifest has been dispatched to ${email}. Please verify your identity via email.`);
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (signInError) throw signInError;
      }
    } catch (err: any) {
      console.error('Auth sequence failure:', err);
      let userFriendlyMsg = err.message || 'An unexpected authentication error occurred.';
      if (userFriendlyMsg.includes('Failed to fetch')) {
        userFriendlyMsg = 'Atelier Connection Failure: Our security servers are currently unreachable. Please ensure your identity variables (VITE_SUPABASE_URL) are correctly configured in Vercel.';
      }
      setError(userFriendlyMsg);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-[80dvh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-luxury-gold/20 border-t-luxury-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-5 pt-10 pb-40 lg:px-12 max-w-md mx-auto"
      >
        <div className="glass-card p-10 sm:p-12 rounded-[3rem] border-white/5 shadow-2xl relative overflow-hidden text-center">
          <div className="absolute top-0 right-0 w-32 h-32 bg-luxury-gold/10 blur-3xl rounded-full -mr-16 -mt-16" />
          
          <div className="w-16 h-16 bg-luxury-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <User className="w-8 h-8 text-luxury-gold" />
          </div>
          
          <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter font-serif italic mb-2">
            {isSignUp ? 'Elite Registration' : 'Client Access'}
          </h2>
          <p className="text-xs text-zinc-500 font-bold uppercase tracking-[0.2em] mb-8">
            {isSignUp ? 'Join the VK Luxe Circle' : 'Welcome back to the Atelier'}
          </p>

          <form onSubmit={handleAuth} className="space-y-6 text-left relative">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold text-center">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Email Identity</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-luxury-gold transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="client@vkluxe.com"
                  className="w-full bg-white dark:bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-luxury-gold transition-all text-sm font-medium"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Security Passphrase</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-luxury-gold transition-colors" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white dark:bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-luxury-gold transition-all text-sm font-medium"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black dark:bg-white text-white dark:text-black py-5 rounded-2xl font-black text-sm hover:bg-luxury-gold hover:text-white transition-all shadow-xl flex items-center justify-center gap-3 uppercase tracking-[0.3em] group overflow-hidden relative"
            >
              <span className="relative z-10">{loading ? 'Verifying...' : (isSignUp ? 'Register' : 'Authenticate')}</span>
              {!loading && <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-2 transition-transform" />}
              <div className="absolute inset-0 bg-luxury-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </button>
          </form>

          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="mt-8 text-xs font-bold text-zinc-500 hover:text-luxury-gold transition-colors uppercase tracking-widest"
          >
            {isSignUp ? 'Already a member? Sign In' : 'Need an account? Register'}
          </button>
        </div>
      </motion.div>
    );
  }

  // Profile Detail State
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');
  const [bio, setBio] = useState(user?.user_metadata?.bio || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    const { error: updateError } = await supabase.auth.updateUser({
      data: { 
        full_name: fullName,
        bio: bio
      }
    });

    if (updateError) {
      setError(updateError.message);
    } else {
      setIsEditing(false);
      alert('Your Atelier Identity has been updated.');
    }
    setIsUpdating(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUpdating(true);
    try {
      // For MVP, we'll convert to Base64 and store in metadata 
      // (Note: In production, use Supabase Storage for large files)
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        const { error: uploadError } = await supabase.auth.updateUser({
          data: { avatar_url: base64String }
        });
        if (uploadError) throw uploadError;
        alert('Profile masterpiece updated.');
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-[80dvh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-luxury-gold/20 border-t-luxury-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-5 pt-10 pb-40 lg:px-12 max-w-md mx-auto"
      >
        <div className="glass-card p-10 sm:p-12 rounded-[3rem] border-white/5 shadow-2xl relative overflow-hidden text-center">
          <div className="absolute top-0 right-0 w-32 h-32 bg-luxury-gold/10 blur-3xl rounded-full -mr-16 -mt-16" />
          
          <div className="w-16 h-16 bg-luxury-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <User className="w-8 h-8 text-luxury-gold" />
          </div>
          
          <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter font-serif italic mb-2">
            {isSignUp ? 'Elite Registration' : 'Client Access'}
          </h2>
          <p className="text-xs text-zinc-500 font-bold uppercase tracking-[0.2em] mb-8">
            {isSignUp ? 'Join the VK Luxe Circle' : 'Welcome back to the Atelier'}
          </p>

          <form onSubmit={handleAuth} className="space-y-6 text-left relative">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold text-center">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Email Identity</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-luxury-gold transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="client@vkluxe.com"
                  className="w-full bg-white dark:bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-luxury-gold transition-all text-sm font-medium"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Security Passphrase</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-luxury-gold transition-colors" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white dark:bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-luxury-gold transition-all text-sm font-medium"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black dark:bg-white text-white dark:text-black py-5 rounded-2xl font-black text-sm hover:bg-luxury-gold hover:text-white transition-all shadow-xl flex items-center justify-center gap-3 uppercase tracking-[0.3em] group overflow-hidden relative"
            >
              <span className="relative z-10">{loading ? 'Verifying...' : (isSignUp ? 'Register' : 'Authenticate')}</span>
              {!loading && <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-2 transition-transform" />}
              <div className="absolute inset-0 bg-luxury-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </button>
          </form>

          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="mt-8 text-xs font-bold text-zinc-500 hover:text-luxury-gold transition-colors uppercase tracking-widest"
          >
            {isSignUp ? 'Already a member? Sign In' : 'Need an account? Register'}
          </button>
        </div>
      </motion.div>
    );
  }

  const menuItems = [
    { icon: Package, label: 'Acquisitions', value: 'Recent Orders' },
    { icon: Heart, label: 'The Vault', value: `${favorites.length} Masterpieces`, onClick: () => onNavigate('home') },
    { icon: Settings, label: 'Edit Profile', value: 'Identity & Details', onClick: () => setIsEditing(true) },
    { icon: LogOut, label: 'Exit Atelier', value: 'Sign Out', red: true, onClick: signOut },
  ];

  if (isEditing) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="px-5 pt-10 pb-40 max-w-xl mx-auto"
      >
        <div className="glass-card p-10 rounded-[3rem] border-white/5 shadow-2xl">
          <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter font-serif italic mb-8">
            Identity Setup
          </h2>
          
          <form onSubmit={handleUpdateProfile} className="space-y-8">
             <div className="flex flex-col items-center mb-8">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-luxury-gold/30 p-1 mb-2 bg-black/20">
                    <img 
                      src={user?.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.email}`} 
                      className="w-full h-full object-cover rounded-full" 
                      alt="Avatar" 
                    />
                  </div>
                  <label className="absolute bottom-0 right-0 p-2 bg-luxury-gold text-black rounded-full cursor-pointer shadow-lg hover:scale-110 transition-transform">
                    <Plus className="w-4 h-4" />
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                  </label>
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Digital Portrait</p>
             </div>

             <div className="space-y-4">
               <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1 mb-2">Full Identity (Name)</label>
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-white dark:bg-white/5 border border-white/10 rounded-2xl py-4 px-6 outline-none focus:border-luxury-gold transition-all text-sm font-medium"
                  />
               </div>
               <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1 mb-2">Personal Manifesto (Bio)</label>
                  <textarea 
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about your style..."
                    rows={4}
                    className="w-full bg-white dark:bg-white/5 border border-white/10 rounded-2xl py-4 px-6 outline-none focus:border-luxury-gold transition-all text-sm font-medium"
                  />
               </div>
             </div>

             <div className="flex gap-4">
                <button 
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-4 border border-white/10 rounded-2xl font-black text-xs uppercase tracking-widest text-zinc-500 hover:bg-white/5"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isUpdating}
                  className="flex-[2] py-4 bg-luxury-gold text-black rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-[1.02] transition-transform disabled:opacity-50"
                >
                  {isUpdating ? 'Recording...' : 'Save Identity'}
                </button>
             </div>
          </form>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="px-5 pt-10 pb-40 lg:px-12 max-w-4xl mx-auto"
    >
      <div className="flex flex-col items-center mb-12">
        <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 border-luxury-gold/30 p-1 mb-6 shadow-2xl bg-black/20">
          <img
            src={user?.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.email}`}
            className="w-full h-full object-cover rounded-[2.2rem]"
            alt="Profile"
          />
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tighter mb-2 font-serif italic text-center">
          {user?.user_metadata?.full_name?.toUpperCase() || user?.email?.split('@')[0].toUpperCase()}
        </h2>
        <div className="flex items-center gap-2 px-4 py-1 bg-luxury-gold/10 border border-luxury-gold/20 rounded-full">
           <ShieldCheck className="w-3 h-3 text-luxury-gold" />
           <p className="text-luxury-gold font-black text-[10px] tracking-[0.2em] uppercase">Elite Client Status</p>
        </div>
        {user?.user_metadata?.bio && (
          <p className="mt-6 text-zinc-500 text-sm italic max-w-xs text-center leading-relaxed">
            "{user.user_metadata.bio}"
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {menuItems.map((item, idx) => (
          <button
            key={idx}
            onClick={item.onClick}
            className={`flex items-center gap-4 p-6 glass-card rounded-[2.5rem] border-white/5 hover:border-luxury-gold/30 transition-all text-left group ${
              item.red ? 'hover:border-red-500/30' : ''
            }`}
          >
            <div
              className={`p-4 rounded-2xl ${
                item.red
                  ? 'bg-red-500/10 text-red-500'
                  : 'bg-luxury-gold/10 text-luxury-gold'
              }`}
            >
              <item.icon className="w-6 h-6" />
            </div>
            <div>
              <h4
                className={`font-black text-gray-900 dark:text-white group-hover:text-luxury-gold transition-colors text-sm uppercase tracking-wider ${
                  item.red ? 'group-hover:text-red-500' : ''
                }`}
              >
                {item.label}
              </h4>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">{item.value}</p>
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
};

