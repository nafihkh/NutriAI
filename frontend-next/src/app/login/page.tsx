"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Leaf } from 'lucide-react';
import { api, setToken, getToken } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getToken()) router.replace('/');
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res =
        mode === 'login'
          ? await api.login(email, password)
          : await api.register(name, email, password);
      setToken(res.token);
      router.replace('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-[16px]">
      <div className="w-full max-w-[400px] bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[var(--radius-md)] p-[32px] shadow-[var(--shadow-md)]">
        <div className="flex flex-col items-center gap-[12px] mb-[28px]">
          <div className="w-[48px] h-[48px] overflow-hidden flex items-center justify-center">
            <img src="/logo.png" alt="Nutri-AI Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="font-display text-[22px] font-extrabold text-[var(--text-primary)] tracking-tight">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="text-[13px] text-[var(--text-muted)] text-center">
            Track your meals, macros and health targets.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-[14px]">
          {mode === 'register' && (
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-[6px]">Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] outline-none focus:border-[var(--accent-color)] rounded-lg p-[10px] text-[13.5px] text-[var(--text-primary)] transition-[var(--transition-fast)]"
              />
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-[6px]">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] outline-none focus:border-[var(--accent-color)] rounded-lg p-[10px] text-[13.5px] text-[var(--text-primary)] transition-[var(--transition-fast)]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-[6px]">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] outline-none focus:border-[var(--accent-color)] rounded-lg p-[10px] text-[13.5px] text-[var(--text-primary)] transition-[var(--transition-fast)]"
            />
          </div>

          {error && (
            <div className="text-[12.5px] font-semibold text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-lg px-[12px] py-[10px]">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-[11px] bg-[var(--accent-color)] hover:bg-[var(--text-primary)] text-white font-display font-semibold rounded-lg text-[13.5px] shadow-sm transition-[var(--transition-fast)] cursor-pointer disabled:opacity-60 mt-[4px]"
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p className="text-[13px] text-[var(--text-muted)] text-center mt-[20px]">
          {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setError('');
            }}
            className="text-[var(--accent-color)] font-bold hover:underline cursor-pointer"
          >
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
}
