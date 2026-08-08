"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  User, Calendar, Ruler, Scale, Target, Activity, Dumbbell, Flame,
  Wheat, Droplet, Quote, Edit2, LogOut, ChevronRight
} from 'lucide-react';
import { useMainLayout } from '@/components/MainLayout';
import { api, getToken, clearToken, Profile, Targets, User as UserType } from '@/lib/api';

const GOAL_LABELS: Record<string, string> = {
  lose_weight: 'Lose Weight',
  gain_muscle: 'Gain Muscle',
  maintain_weight: 'Maintain Weight',
};

const ACTIVITY_LABELS: Record<string, string> = {
  sedentary: 'Sedentary',
  light: 'Lightly Active',
  moderate: 'Moderately Active',
  active: 'Active',
  very_active: 'Very Active',
};

function bmiCategory(bmi: number): string {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}

function label(value: string | undefined, map: Record<string, string>, fallback: string): string {
  return (value && map[value]) || fallback;
}

interface FormState {
  age: string;
  gender: string;
  heightCm: string;
  weightKg: string;
  goal: string;
  activityLevel: string;
  dietPreference: string;
  allergies: string;
}

const EMPTY_FORM: FormState = {
  age: '',
  gender: 'male',
  heightCm: '',
  weightKg: '',
  goal: 'maintain_weight',
  activityLevel: 'moderate',
  dietPreference: '',
  allergies: '',
};

function formFromProfile(p: Profile): FormState {
  return {
    age: String(p.age ?? ''),
    gender: p.gender || 'male',
    heightCm: String(p.heightCm ?? ''),
    weightKg: String(p.weightKg ?? ''),
    goal: p.goal || 'maintain_weight',
    activityLevel: p.activityLevel || 'moderate',
    dietPreference: p.dietPreference || '',
    allergies: Array.isArray(p.allergies) ? p.allergies.join(', ') : '',
  };
}

export default function ProfilePage() {
  const router = useRouter();
  const { showToast } = useMainLayout() || { showToast: () => {} };

  const [loaded, setLoaded] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [targets, setTargets] = useState<Targets | null>(null);
  const [user, setUser] = useState<UserType | null>(null);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!getToken()) {
      router.replace('/login');
      return;
    }
    let cancelled = false;
    api.me()
      .then((res) => {
        if (!cancelled) setUser(res.user);
      })
      .catch(() => {});
    api
      .getProfile()
      .then((res) => {
        if (cancelled) return;
        setProfile(res.profile);
        setTargets(res.targets);
        setHasProfile(true);
      })
      .catch(() => {
        if (!cancelled) setHasProfile(false);
      })
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [router]);

  const startEdit = () => {
    if (profile) setForm(formFromProfile(profile));
    setEditing(true);
    setError('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const age = Number(form.age);
    const heightCm = Number(form.heightCm);
    const weightKg = Number(form.weightKg);
    if (!age || !heightCm || !weightKg || age <= 0 || heightCm <= 0 || weightKg <= 0) {
      setError('Age, height and weight are required and must be positive.');
      return;
    }
    setSaving(true);
    try {
      const res = await api.saveProfile({
        age,
        gender: form.gender,
        heightCm,
        weightKg,
        goal: form.goal,
        activityLevel: form.activityLevel,
        dietPreference: form.dietPreference || undefined,
        allergies: form.allergies
          .split(',')
          .map((a) => a.trim())
          .filter(Boolean),
      });
      setProfile(res.profile);
      setTargets(res.targets);
      setHasProfile(true);
      setEditing(false);
      showToast('Profile saved successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    clearToken();
    router.replace('/login');
  };

  if (!loaded) {
    return <div className="text-[14px] text-[var(--text-muted)] py-[40px] text-center">Loading your profile...</div>;
  }

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
    : '—';

  /* ---------------- Setup / Edit Form ---------------- */
  const renderProfileForm = () => {
    const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm({ ...form, [k]: e.target.value });

    return (
      <form onSubmit={handleSave} className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[var(--radius-md)] p-[24px] shadow-[var(--shadow-sm)] flex flex-col gap-[18px]">
        <div>
          <h2 className="font-display text-[20px] font-extrabold text-[var(--text-primary)]">
            {hasProfile ? 'Edit your health profile' : 'Set up your health profile'}
          </h2>
          <p className="text-[13px] text-[var(--text-muted)] mt-[4px]">
            We use this to calculate your BMI, daily calorie target and macros.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[14px]">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-[6px]">Age</label>
            <input type="number" required min={1} max={120} value={form.age} onChange={set('age')} placeholder="e.g. 22" className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] outline-none focus:border-[var(--accent-color)] rounded-lg p-[10px] text-[13.5px] text-[var(--text-primary)] transition-[var(--transition-fast)]" />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-[6px]">Gender</label>
            <div className="grid grid-cols-2 gap-[4px] bg-[var(--bg-primary)] p-[3px] rounded-lg border border-[var(--border-color)]">
              {['male', 'female'].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setForm({ ...form, gender: g })}
                  className={`py-[7px] text-[12px] font-bold rounded-md capitalize transition-[var(--transition-fast)] cursor-pointer ${
                    form.gender === g
                      ? 'bg-[var(--bg-secondary)] text-[var(--accent-color)] shadow-[var(--shadow-sm)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-[6px]">Height (cm)</label>
            <input type="number" required min={50} max={260} value={form.heightCm} onChange={set('heightCm')} placeholder="e.g. 178" className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] outline-none focus:border-[var(--accent-color)] rounded-lg p-[10px] text-[13.5px] text-[var(--text-primary)] transition-[var(--transition-fast)]" />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-[6px]">Weight (kg)</label>
            <input type="number" required min={20} max={400} step="0.1" value={form.weightKg} onChange={set('weightKg')} placeholder="e.g. 72" className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] outline-none focus:border-[var(--accent-color)] rounded-lg p-[10px] text-[13.5px] text-[var(--text-primary)] transition-[var(--transition-fast)]" />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-[6px]">Primary Goal</label>
            <select value={form.goal} onChange={set('goal')} className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] outline-none focus:border-[var(--accent-color)] rounded-lg p-[10px] text-[13.5px] text-[var(--text-primary)] transition-[var(--transition-fast)] cursor-pointer">
              <option value="lose_weight">Lose Weight</option>
              <option value="gain_muscle">Gain Muscle</option>
              <option value="maintain_weight">Maintain Weight</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-[6px]">Activity Level</label>
            <select value={form.activityLevel} onChange={set('activityLevel')} className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] outline-none focus:border-[var(--accent-color)] rounded-lg p-[10px] text-[13.5px] text-[var(--text-primary)] transition-[var(--transition-fast)] cursor-pointer">
              <option value="sedentary">Sedentary</option>
              <option value="light">Lightly Active</option>
              <option value="moderate">Moderately Active</option>
              <option value="active">Active</option>
              <option value="very_active">Very Active</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-[6px]">Diet Preference (optional)</label>
            <input type="text" value={form.dietPreference} onChange={set('dietPreference')} placeholder="e.g. High Protein" className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] outline-none focus:border-[var(--accent-color)] rounded-lg p-[10px] text-[13.5px] text-[var(--text-primary)] transition-[var(--transition-fast)]" />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-[6px]">Allergies (optional)</label>
            <input type="text" value={form.allergies} onChange={set('allergies')} placeholder="e.g. Peanuts, Dairy" className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] outline-none focus:border-[var(--accent-color)] rounded-lg p-[10px] text-[13.5px] text-[var(--text-primary)] transition-[var(--transition-fast)]" />
          </div>
        </div>

        {error && (
          <div className="text-[12.5px] font-semibold text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-lg px-[12px] py-[10px]">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-[10px]">
          {hasProfile && (
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="px-[16px] py-[10px] border border-[var(--border-color)] hover:border-[var(--text-muted)] text-[var(--text-secondary)] rounded-lg text-[13px] font-semibold transition-[var(--transition-fast)] cursor-pointer"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={saving}
            className="px-[20px] py-[10px] bg-[var(--accent-color)] hover:bg-[var(--text-primary)] text-white rounded-lg text-[13px] font-display font-semibold shadow-sm transition-[var(--transition-fast)] cursor-pointer disabled:opacity-60"
          >
            {saving ? 'Saving...' : hasProfile ? 'Save Changes' : 'Save Profile'}
          </button>
        </div>
      </form>
    );
  };

  /* ---------------- Setup mode (no profile yet) ---------------- */
  if (!hasProfile || !profile || !targets) {
    return (
      <div className="flex flex-col gap-[28px] max-w-[760px] mx-auto">
        <div>
          <h1 className="font-display text-[28px] md:text-[34px] font-extrabold text-[var(--text-primary)] tracking-tight">
            My Profile
          </h1>
          <p className="text-[14.5px] text-[var(--text-muted)] mt-[4px]">
            Complete your health profile to get personalized calorie and macro targets.
          </p>
        </div>
        {renderProfileForm()}
      </div>
    );
  }

  const bmi = targets.bmi;
  const bmiPct = Math.min(Math.max(((bmi - 15) / (35 - 15)) * 100, 5), 95);

  /* ---------------- View mode ---------------- */
  return (
    <div className="flex flex-col gap-[28px]">

      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[16px]">
        <div>
          <h1 className="font-display text-[28px] md:text-[34px] font-extrabold text-[var(--text-primary)] tracking-tight">
            My Profile
          </h1>
          <p className="text-[14.5px] text-[var(--text-muted)] mt-[4px]">
            Manage your personal information, health data and preferences.
          </p>
        </div>
        <button
          onClick={startEdit}
          className="flex items-center gap-[8px] px-[16px] py-[9px] bg-[var(--accent-color)] hover:bg-[var(--text-primary)] text-white rounded-[var(--radius-sm)] font-display font-semibold text-[13px] shadow-sm transition-[var(--transition-fast)] cursor-pointer self-start sm:self-center"
        >
          <Edit2 size={14} />
          <span>Edit Profile</span>
        </button>
      </div>

      {editing ? (
        renderProfileForm()
      ) : (
        <>
          {/* Top Banner Card */}
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[var(--radius-md)] p-[24px] shadow-[var(--shadow-sm)] flex flex-col md:flex-row items-start md:items-center justify-between gap-[24px] relative overflow-hidden">
            <div className="flex items-center gap-[20px] z-10">
              <div className="relative">
                <div className="w-[84px] h-[84px] rounded-full overflow-hidden border-3 border-[var(--accent-color)] bg-slate-200">
                  <img
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=120&h=120&auto=format&fit=crop"
                    className="w-full h-full object-cover"
                    alt="Avatar"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-[4px]">
                <div className="flex items-center gap-[8px]">
                  <h2 className="font-display text-[22px] font-extrabold text-[var(--text-primary)] leading-tight">
                    {user?.name ?? 'Your Account'}
                  </h2>
                </div>
                <p className="text-[13px] text-[var(--text-secondary)]">
                  {user?.email ?? ''}
                </p>
                <p className="text-[12px] text-[var(--text-muted)] mt-[2px]">
                  Member since {memberSince}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-[12px] p-[16px] bg-[rgba(16,185,129,0.04)] border border-[rgba(16,185,129,0.1)] rounded-[var(--radius-sm)] max-w-full md:max-w-[340px] z-10">
              <Quote size={20} className="text-[var(--accent-color)] rotate-180 flex-shrink-0 mt-[2px]" />
              <div>
                <p className="text-[13px] italic font-semibold text-[var(--text-secondary)] leading-relaxed">
                  Consistency today, healthier tomorrow.
                </p>
              </div>
            </div>

            <div className="absolute right-[-30px] top-[-30px] w-[140px] h-[140px] rounded-full bg-[var(--accent-color)] opacity-[0.03] blur-2xl" />
          </div>

          {/* Middle Row Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-[28px]">

            {/* Column 1: Personal Information */}
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[var(--radius-md)] p-[24px] shadow-[var(--shadow-sm)] flex flex-col gap-[14px]">
              <h3 className="font-display text-[15px] font-bold text-[var(--text-primary)] uppercase tracking-wider">
                Personal Information
              </h3>

              <div className="flex items-center gap-[12px]">
                <div className="w-[30px] h-[30px] rounded-full bg-[rgba(16,185,129,0.06)] text-[var(--accent-color)] flex items-center justify-center flex-shrink-0">
                  <Calendar size={14} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-[var(--text-muted)] leading-tight">Age</span>
                  <span className="text-[13.5px] font-bold text-[var(--text-primary)] mt-[1px]">{profile.age} years</span>
                </div>
              </div>

              <div className="flex items-center gap-[12px]">
                <div className="w-[30px] h-[30px] rounded-full bg-pink-500/5 text-pink-500 flex items-center justify-center flex-shrink-0">
                  <User size={14} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-[var(--text-muted)] leading-tight">Gender</span>
                  <span className="text-[13.5px] font-bold text-[var(--text-primary)] mt-[1px] capitalize">{profile.gender}</span>
                </div>
              </div>

              <div className="flex items-center gap-[12px]">
                <div className="w-[30px] h-[30px] rounded-full bg-amber-500/5 text-amber-500 flex items-center justify-center flex-shrink-0">
                  <Ruler size={14} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-[var(--text-muted)] leading-tight">Height</span>
                  <span className="text-[13.5px] font-bold text-[var(--text-primary)] mt-[1px]">{profile.heightCm} cm</span>
                </div>
              </div>

              <div className="flex items-center gap-[12px]">
                <div className="w-[30px] h-[30px] rounded-full bg-sky-500/5 text-sky-500 flex items-center justify-center flex-shrink-0">
                  <Scale size={14} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-[var(--text-muted)] leading-tight">Weight</span>
                  <span className="text-[13.5px] font-bold text-[var(--text-primary)] mt-[1px]">{profile.weightKg} kg</span>
                </div>
              </div>

              <div className="flex items-center gap-[12px]">
                <div className="w-[30px] h-[30px] rounded-full bg-[rgba(16,185,129,0.06)] text-[var(--accent-color)] flex items-center justify-center flex-shrink-0">
                  <Target size={14} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-[var(--text-muted)] leading-tight">Primary Goal</span>
                  <span className="text-[13.5px] font-bold text-[var(--text-primary)] mt-[1px]">{label(profile.goal, GOAL_LABELS, profile.goal)}</span>
                </div>
              </div>

              <div className="flex items-center gap-[12px]">
                <div className="w-[30px] h-[30px] rounded-full bg-purple-500/5 text-purple-500 flex items-center justify-center flex-shrink-0">
                  <Activity size={14} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-[var(--text-muted)] leading-tight">Activity Level</span>
                  <span className="text-[13.5px] font-bold text-[var(--text-primary)] mt-[1px]">{label(profile.activityLevel, ACTIVITY_LABELS, profile.activityLevel)}</span>
                </div>
              </div>
            </div>

            {/* Column 2: Body Statistics */}
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[var(--radius-md)] p-[24px] shadow-[var(--shadow-sm)] flex flex-col gap-[20px]">
              <h3 className="font-display text-[15px] font-bold text-[var(--text-primary)] uppercase tracking-wider">
                Body Statistics
              </h3>

              <div className="grid grid-cols-2 gap-[12px]">
                <div className="bg-[var(--bg-input)] p-[12px] border border-[var(--border-color)] rounded-xl flex flex-col gap-[6px]">
                  <div className="flex items-center gap-[6px] text-[var(--text-muted)]">
                    <User size={14} className="text-emerald-500" />
                    <span className="text-[10.5px] font-bold uppercase tracking-wide">BMI</span>
                  </div>
                  <span className="font-display text-[16px] font-extrabold text-[var(--text-primary)] leading-none">{bmi}</span>
                  <span className="text-[9px] font-bold text-emerald-600">{bmiCategory(bmi)}</span>
                </div>

                <div className="bg-[var(--bg-input)] p-[12px] border border-[var(--border-color)] rounded-xl flex flex-col gap-[6px]">
                  <div className="flex items-center gap-[6px] text-[var(--text-muted)]">
                    <Flame size={14} className="text-orange-500" />
                    <span className="text-[10.5px] font-bold uppercase tracking-wide">BMR</span>
                  </div>
                  <span className="font-display text-[16px] font-extrabold text-[var(--text-primary)] leading-none">{targets.bmr}</span>
                  <span className="text-[9px] font-bold text-emerald-600">kcal / day</span>
                </div>
              </div>

              {/* BMI Indicator scale */}
              <div className="flex flex-col gap-[6px] border-t border-[var(--border-color)] pt-[16px]">
                <div className="flex justify-between items-center">
                  <span className="text-[10.5px] font-bold text-[var(--text-muted)] uppercase tracking-wider">BMI Indicator</span>
                  <span className="text-[12px] font-extrabold text-[#10b981]">{bmi}</span>
                </div>
                <div className="relative mt-[8px]">
                  <div
                    className="absolute -top-[12px] transform -translate-x-1/2 flex flex-col items-center"
                    style={{ left: `${bmiPct}%` }}
                  >
                    <div className="w-[8px] h-[8px] bg-[var(--text-primary)] rounded-full mb-[1px]"></div>
                    <div className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[5px] border-t-[var(--text-primary)]"></div>
                  </div>
                  <div className="h-[6px] rounded-full overflow-hidden flex w-full">
                    <div className="w-[18.5%] bg-[#3b82f6]" />
                    <div className="w-[31.5%] bg-[#10b981]" />
                    <div className="w-[25%] bg-[#f97316]" />
                    <div className="w-[25%] bg-[#ef4444]" />
                  </div>
                  <div className="flex justify-between text-[8px] text-[var(--text-muted)] font-bold tracking-tight uppercase mt-[4px]">
                    <span>&lt; 18.5</span>
                    <span>18.5 - 24.9</span>
                    <span>25 - 29.9</span>
                    <span>&gt; 29.9</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 3: Daily Targets */}
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[var(--radius-md)] p-[24px] shadow-[var(--shadow-sm)] flex flex-col gap-[14px]">
              <h3 className="font-display text-[15px] font-bold text-[var(--text-primary)] uppercase tracking-wider">
                Daily Targets
              </h3>

              <div className="flex items-center gap-[12px]">
                <div className="w-[30px] h-[30px] rounded-full bg-emerald-500/5 text-emerald-500 flex items-center justify-center flex-shrink-0">
                  <Flame size={14} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-[var(--text-muted)] leading-tight">Calories</span>
                  <span className="text-[13.5px] font-bold text-[var(--text-primary)] mt-[1px]">{targets.calories.toLocaleString()} kcal</span>
                </div>
              </div>

              <div className="flex items-center gap-[12px]">
                <div className="w-[30px] h-[30px] rounded-full bg-[rgba(16,185,129,0.06)] text-[var(--accent-color)] flex items-center justify-center flex-shrink-0">
                  <Dumbbell size={14} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-[var(--text-muted)] leading-tight">Protein</span>
                  <span className="text-[13.5px] font-bold text-[var(--text-primary)] mt-[1px]">{targets.protein} g</span>
                </div>
              </div>

              <div className="flex items-center gap-[12px]">
                <div className="w-[30px] h-[30px] rounded-full bg-amber-500/5 text-amber-500 flex items-center justify-center flex-shrink-0">
                  <Wheat size={14} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-[var(--text-muted)] leading-tight">Carbs</span>
                  <span className="text-[13.5px] font-bold text-[var(--text-primary)] mt-[1px]">{targets.carbs} g</span>
                </div>
              </div>

              <div className="flex items-center gap-[12px]">
                <div className="w-[30px] h-[30px] rounded-full bg-rose-500/5 text-rose-500 flex items-center justify-center flex-shrink-0">
                  <Flame size={14} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-[var(--text-muted)] leading-tight">Fats</span>
                  <span className="text-[13.5px] font-bold text-[var(--text-primary)] mt-[1px]">{targets.fat} g</span>
                </div>
              </div>

              <div className="flex items-center gap-[12px]">
                <div className="w-[30px] h-[30px] rounded-full bg-sky-500/5 text-sky-500 flex items-center justify-center flex-shrink-0">
                  <Droplet size={14} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-[var(--text-muted)] leading-tight">Water</span>
                  <span className="text-[13.5px] font-bold text-[var(--text-primary)] mt-[1px]">{targets.water} L</span>
                </div>
              </div>

              {(profile.dietPreference || (profile.allergies && profile.allergies.length > 0)) && (
                <div className="border-t border-[var(--border-color)] pt-[14px] flex flex-col gap-[8px]">
                  {profile.dietPreference && (
                    <div className="flex items-center gap-[8px]">
                      <span className="px-[10px] py-[5px] bg-emerald-500/5 border border-emerald-500/10 text-[var(--accent-color)] font-semibold text-[12px] rounded-full">
                        {profile.dietPreference}
                      </span>
                    </div>
                  )}
                  {profile.allergies?.map((a) => (
                    <div key={a} className="flex items-center gap-[8px]">
                      <span className="px-[10px] py-[5px] bg-rose-500/5 border border-rose-500/10 text-rose-500 font-semibold text-[12px] rounded-full">
                        {a}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Account & Settings */}
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[var(--radius-md)] p-[24px] shadow-[var(--shadow-sm)] flex flex-col gap-[20px]">
            <h3 className="font-display text-[15px] font-bold text-[var(--text-primary)] uppercase tracking-wider">
              Account & Settings
            </h3>

            <button
              onClick={() => showToast('Password change coming soon!')}
              className="flex items-center justify-between w-full p-[12px] rounded-lg hover:bg-[var(--bg-primary)] transition-colors cursor-pointer text-left text-[13.5px] text-[var(--text-secondary)] font-semibold"
            >
              <span>Change Password</span>
              <ChevronRight size={14} className="text-[var(--text-muted)]" />
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-[8px] w-full justify-center py-[11px] border border-rose-500/20 hover:border-rose-500 hover:bg-rose-500/5 text-rose-500 rounded-lg text-[13.5px] font-display font-semibold transition-[var(--transition-fast)] cursor-pointer"
            >
              <LogOut size={14} />
              <span>Log Out</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
