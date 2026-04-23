import React, { useState } from 'react';
import { motion } from 'motion/react';
import { supabase } from '../lib/supabase';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '../components';

import { useAuthStore } from '../stores/authStore';

export const LoginView: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { session, isAdmin, isLoading: authLoading, signOut } = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalLoading(true);
    setError(null);

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (loginError) {
      setError(loginError.message);
      setLocalLoading(false);
    }
  };

  // Only show access denied if we have a session, aren't an admin, AND authStore is finished checking
  const isAccessDenied = session && !isAdmin && !authLoading;
  const isProcessing = localLoading || authLoading;

  return (
    <div className="min-h-[80dvh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-10 sm:p-12 rounded-[3rem] border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-luxury-gold/10 blur-3xl rounded-full -mr-16 -mt-16" />
          
          <div className="text-center mb-10 relative">
            <div className="w-16 h-16 bg-luxury-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8 text-luxury-gold" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter font-serif italic mb-2">
              Atelier Access
            </h2>
            <p className="text-xs text-zinc-500 font-bold uppercase tracking-[0.2em]">Authorized Personnel Only</p>
          </div>

          {isAccessDenied ? (
            <div className="space-y-6 text-center">
              <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl">
                <p className="text-red-500 font-bold text-sm leading-relaxed">
                  Authentication Successful. <br/>
                  However, your identity does not have <br/>
                  <span className="font-black underline italic">Atelier Clearance</span>.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => window.location.href = '/'}
                  className="w-full py-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-luxury-gold hover:text-white transition-all shadow-lg"
                >
                  Return to Boutique
                </button>
                <button 
                  onClick={async () => {
                    console.log('LoginView: Sign out button clicked');
                    await signOut();
                    console.log('LoginView: Sign out completed');
                  }}
                  className="text-zinc-500 font-bold text-[10px] uppercase tracking-[0.2em] hover:text-red-500 transition-colors py-2"
                >
                  Sign Out & Switch Identity
                </button>
              </div>
            </div>
          ) : (
            <>
              <form onSubmit={handleLogin} className="space-y-6 relative">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold text-center"
                  >
                    {error}
                  </motion.div>
                )}

                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">
                    Security Identity (Email)
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-luxury-gold transition-colors" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@vkluxe.com"
                      className="w-full bg-white dark:bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-luxury-gold transition-all text-sm font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">
                    Passphrase
                  </label>
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
                  disabled={isProcessing}
                  className="w-full bg-black dark:bg-white text-white dark:text-black py-5 rounded-2xl font-black text-sm hover:bg-luxury-gold hover:text-white transition-all shadow-xl flex items-center justify-center gap-3 uppercase tracking-[0.3em] group overflow-hidden relative"
                >
                  <span className="relative z-10">{isProcessing ? 'Verifying...' : 'Authenticate'}</span>
                  {!isProcessing && (
                    <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-2 transition-transform" />
                  )}
                  <div className="absolute inset-0 bg-luxury-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                </button>
              </form>

              <div className="mt-8 flex items-center justify-center gap-2 text-zinc-500">
                <ShieldCheck className="w-4 h-4 text-luxury-gold" />
                <span className="text-[10px] font-black uppercase tracking-widest">Encrypted Session</span>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};
