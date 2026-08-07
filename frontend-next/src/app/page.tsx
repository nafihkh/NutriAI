"use client";

import React, { useState, useEffect } from 'react';
import {
  Flame, Dumbbell, Wheat, Droplet, Calendar, Sparkles, ChevronDown
} from 'lucide-react';
import DonutChart from '@/components/DonutChart';
import LineChart from '@/components/LineChart';
import BmiCard from '@/components/BmiCard';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMainLayout } from '@/components/MainLayout';
import { api, getToken, Summary, Profile, Targets, User, MealItem } from '@/lib/api';

export default function Dashboard() {
  const router = useRouter();
  const { showToast } = useMainLayout() || { showToast: () => {} };

  const [loaded, setLoaded] = useState(false);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [todayItems, setTodayItems] = useState<MealItem[]>([]);

  const [currentDate] = useState('Today');

  useEffect(() => {
    if (!getToken()) {
      router.replace('/login');
      return;
    }
    let cancelled = false;
    const profilePromise = api.getProfile().catch(() => null);
    Promise.all([api.getSummary(), api.getTodayMeals(), api.me(), profilePromise])
      .then(([s, t, me, p]) => {
        if (cancelled) return;
        setSummary(s);
        setTodayItems(t.meal?.items || []);
        setUser(me.user);
        setProfile(p ? p.profile : null);
        setLoaded(true);
      })
      .catch((err) => {
        if (cancelled) return;
        showToast(err instanceof Error ? err.message : 'Failed to load data');
        setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [router, showToast]);

  if (!loaded) {
    return <div className="text-[14px] text-[var(--text-muted)] py-[40px] text-center">Loading your dashboard...</div>;
  }

  const consumed = summary?.consumed ?? { calories: 0, protein: 0, carbs: 0, fat: 0 };
  const targets: Targets | null = summary?.targets ?? null;
  const totalCalories = consumed.calories;

  const pctOf = (value: number, target?: number) =>
    target ? Math.round((value / target) * 100) : 0;

  const overviewMetrics = [
    {
      name: 'Calories',
      value: totalCalories.toLocaleString(),
      target: targets ? `${targets.calories.toLocaleString()} kcal` : '--',
      pct: pctOf(consumed.calories, targets?.calories),
      icon: Flame,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10'
    },
    {
      name: 'Protein',
      value: String(consumed.protein),
      target: targets ? `${targets.protein} g` : '--',
      pct: pctOf(consumed.protein, targets?.protein),
      icon: Dumbbell,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10'
    },
    {
      name: 'Carbs',
      value: String(consumed.carbs),
      target: targets ? `${targets.carbs} g` : '--',
      pct: pctOf(consumed.carbs, targets?.carbs),
      icon: Wheat,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10'
    },
    {
      name: 'Fats',
      value: String(consumed.fat),
      target: targets ? `${targets.fat} g` : '--',
      pct: pctOf(consumed.fat, targets?.fat),
      icon: Droplet,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10'
    },
    {
      name: 'Water',
      value: '1.8',
      target: targets ? `${targets.water} L` : '--',
      pct: targets ? Math.round((1.8 / targets.water) * 100) : 0,
      icon: Droplet,
      color: 'text-sky-500',
      bg: 'bg-sky-500/10'
    }
  ];

  // Weekly Progress Data (mock for now)
  const calorieChartData = [
    { label: 'Mon', value: 1850, display: '1,850 kcal' },
    { label: 'Tue', value: 1620, display: '1,620 kcal' },
    { label: 'Wed', value: 1780, display: '1,780 kcal' },
    { label: 'Thu', value: totalCalories, display: `${totalCalories} kcal` },
    { label: 'Fri', value: 1690, display: '1,690 kcal' },
    { label: 'Sat', value: 1980, display: '1,980 kcal' },
    { label: 'Sun', value: 1810, display: '1,810 kcal' }
  ];

  // Weight Tracker Data (mock for now)
  const weightChartData = [
    { label: 'May 20', value: 75.8, display: '75.8 kg' },
    { label: '21', value: 75.2, display: '75.2 kg' },
    { label: '22', value: 74.5, display: '74.5 kg' },
    { label: '23', value: 74.0, display: '74.0 kg' },
    { label: '24', value: 73.4, display: '73.4 kg' },
    { label: '25', value: 72.8, display: '72.8 kg' },
    { label: '26', value: 72.5, display: '72.5 kg' }
  ];

  const currentWeight = profile ? `${profile.weightKg} kg` : '72.5 kg';
  const bmi = targets?.bmi ?? 22.4;

  return (
    <div className="flex flex-col gap-[28px]">

      {/* Top Welcome Title & Date Picker */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[16px]">
        <div>
          <span className="text-[14px] font-bold text-[var(--text-secondary)]">
            Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}, {user?.name ?? 'there'}! 👋
          </span>
          <h1 className="font-display text-[28px] md:text-[34px] font-extrabold text-[var(--text-primary)] tracking-tight mt-[4px]">
            Here&apos;s your health overview
          </h1>
          <p className="text-[14px] text-[var(--text-muted)] mt-[2px]">
            Stay consistent and achieve your goals.
          </p>
        </div>

        {/* Date Selector Dropdown */}
        <div
          onClick={() => showToast('Date selection modal coming soon!')}
          className="flex items-center gap-[10px] bg-[var(--bg-secondary)] border border-[var(--border-color)] px-[16px] py-[10px] rounded-[var(--radius-sm)] shadow-[var(--shadow-sm)] hover:border-[var(--accent-color)] hover:shadow-[var(--shadow-md)] cursor-pointer transition-[var(--transition-fast)] self-start sm:self-center"
        >
          <Calendar size={16} className="text-[var(--text-muted)]" />
          <span className="font-display font-semibold text-[13.5px] text-[var(--text-primary)]">
            {currentDate}
          </span>
          <ChevronDown size={14} className="text-[var(--text-muted)]" />
        </div>
      </div>

      {!summary?.hasProfile && (
        <div className="flex items-center justify-between gap-[16px] bg-[var(--bg-secondary)] border border-[var(--border-color)] p-[16px] rounded-[var(--radius-md)] shadow-[var(--shadow-sm)]">
          <p className="text-[13.5px] font-semibold text-[var(--text-primary)]">
            Set up your health profile to get personalized calorie and macro targets.
          </p>
          <Link
            href="/profile"
            className="flex-shrink-0 px-[14px] py-[8px] bg-[var(--accent-color)] hover:bg-[var(--text-primary)] text-white rounded-[var(--radius-sm)] font-display font-semibold text-[12.5px] transition-[var(--transition-fast)] cursor-pointer"
          >
            Complete Profile
          </Link>
        </div>
      )}

      {/* Metrics Row (5 Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-[16px]">
        {overviewMetrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.name}
              className="bg-[var(--bg-secondary)] border border-[var(--border-color)] p-[16px] rounded-[var(--radius-md)] shadow-[var(--shadow-sm)] flex flex-col gap-[12px] transition-all hover:-translate-y-[2px] hover:shadow-[var(--shadow-md)]"
            >
              <div className="flex items-center gap-[10px]">
                <div className={`w-[32px] h-[32px] rounded-full flex items-center justify-center ${metric.bg} ${metric.color}`}>
                  <Icon size={16} className="fill-current" />
                </div>
                <span className="text-[12px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                  {metric.name}
                </span>
              </div>

              <div className="flex flex-col gap-[4px] mt-[4px]">
                <div className="flex items-baseline gap-[4px]">
                  <span className="font-display text-[22px] font-extrabold text-[var(--text-primary)] leading-none">
                    {metric.value}
                  </span>
                  <span className="text-[12px] text-[var(--text-muted)]">
                    / {metric.target}
                  </span>
                </div>

                {/* Custom Progress Bar */}
                <div className="w-full h-[6px] bg-[var(--bg-primary)] rounded-full overflow-hidden mt-[6px]">
                  <div
                    className="h-full bg-[var(--accent-color)] rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${Math.min(metric.pct, 100)}%` }}
                  />
                </div>

                <span className="text-[11px] font-bold text-[var(--accent-color)] mt-[2px]">
                  {metric.pct}% of daily goal
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid of Columns (3 columns layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[28px]">

        {/* Column 1: Nutrition Summary & AI Insight */}
        <div className="flex flex-col gap-[28px]">
          {/* Nutrition Summary Card */}
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] p-[24px] rounded-[var(--radius-md)] shadow-[var(--shadow-sm)] flex flex-col gap-[20px]">
            <h3 className="font-display text-[16px] font-bold text-[var(--text-primary)]">
              Nutrition Summary
            </h3>
            <DonutChart calories={totalCalories} />
            <button
              onClick={() => showToast('Loading detailed macro report...')}
              className="w-full py-[11px] border border-[var(--border-color)] hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] bg-[var(--bg-primary)] text-[var(--text-secondary)] rounded-[var(--radius-sm)] font-display font-semibold text-[13.5px] transition-[var(--transition-fast)] cursor-pointer"
            >
              View Full Report
            </button>
          </div>

          {/* AI Nutrition Insight Card */}
          <div className="bg-[linear-gradient(135deg,rgba(16,185,129,0.08)_0%,rgba(6,186,212,0.04)_100%)] border border-[rgba(16,185,129,0.12)] p-[24px] rounded-[var(--radius-md)] shadow-[var(--shadow-sm)] flex flex-col gap-[16px] relative overflow-hidden">
            <div className="flex items-center gap-[8px]">
              <Sparkles size={18} className="text-[var(--accent-color)]" />
              <h4 className="font-display text-[15px] font-bold text-[var(--text-primary)]">
                AI Nutrition Insight
              </h4>
            </div>

            <p className="text-[13.5px] leading-[1.6] text-[var(--text-secondary)]">
              You&apos;re doing great! 💚 Try increasing your protein intake by adding eggs or Greek yogurt to your breakfast for better muscle recovery.
            </p>

            <Link
              href="/chat?q=How can I increase my protein intake in the morning?"
              className="inline-flex items-center justify-center py-[10px] px-[16px] bg-[var(--accent-color)] hover:bg-[var(--text-primary)] text-white rounded-[var(--radius-sm)] font-display font-semibold text-[13px] shadow-[0_4px_12px_rgba(16,185,129,0.15)] transition-[var(--transition-fast)] cursor-pointer self-start"
            >
              Ask AI Coach
            </Link>

            <div className="absolute right-[-20px] bottom-[-20px] w-[90px] h-[90px] rounded-full bg-[var(--accent-color)] opacity-[0.04] blur-xl" />
          </div>
        </div>

        {/* Column 2: Weekly Progress & Weight Tracker */}
        <div className="flex flex-col gap-[28px]">
          {/* Weekly Progress Card */}
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] p-[24px] rounded-[var(--radius-md)] shadow-[var(--shadow-sm)] flex flex-col gap-[16px]">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-[16px] font-bold text-[var(--text-primary)]">
                Weekly Progress
              </h3>

              {/* Metric Selector Dropdown */}
              <div
                onClick={() => showToast('Toggle view to protein or water progress')}
                className="flex items-center gap-[6px] px-[10px] py-[6px] rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] text-[12px] font-semibold text-[var(--text-secondary)] cursor-pointer"
              >
                <span>Calories</span>
                <ChevronDown size={12} />
              </div>
            </div>

            <LineChart
              data={calorieChartData}
              color="#10b981"
              gradientId="weekly-cal-grad"
              minVal={1000}
              maxVal={2200}
              highlightIndex={3}
              highlightLabel={`${totalCalories} kcal`}
            />

            <button
              onClick={() => showToast('Loading Weekly Progression Details...')}
              className="flex items-center justify-center gap-[6px] text-[13px] font-semibold text-[var(--text-secondary)] hover:text-[var(--accent-color)] mt-[8px] transition-[var(--transition-fast)] cursor-pointer w-fit mx-auto"
            >
              <span>View Progress Details</span>
              <span>→</span>
            </button>
          </div>

          {/* Weight Tracker Card */}
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] p-[24px] rounded-[var(--radius-md)] shadow-[var(--shadow-sm)] flex flex-col gap-[16px]">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-[16px] font-bold text-[var(--text-primary)]">
                Weight Tracker
              </h3>
              <span className="font-display font-extrabold text-[16px] text-[var(--accent-color)]">
                {currentWeight}
              </span>
            </div>

            <LineChart
              data={weightChartData}
              color="#06b6d4"
              gradientId="weight-grad"
              minVal={70}
              maxVal={78}
              highlightIndex={6}
              highlightLabel={currentWeight}
            />
          </div>
        </div>

        {/* Column 3: Today's Meals & BMI */}
        <div className="flex flex-col gap-[28px]">
          {/* Today's Meals Card */}
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] p-[24px] rounded-[var(--radius-md)] shadow-[var(--shadow-sm)] flex flex-col gap-[20px]">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-[16px] font-bold text-[var(--text-primary)]">
                Today&apos;s Meals
              </h3>
              <Link
                href="/nutrition"
                className="px-[12px] py-[6px] rounded-lg bg-[var(--bg-primary)] hover:bg-[rgba(16,185,129,0.06)] border border-[var(--border-color)] text-[11px] font-bold text-[var(--text-secondary)] transition-[var(--transition-fast)] cursor-pointer"
              >
                View All
              </Link>
            </div>

            {/* Meals List */}
            <div className="flex flex-col gap-[12px]">
              {todayItems.length === 0 && (
                <div className="text-[13px] text-[var(--text-muted)] py-[8px] text-center">
                  No meals logged today yet.
                </div>
              )}
              {todayItems.slice(0, 4).map((item, idx) => (
                <div
                  key={`${item.foodId}-${idx}`}
                  className="flex items-center justify-between p-[12px] rounded-[var(--radius-sm)] border border-[var(--border-color)] bg-[var(--bg-input)]"
                >
                  <div className="flex items-center gap-[12px] min-w-0">
                    <div className="w-[32px] h-[32px] rounded-full bg-[rgba(16,185,129,0.06)] text-[var(--accent-color)] flex items-center justify-center flex-shrink-0 text-[11px] font-bold">
                      {item.quantity}g
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-[13.5px] font-bold text-[var(--text-primary)] leading-tight truncate">
                        {item.name}
                      </h4>
                    </div>
                  </div>
                  <span className="font-display font-bold text-[13px] text-[var(--text-secondary)] flex-shrink-0 ml-[12px]">
                    {item.calories} kcal
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* BMI Card */}
          <BmiCard bmi={bmi} />
        </div>

      </div>
    </div>
  );
}
