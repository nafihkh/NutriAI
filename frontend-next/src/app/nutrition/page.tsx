"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Droplet, GlassWater, Search, Check } from 'lucide-react';
import { useMainLayout } from '@/components/MainLayout';
import { api, getToken, Summary, FoodItem, MealItem, Targets } from '@/lib/api';

const reload = async (
  setSummary: (s: Summary) => void,
  setTodayItems: (items: MealItem[]) => void
) => {
  const [s, t] = await Promise.all([api.getSummary(), api.getTodayMeals()]);
  setSummary(s);
  setTodayItems(t.meal?.items || []);
};

export default function NutritionPage() {
  const router = useRouter();
  const { showToast } = useMainLayout() || { showToast: () => {} };

  const [loaded, setLoaded] = useState(false);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [todayItems, setTodayItems] = useState<MealItem[]>([]);

  // Water (local state for now)
  const [waterIntake, setWaterIntake] = useState(1.8);
  const waterTarget = 3.0;

  // Food search form
  const [foodQuery, setFoodQuery] = useState('');
  const [results, setResults] = useState<FoodItem[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [grams, setGrams] = useState('');
  const [adding, setAdding] = useState(false);

  const refresh = () => reload(setSummary, setTodayItems);

  useEffect(() => {
    if (!getToken()) {
      router.replace('/login');
      return;
    }
    let cancelled = false;
    Promise.all([api.getSummary(), api.getTodayMeals()])
      .then(([s, t]) => {
        if (cancelled) return;
        setSummary(s);
        setTodayItems(t.meal?.items || []);
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

  // Debounced food search
  useEffect(() => {
    if (!foodQuery.trim() || !getToken()) return;
    const timer = setTimeout(() => {
      setSearching(true);
      api
        .searchFoods(foodQuery.trim())
        .then((res) => setResults(res.foods))
        .catch(() => setResults([]))
        .finally(() => setSearching(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [foodQuery]);

  const handleAddMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFood || !grams) {
      showToast('Select a food and enter the quantity in grams.');
      return;
    }
    setAdding(true);
    try {
      await api.addMeal(selectedFood._id, Number(grams));
      setSelectedFood(null);
      setFoodQuery('');
      setResults([]);
      setGrams('');
      await refresh();
      showToast(`Logged ${selectedFood.name} successfully!`);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to log meal');
    } finally {
      setAdding(false);
    }
  };

  const handleAddWater = (amount: number) => {
    const nextIntake = Math.min(waterIntake + amount, 5.0);
    setWaterIntake(parseFloat(nextIntake.toFixed(2)));
    showToast(`Added ${amount * 1000}ml of water.`);
  };

  if (!loaded) {
    return <div className="text-[14px] text-[var(--text-muted)] py-[40px] text-center">Loading your nutrition data...</div>;
  }

  const consumed = summary?.consumed ?? { calories: 0, protein: 0, carbs: 0, fat: 0 };
  const targets: Targets | null = summary?.targets ?? null;

  const totalCalories = consumed.calories;
  const totalProtein = consumed.protein;
  const totalCarbs = consumed.carbs;
  const totalFats = consumed.fat;

  return (
    <div className="flex flex-col gap-[28px]">

      {/* Page Title */}
      <div>
        <h1 className="font-display text-[28px] md:text-[34px] font-extrabold text-[var(--text-primary)] tracking-tight">
          Nutrition & Meal Logs
        </h1>
        <p className="text-[14.5px] text-[var(--text-muted)] mt-[4px]">
          Track your daily meals, macros breakdown, and water levels to hit your targets.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[28px]">

        {/* Left 2 Columns: Logged Meals & Stats */}
        <div className="lg:col-span-2 flex flex-col gap-[28px]">

          {/* Daily Macros Summary Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-[16px] bg-[var(--bg-secondary)] border border-[var(--border-color)] p-[20px] rounded-[var(--radius-md)] shadow-[var(--shadow-sm)]">
            <div className="flex flex-col gap-[4px] border-r border-[var(--border-color)] last:border-0 pr-[12px]">
              <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Calories</span>
              <span className="font-display text-[20px] font-extrabold text-[var(--text-primary)]">
                {totalCalories} <span className="text-[12px] text-[var(--text-muted)]">/ {targets?.calories ?? '--'} kcal</span>
              </span>
            </div>
            <div className="flex flex-col gap-[4px] border-r border-[var(--border-color)] last:border-0 pr-[12px]">
              <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Protein</span>
              <span className="font-display text-[20px] font-extrabold text-[var(--accent-color)]">
                {totalProtein} <span className="text-[12px] text-[var(--text-muted)]">/ {targets?.protein ?? '--'} g</span>
              </span>
            </div>
            <div className="flex flex-col gap-[4px] border-r border-[var(--border-color)] last:border-0 pr-[12px]">
              <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Carbs</span>
              <span className="font-display text-[20px] font-extrabold text-amber-500">
                {totalCarbs} <span className="text-[12px] text-[var(--text-muted)]">/ {targets?.carbs ?? '--'} g</span>
              </span>
            </div>
            <div className="flex flex-col gap-[4px]">
              <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Fats</span>
              <span className="font-display text-[20px] font-extrabold text-rose-500">
                {totalFats} <span className="text-[12px] text-[var(--text-muted)]">/ {targets?.fat ?? '--'} g</span>
              </span>
            </div>
          </div>

          {/* Logged Meals List */}
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] p-[24px] rounded-[var(--radius-md)] shadow-[var(--shadow-sm)] flex flex-col gap-[20px]">
            <h3 className="font-display text-[16px] font-bold text-[var(--text-primary)]">
              Logged Meals
            </h3>

            <div className="flex flex-col gap-[12px]">
              {todayItems.length === 0 && (
                <div className="text-[13.5px] text-[var(--text-muted)] py-[16px] text-center">
                  No meals logged today yet. Use the form to log your first meal.
                </div>
              )}
              {todayItems.map((item, idx) => (
                <div
                  key={`${item.foodId}-${idx}`}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-[16px] rounded-[var(--radius-sm)] border border-[var(--border-color)] bg-[var(--bg-input)] gap-[12px]"
                >
                  <div className="flex items-start gap-[12px]">
                    <div className="w-[36px] h-[36px] rounded-full bg-[rgba(16,185,129,0.06)] text-[var(--accent-color)] flex items-center justify-center flex-shrink-0">
                      <Check size={16} />
                    </div>
                    <div>
                      <div className="flex items-center gap-[8px]">
                        <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                          {item.quantity} g
                        </span>
                      </div>
                      <h4 className="text-[14.5px] font-bold text-[var(--text-primary)] mt-[2px]">
                        {item.name}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-[20px] justify-between sm:justify-end border-t sm:border-t-0 border-[var(--border-color)] pt-[10px] sm:pt-0">
                    <div className="flex gap-[12px] text-[11px] font-semibold text-[var(--text-muted)]">
                      <span>P: <strong className="text-[var(--text-primary)]">{item.protein}g</strong></span>
                      <span>C: <strong className="text-[var(--text-primary)]">{item.carbs}g</strong></span>
                      <span>F: <strong className="text-[var(--text-primary)]">{item.fat}g</strong></span>
                    </div>
                    <span className="font-display font-extrabold text-[15px] text-[var(--text-primary)]">
                      {item.calories} kcal
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Log New Meal & Water Intake */}
        <div className="flex flex-col gap-[28px]">

          {/* Add Food Log Form */}
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] p-[24px] rounded-[var(--radius-md)] shadow-[var(--shadow-sm)]">
            <h3 className="font-display text-[16px] font-bold text-[var(--text-primary)] mb-[16px]">
              Log New Food
            </h3>

            <form onSubmit={handleAddMeal} className="flex flex-col gap-[14px]">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-[6px]">Search Food</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g., rice, chicken, banana"
                    value={foodQuery}
                    onChange={(e) => {
                      const v = e.target.value;
                      setFoodQuery(v);
                      if (!v.trim()) setResults([]);
                      if (selectedFood && v !== selectedFood.name) setSelectedFood(null);
                    }}
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] outline-none focus:border-[var(--accent-color)] rounded-lg p-[10px] pl-[34px] text-[13.5px] text-[var(--text-primary)] transition-[var(--transition-fast)]"
                  />
                  <Search size={15} className="absolute left-[12px] top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                </div>

                {results.length > 0 && !selectedFood && (
                  <div className="mt-[8px] bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg overflow-hidden shadow-[var(--shadow-sm)] max-h-[200px] overflow-y-auto">
                    {searching && <div className="px-[12px] py-[10px] text-[12px] text-[var(--text-muted)]">Searching...</div>}
                    {results.map((food) => (
                      <button
                        key={food._id}
                        type="button"
                        onClick={() => {
                          setSelectedFood(food);
                          setFoodQuery(food.name);
                        }}
                        className="w-full flex items-center justify-between px-[12px] py-[10px] text-left hover:bg-[rgba(16,185,129,0.05)] border-b border-[var(--border-color)] last:border-0 transition-[var(--transition-fast)] cursor-pointer"
                      >
                        <span className="text-[13.5px] font-semibold text-[var(--text-primary)]">{food.name}</span>
                        <span className="text-[11px] font-bold text-[var(--text-muted)]">
                          {food.calories} kcal / {food.serving || '100 g'}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {selectedFood && (
                <div className="flex items-center justify-between bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg px-[12px] py-[10px]">
                  <div className="flex flex-col">
                    <span className="text-[13px] font-bold text-[var(--text-primary)]">{selectedFood.name}</span>
                    <span className="text-[11px] text-[var(--text-muted)]">
                      P {selectedFood.protein}g · C {selectedFood.carbs}g · F {selectedFood.fat}g per 100g
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFood(null);
                      setFoodQuery('');
                      setResults([]);
                    }}
                    className="text-[11px] font-bold text-[var(--accent-color)] hover:underline cursor-pointer"
                  >
                    Change
                  </button>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-[6px]">Quantity (grams)</label>
                <input
                  type="number"
                  placeholder="e.g. 150"
                  value={grams}
                  onChange={(e) => setGrams(e.target.value)}
                  className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] outline-none focus:border-[var(--accent-color)] rounded-lg p-[10px] text-[13.5px] text-[var(--text-primary)] transition-[var(--transition-fast)]"
                />
              </div>

              <button
                type="submit"
                disabled={adding}
                className="w-full py-[11px] bg-[var(--accent-color)] hover:bg-[var(--text-primary)] text-white font-display font-semibold rounded-lg text-[13.5px] shadow-sm transition-[var(--transition-fast)] cursor-pointer mt-[6px] disabled:opacity-60"
              >
                {adding ? 'Logging...' : 'Log Meal Entry'}
              </button>
            </form>
          </div>

          {/* Water Hydration Card */}
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] p-[24px] rounded-[var(--radius-md)] shadow-[var(--shadow-sm)] flex flex-col gap-[16px]">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-[16px] font-bold text-[var(--text-primary)]">
                Water Hydration
              </h3>
              <Droplet size={18} className="text-sky-500 fill-current" />
            </div>

            {/* Visual Glass Water Indicator */}
            <div className="flex items-center gap-[16px]">
              <div className="relative w-[50px] h-[80px] border-[3px] border-slate-300 dark:border-slate-500 rounded-b-xl rounded-t-sm overflow-hidden flex flex-col justify-end bg-slate-100 dark:bg-slate-800">
                <div
                  className="bg-sky-400 w-full transition-all duration-700 ease-out"
                  style={{ height: `${Math.min((waterIntake / waterTarget) * 100, 100)}%` }}
                />
              </div>
              <div className="flex flex-col justify-center">
                <span className="font-display text-[26px] font-extrabold text-[var(--text-primary)] leading-none">
                  {waterIntake} L
                </span>
                <span className="text-[12px] text-[var(--text-muted)] mt-[6px]">
                  Goal: {waterTarget} L ({Math.round((waterIntake / waterTarget) * 100)}%)
                </span>
              </div>
            </div>

            {/* Log buttons */}
            <div className="grid grid-cols-2 gap-[10px] mt-[4px]">
              <button
                onClick={() => handleAddWater(0.25)}
                className="flex items-center justify-center gap-[6px] py-[10px] border border-[var(--border-color)] hover:border-sky-400 text-[var(--text-secondary)] hover:text-sky-500 bg-[var(--bg-primary)] hover:bg-sky-50 dark:hover:bg-sky-950/20 rounded-lg text-[13px] font-semibold transition-[var(--transition-fast)] cursor-pointer"
              >
                <GlassWater size={14} />
                <span>+250 ml</span>
              </button>
              <button
                onClick={() => handleAddWater(0.5)}
                className="flex items-center justify-center gap-[6px] py-[10px] border border-[var(--border-color)] hover:border-sky-400 text-[var(--text-secondary)] hover:text-sky-500 bg-[var(--bg-primary)] hover:bg-sky-50 dark:hover:bg-sky-950/20 rounded-lg text-[13px] font-semibold transition-[var(--transition-fast)] cursor-pointer"
              >
                <GlassWater size={14} />
                <span>+500 ml</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
