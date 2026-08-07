"use client";

import React, { useState } from 'react';
import { 
  User, Calendar, Heart, MapPin, Activity, Shield, Edit2, Scale, 
  Target, Dumbbell, TrendingUp, Sparkles, Lock, Bell, LogOut, ChevronRight, 
  Smile, Egg, Milk, Wheat, Cookie, Slash, Quote
} from 'lucide-react';
import { useMainLayout } from '@/components/MainLayout';

export default function ProfilePage() {
  const { showToast } = useMainLayout() || { showToast: () => {} };

  // Profile data state matching Jack Matrix from mockup
  const [profile, setProfile] = useState({
    name: 'Jack Matrix',
    email: 'jackmatrix89@gmail.com',
    phone: '+1 234 567 8900',
    memberSince: 'May 15, 2025',
    dob: 'May 15, 1998',
    gender: 'Male',
    height: '178 cm',
    activityLevel: 'Moderately Active',
    location: 'New York, USA',
    weight: 72.5,
    bmi: 22.4,
    bodyFat: 18.3,
    muscleMass: 56.7,
    primaryGoal: 'Lose Weight',
    targetWeight: 65,
    targetDate: 'Aug 15, 2025',
    progress: 72,
    motivation: 'Feel better, improve energy, live longer'
  });

  const [editSection, setEditSection] = useState(null);
  const [formState, setFormState] = useState({ ...profile });

  const handleEdit = (sectionName) => {
    setEditSection(sectionName);
    setFormState({ ...profile });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setProfile({ ...formState });
    setEditSection(null);
    showToast('Updated details saved successfully!');
  };

  // BMI bar slider position calculate
  const minBmi = 15;
  const maxBmi = 35;
  const bmiPct = Math.min(Math.max(((profile.bmi - minBmi) / (maxBmi - minBmi)) * 100, 5), 95);

  return (
    <div className="flex flex-col gap-[28px] animate-[fade-in-up_0.35s_ease-out]">
      
      {/* Title Header */}
      <div>
        <h1 className="font-display text-[28px] md:text-[32px] font-extrabold text-[var(--text-primary)] tracking-tight">
          My Profile
        </h1>
        <p className="text-[14.5px] text-[var(--text-muted)] mt-[4px]">
          Manage your personal information, health data and preferences.
        </p>
      </div>

      {/* 1. Top Banner Card */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[var(--radius-md)] p-[24px] shadow-[var(--shadow-sm)] flex flex-col md:flex-row items-start md:items-center justify-between gap-[24px] relative overflow-hidden">
        
        {/* Left Side: Avatar & Basic Info */}
        <div className="flex items-center gap-[20px] z-10">
          <div className="relative">
            <div className="w-[84px] h-[84px] rounded-full overflow-hidden border-3 border-[var(--accent-color)] bg-slate-200">
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=120&h=120&auto=format&fit=crop"
                className="w-full h-full object-cover"
                alt="Avatar"
              />
            </div>
            <button 
              onClick={() => showToast('Avatar change coming soon!')}
              className="absolute bottom-0 right-0 w-[26px] h-[26px] rounded-full bg-[var(--bg-secondary)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--accent-color)] shadow-sm cursor-pointer"
              title="Edit Avatar"
            >
              <Edit2 size={11} />
            </button>
          </div>

          <div className="flex flex-col gap-[4px]">
            <div className="flex items-center gap-[8px]">
              <h2 className="font-display text-[22px] font-extrabold text-[var(--text-primary)] leading-tight">
                {profile.name}
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-500/10 px-[8px] py-[3px] rounded-md">
                Premium
              </span>
            </div>
            <p className="text-[13px] text-[var(--text-secondary)]">
              {profile.email} &bull; {profile.phone}
            </p>
            <p className="text-[12px] text-[var(--text-muted)] mt-[2px]">
              Member since {profile.memberSince}
            </p>
          </div>
        </div>

        {/* Right Side: Quote Bubble Banner */}
        <div className="flex items-start gap-[12px] p-[16px] bg-[rgba(16,185,129,0.04)] border border-[rgba(16,185,129,0.1)] rounded-[var(--radius-sm)] max-w-full md:max-w-[340px] z-10">
          <Quote size={20} className="text-[var(--accent-color)] rotate-180 flex-shrink-0 mt-[2px]" />
          <div>
            <p className="text-[13px] italic font-semibold text-[var(--text-secondary)] leading-relaxed">
              Consistency today, healthier tomorrow.
            </p>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute right-[-30px] top-[-30px] w-[140px] h-[140px] rounded-full bg-[var(--accent-color)] opacity-[0.03] blur-2xl" />
      </div>

      {/* 2. Middle Row Grid (3 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[28px]">
        
        {/* Column 1: Personal Information */}
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[var(--radius-md)] p-[24px] shadow-[var(--shadow-sm)] flex flex-col gap-[20px]">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-[15px] font-bold text-[var(--text-primary)] uppercase tracking-wider">
              Personal Information
            </h3>
            <button 
              onClick={() => handleEdit('personal')}
              className="w-[28px] h-[28px] rounded-lg border border-[var(--border-color)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--accent-color)] hover:border-[var(--accent-color)] transition-colors cursor-pointer"
              title="Edit Personal Details"
            >
              <Edit2 size={13} />
            </button>
          </div>

          {editSection === 'personal' ? (
            <form onSubmit={handleSave} className="flex flex-col gap-[12px]">
              <div>
                <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase mb-[4px]">Full Name</label>
                <input 
                  type="text" 
                  value={formState.name} 
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] rounded-lg p-[8px] text-[13px] text-[var(--text-primary)]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase mb-[4px]">Date of Birth</label>
                <input 
                  type="text" 
                  value={formState.dob} 
                  onChange={(e) => setFormState({ ...formState, dob: e.target.value })}
                  className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] rounded-lg p-[8px] text-[13px] text-[var(--text-primary)]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase mb-[4px]">Gender</label>
                <input 
                  type="text" 
                  value={formState.gender} 
                  onChange={(e) => setFormState({ ...formState, gender: e.target.value })}
                  className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] rounded-lg p-[8px] text-[13px] text-[var(--text-primary)]"
                />
              </div>
              <div className="grid grid-cols-2 gap-[8px]">
                <div>
                  <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase mb-[4px]">Height</label>
                  <input 
                    type="text" 
                    value={formState.height} 
                    onChange={(e) => setFormState({ ...formState, height: e.target.value })}
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] rounded-lg p-[8px] text-[13px] text-[var(--text-primary)]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase mb-[4px]">Activity Level</label>
                  <input 
                    type="text" 
                    value={formState.activityLevel} 
                    onChange={(e) => setFormState({ ...formState, activityLevel: e.target.value })}
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] rounded-lg p-[8px] text-[13px] text-[var(--text-primary)]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase mb-[4px]">Location</label>
                <input 
                  type="text" 
                  value={formState.location} 
                  onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                  className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] rounded-lg p-[8px] text-[13px] text-[var(--text-primary)]"
                />
              </div>
              <div className="flex justify-end gap-[8px] mt-[4px]">
                <button type="button" onClick={() => setEditSection(null)} className="px-[12px] py-[6px] text-[12px] border border-[var(--border-color)] rounded-md font-semibold text-[var(--text-secondary)]">Cancel</button>
                <button type="submit" className="px-[14px] py-[6px] bg-[var(--accent-color)] text-white rounded-md font-semibold text-[12px]">Save</button>
              </div>
            </form>
          ) : (
            <div className="flex flex-col gap-[14px]">
              <div className="flex items-center gap-[12px]">
                <div className="w-[30px] h-[30px] rounded-full bg-[rgba(16,185,129,0.06)] text-[var(--accent-color)] flex items-center justify-center flex-shrink-0">
                  <User size={14} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-[var(--text-muted)] leading-tight">Full Name</span>
                  <span className="text-[13.5px] font-bold text-[var(--text-primary)] mt-[1px]">{profile.name}</span>
                </div>
              </div>

              <div className="flex items-center gap-[12px]">
                <div className="w-[30px] h-[30px] rounded-full bg-cyan-500/5 text-cyan-500 flex items-center justify-center flex-shrink-0">
                  <Calendar size={14} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-[var(--text-muted)] leading-tight">Date of Birth</span>
                  <span className="text-[13.5px] font-bold text-[var(--text-primary)] mt-[1px]">{profile.dob}</span>
                </div>
              </div>

              <div className="flex items-center gap-[12px]">
                <div className="w-[30px] h-[30px] rounded-full bg-pink-500/5 text-pink-500 flex items-center justify-center flex-shrink-0">
                  <Smile size={14} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-[var(--text-muted)] leading-tight">Gender</span>
                  <span className="text-[13.5px] font-bold text-[var(--text-primary)] mt-[1px]">{profile.gender}</span>
                </div>
              </div>

              <div className="flex items-center gap-[12px]">
                <div className="w-[30px] h-[30px] rounded-full bg-amber-500/5 text-amber-500 flex items-center justify-center flex-shrink-0">
                  <Activity size={14} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-[var(--text-muted)] leading-tight">Height</span>
                  <span className="text-[13.5px] font-bold text-[var(--text-primary)] mt-[1px]">{profile.height}</span>
                </div>
              </div>

              <div className="flex items-center gap-[12px]">
                <div className="w-[30px] h-[30px] rounded-full bg-purple-500/5 text-purple-500 flex items-center justify-center flex-shrink-0">
                  <TrendingUp size={14} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-[var(--text-muted)] leading-tight">Activity Level</span>
                  <span className="text-[13.5px] font-bold text-[var(--text-primary)] mt-[1px]">{profile.activityLevel}</span>
                </div>
              </div>

              <div className="flex items-center gap-[12px]">
                <div className="w-[30px] h-[30px] rounded-full bg-orange-500/5 text-orange-500 flex items-center justify-center flex-shrink-0">
                  <MapPin size={14} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-[var(--text-muted)] leading-tight">Location</span>
                  <span className="text-[13.5px] font-bold text-[var(--text-primary)] mt-[1px]">{profile.location}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Column 2: Body Statistics */}
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[var(--radius-md)] p-[24px] shadow-[var(--shadow-sm)] flex flex-col gap-[20px]">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-[15px] font-bold text-[var(--text-primary)] uppercase tracking-wider">
              Body Statistics
            </h3>
            <button 
              onClick={() => handleEdit('stats')}
              className="w-[28px] h-[28px] rounded-lg border border-[var(--border-color)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--accent-color)] hover:border-[var(--accent-color)] transition-colors cursor-pointer"
              title="Edit Stats Details"
            >
              <Edit2 size={13} />
            </button>
          </div>

          {editSection === 'stats' ? (
            <form onSubmit={handleSave} className="flex flex-col gap-[12px] flex-1 justify-center">
              <div>
                <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase mb-[4px]">Weight (kg)</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={formState.weight} 
                  onChange={(e) => setFormState({ ...formState, weight: parseFloat(e.target.value) })}
                  className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] rounded-lg p-[8px] text-[13px] text-[var(--text-primary)]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase mb-[4px]">BMI</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={formState.bmi} 
                  onChange={(e) => setFormState({ ...formState, bmi: parseFloat(e.target.value) })}
                  className="w-full bg-[var(--bg-input)] border border(--border-color)] rounded-lg p-[8px] text-[13px] text-[var(--text-primary)]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase mb-[4px]">Body Fat (%)</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={formState.bodyFat} 
                  onChange={(e) => setFormState({ ...formState, bodyFat: parseFloat(e.target.value) })}
                  className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] rounded-lg p-[8px] text-[13px] text-[var(--text-primary)]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase mb-[4px]">Muscle Mass (kg)</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={formState.muscleMass} 
                  onChange={(e) => setFormState({ ...formState, muscleMass: parseFloat(e.target.value) })}
                  className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] rounded-lg p-[8px] text-[13px] text-[var(--text-primary)]"
                />
              </div>
              <div className="flex justify-end gap-[8px] mt-[4px]">
                <button type="button" onClick={() => setEditSection(null)} className="px-[12px] py-[6px] text-[12px] border border-[var(--border-color)] rounded-md font-semibold text-[var(--text-secondary)]">Cancel</button>
                <button type="submit" className="px-[14px] py-[6px] bg-[var(--accent-color)] text-white rounded-md font-semibold text-[12px]">Save</button>
              </div>
            </form>
          ) : (
            <div className="flex flex-col gap-[20px] flex-1 justify-between">
              {/* 4 Stats Grid Layout */}
              <div className="grid grid-cols-2 gap-[12px]">
                {/* Weight */}
                <div className="bg-[var(--bg-input)] p-[12px] border border-[var(--border-color)] rounded-xl flex flex-col gap-[6px]">
                  <div className="flex items-center gap-[6px] text-[var(--text-muted)]">
                    <Scale size={14} className="text-sky-500" />
                    <span className="text-[10.5px] font-bold uppercase tracking-wide">Weight</span>
                  </div>
                  <span className="font-display text-[16px] font-extrabold text-[var(--text-primary)] leading-none">{profile.weight} kg</span>
                  <span className="text-[9px] font-bold text-emerald-600">Last updated: Today</span>
                </div>

                {/* BMI */}
                <div className="bg-[var(--bg-input)] p-[12px] border border-[var(--border-color)] rounded-xl flex flex-col gap-[6px]">
                  <div className="flex items-center gap-[6px] text-[var(--text-muted)]">
                    <User size={14} className="text-emerald-500" />
                    <span className="text-[10.5px] font-bold uppercase tracking-wide">BMI</span>
                  </div>
                  <span className="font-display text-[16px] font-extrabold text-[var(--text-primary)] leading-none">{profile.bmi}</span>
                  <span className="text-[9px] font-bold text-emerald-600">Normal</span>
                </div>

                {/* Body Fat */}
                <div className="bg-[var(--bg-input)] p-[12px] border border-[var(--border-color)] rounded-xl flex flex-col gap-[6px]">
                  <div className="flex items-center gap-[6px] text-[var(--text-muted)]">
                    <Sparkles size={14} className="text-amber-500" />
                    <span className="text-[10.5px] font-bold uppercase tracking-wide">Body Fat</span>
                  </div>
                  <span className="font-display text-[16px] font-extrabold text-[var(--text-primary)] leading-none">{profile.bodyFat} %</span>
                  <span className="text-[9px] font-bold text-emerald-600">Healthy</span>
                </div>

                {/* Muscle Mass */}
                <div className="bg-[var(--bg-input)] p-[12px] border border-[var(--border-color)] rounded-xl flex flex-col gap-[6px]">
                  <div className="flex items-center gap-[6px] text-[var(--text-muted)]">
                    <Activity size={14} className="text-purple-500" />
                    <span className="text-[10.5px] font-bold uppercase tracking-wide">Muscle Mass</span>
                  </div>
                  <span className="font-display text-[16px] font-extrabold text-[var(--text-primary)] leading-none">{profile.muscleMass} kg</span>
                  <span className="text-[9px] font-bold text-emerald-600">Good</span>
                </div>
              </div>

              {/* BMI Indicator scale */}
              <div className="flex flex-col gap-[6px] border-t border-[var(--border-color)] pt-[16px]">
                <div className="flex justify-between items-center">
                  <span className="text-[10.5px] font-bold text-[var(--text-muted)] uppercase tracking-wider">BMI Indicator</span>
                  <span className="text-[12px] font-extrabold text-[#10b981]">{profile.bmi}</span>
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
          )}
        </div>

        {/* Column 3: Health Goals */}
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[var(--radius-md)] p-[24px] shadow-[var(--shadow-sm)] flex flex-col gap-[20px]">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-[15px] font-bold text-[var(--text-primary)] uppercase tracking-wider">
              Health Goals
            </h3>
            <button 
              onClick={() => handleEdit('goals')}
              className="w-[28px] h-[28px] rounded-lg border border-[var(--border-color)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--accent-color)] hover:border-[var(--accent-color)] transition-colors cursor-pointer"
              title="Edit Goals Details"
            >
              <Edit2 size={13} />
            </button>
          </div>

          {editSection === 'goals' ? (
            <form onSubmit={handleSave} className="flex flex-col gap-[12px]">
              <div>
                <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase mb-[4px]">Primary Goal</label>
                <input 
                  type="text" 
                  value={formState.primaryGoal} 
                  onChange={(e) => setFormState({ ...formState, primaryGoal: e.target.value })}
                  className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] rounded-lg p-[8px] text-[13px] text-[var(--text-primary)]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase mb-[4px]">Target Weight (kg)</label>
                <input 
                  type="number" 
                  value={formState.targetWeight} 
                  onChange={(e) => setFormState({ ...formState, targetWeight: parseInt(e.target.value) })}
                  className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] rounded-lg p-[8px] text-[13px] text-[var(--text-primary)]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase mb-[4px]">Target Date</label>
                <input 
                  type="text" 
                  value={formState.targetDate} 
                  onChange={(e) => setFormState({ ...formState, targetDate: e.target.value })}
                  className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] rounded-lg p-[8px] text-[13px] text-[var(--text-primary)]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase mb-[4px]">Progress (%)</label>
                <input 
                  type="number" 
                  value={formState.progress} 
                  onChange={(e) => setFormState({ ...formState, progress: parseInt(e.target.value) })}
                  className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] rounded-lg p-[8px] text-[13px] text-[var(--text-primary)]"
                />
              </div>
              <div className="flex justify-end gap-[8px] mt-[4px]">
                <button type="button" onClick={() => setEditSection(null)} className="px-[12px] py-[6px] text-[12px] border border-[var(--border-color)] rounded-md font-semibold text-[var(--text-secondary)]">Cancel</button>
                <button type="submit" className="px-[14px] py-[6px] bg-[var(--accent-color)] text-white rounded-md font-semibold text-[12px]">Save</button>
              </div>
            </form>
          ) : (
            <div className="flex flex-col gap-[14px]">
              <div className="flex items-center gap-[12px]">
                <div className="w-[30px] h-[30px] rounded-full bg-[rgba(16,185,129,0.06)] text-[var(--accent-color)] flex items-center justify-center flex-shrink-0">
                  <Target size={14} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-[var(--text-muted)] leading-tight">Primary Goal</span>
                  <span className="text-[13.5px] font-bold text-[var(--text-primary)] mt-[1px]">{profile.primaryGoal}</span>
                </div>
              </div>

              <div className="flex items-center gap-[12px]">
                <div className="w-[30px] h-[30px] rounded-full bg-cyan-500/5 text-cyan-500 flex items-center justify-center flex-shrink-0">
                  <Dumbbell size={14} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-[var(--text-muted)] leading-tight">Target Weight</span>
                  <span className="text-[13.5px] font-bold text-[var(--text-primary)] mt-[1px]">{profile.targetWeight} kg</span>
                </div>
              </div>

              <div className="flex items-center gap-[12px]">
                <div className="w-[30px] h-[30px] rounded-full bg-amber-500/5 text-amber-500 flex items-center justify-center flex-shrink-0">
                  <Calendar size={14} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-[var(--text-muted)] leading-tight">Target Date</span>
                  <span className="text-[13.5px] font-bold text-[var(--text-primary)] mt-[1px]">{profile.targetDate}</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="flex items-center gap-[12px]">
                <div className="w-[30px] h-[30px] rounded-full bg-purple-500/5 text-purple-500 flex items-center justify-center flex-shrink-0">
                  <TrendingUp size={14} />
                </div>
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] text-[var(--text-muted)] leading-none">Progress</span>
                    <span className="text-[11px] font-bold text-[var(--text-primary)] leading-none">{profile.progress}%</span>
                  </div>
                  <div className="w-full h-[6px] bg-[var(--bg-primary)] rounded-full overflow-hidden mt-[6px]">
                    <div 
                      className="h-full bg-[var(--accent-color)] rounded-full transition-all duration-750" 
                      style={{ width: `${profile.progress}%` }} 
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-[12px]">
                <div className="w-[30px] h-[30px] rounded-full bg-pink-500/5 text-pink-500 flex items-center justify-center flex-shrink-0">
                  <Heart size={14} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-[var(--text-muted)] leading-tight">Motivation</span>
                  <span className="text-[13px] font-semibold text-[var(--text-secondary)] mt-[2px] leading-tight">
                    {profile.motivation}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Bottom Row Grid (Diet Preferences & Settings) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[28px]">
        
        {/* Diet Preferences card (col-span-2) */}
        <div className="lg:col-span-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[var(--radius-md)] p-[24px] shadow-[var(--shadow-sm)] flex flex-col gap-[20px]">
          <div>
            <h3 className="font-display text-[15px] font-bold text-[var(--text-primary)] uppercase tracking-wider mb-[12px]">
              Dietary Preferences
            </h3>
            <div className="flex flex-wrap items-center gap-[8px]">
              <div className="flex items-center gap-[6px] px-[12px] py-[8px] bg-emerald-500/5 border border-emerald-500/10 text-[var(--accent-color)] font-semibold text-[13px] rounded-full">
                <Egg size={13} />
                <span>Non-Vegetarian</span>
              </div>
              <div className="flex items-center gap-[6px] px-[12px] py-[8px] bg-emerald-500/5 border border-emerald-500/10 text-[var(--accent-color)] font-semibold text-[13px] rounded-full">
                <Milk size={13} />
                <span>High Protein</span>
              </div>
              <div className="flex items-center gap-[6px] px-[12px] py-[8px] bg-emerald-500/5 border border-emerald-500/10 text-[var(--accent-color)] font-semibold text-[13px] rounded-full">
                <Cookie size={13} />
                <span>Low Sugar</span>
              </div>
              <div className="flex items-center gap-[6px] px-[12px] py-[8px] bg-emerald-500/5 border border-emerald-500/10 text-[var(--accent-color)] font-semibold text-[13px] rounded-full">
                <Wheat size={13} />
                <span>No Gluten</span>
              </div>
              <div className="flex items-center gap-[6px] px-[12px] py-[8px] bg-emerald-500/5 border border-emerald-500/10 text-[var(--accent-color)] font-semibold text-[13px] rounded-full">
                <Wheat size={13} />
                <span>Low Carb</span>
              </div>
            </div>
          </div>

          <div className="border-t border-[var(--border-color)] pt-[16px]">
            <h3 className="font-display text-[15px] font-bold text-[var(--text-primary)] uppercase tracking-wider mb-[12px]">
              Allergies
            </h3>
            <div className="flex flex-wrap items-center gap-[8px]">
              <div className="px-[12px] py-[8px] bg-rose-500/5 border border-rose-500/10 text-rose-500 font-semibold text-[13px] rounded-full">
                &bull; Peanuts
              </div>
              <div className="px-[12px] py-[8px] bg-rose-500/5 border border-rose-500/10 text-rose-500 font-semibold text-[13px] rounded-full">
                &bull; Dairy
              </div>
              <div className="px-[12px] py-[8px] bg-rose-500/5 border border-rose-500/10 text-rose-500 font-semibold text-[13px] rounded-full">
                &bull; Shellfish
              </div>
            </div>
          </div>
        </div>

        {/* Account & Settings card (col-span-1) */}
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[var(--radius-md)] p-[24px] shadow-[var(--shadow-sm)] flex flex-col gap-[20px] justify-between">
          <h3 className="font-display text-[15px] font-bold text-[var(--text-primary)] uppercase tracking-wider">
            Account & Settings
          </h3>

          <div className="flex flex-col gap-[4px] flex-1 justify-center my-[8px]">
            <button 
              onClick={() => showToast('Redirecting to password update...')}
              className="flex items-center justify-between w-full p-[12px] rounded-lg hover:bg-[var(--bg-primary)] transition-colors cursor-pointer text-left text-[13.5px] text-[var(--text-secondary)] font-semibold"
            >
              <div className="flex items-center gap-[10px]">
                <Lock size={15} className="text-[var(--text-muted)]" />
                <span>Change Password</span>
              </div>
              <ChevronRight size={14} className="text-[var(--text-muted)]" />
            </button>

            <button 
              onClick={() => showToast('Redirecting to notification configurations...')}
              className="flex items-center justify-between w-full p-[12px] rounded-lg hover:bg-[var(--bg-primary)] transition-colors cursor-pointer text-left text-[13.5px] text-[var(--text-secondary)] font-semibold"
            >
              <div className="flex items-center gap-[10px]">
                <Bell size={15} className="text-[var(--text-muted)]" />
                <span>Notification Settings</span>
              </div>
              <ChevronRight size={14} className="text-[var(--text-muted)]" />
            </button>

            <button 
              onClick={() => showToast('Redirecting to privacy configurations...')}
              className="flex items-center justify-between w-full p-[12px] rounded-lg hover:bg-[var(--bg-primary)] transition-colors cursor-pointer text-left text-[13.5px] text-[var(--text-secondary)] font-semibold"
            >
              <div className="flex items-center gap-[10px]">
                <Shield size={15} className="text-[var(--text-muted)]" />
                <span>Privacy Settings</span>
              </div>
              <ChevronRight size={14} className="text-[var(--text-muted)]" />
            </button>
          </div>

          <button 
            onClick={() => showToast('Signing out...')}
            className="flex items-center gap-[8px] w-full justify-center py-[11px] border border-rose-500/20 hover:border-rose-500 hover:bg-rose-500/5 text-rose-500 rounded-lg text-[13.5px] font-display font-semibold transition-[var(--transition-fast)] cursor-pointer"
          >
            <LogOut size={14} />
            <span>Log Out</span>
          </button>
        </div>

      </div>

    </div>
  );
}
