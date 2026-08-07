"use client";

import React, { useState } from 'react';
import { Plus, Coffee, Utensils, Moon, Apple, Droplet, GlassWater, Sparkles, Check } from 'lucide-react';
import { useMainLayout } from '@/components/MainLayout';

export default function NutritionPage() {
  const { showToast } = useMainLayout() || { showToast: () => {} };

  // Simulated water logs state
  const [waterIntake, setWaterIntake] = useState(1.8);
  const waterTarget = 3.0;

  // Initial logged meals
  const [loggedMeals, setLoggedMeals] = useState([
    { id: 1, name: 'Breakfast', food: 'Oatmeal with Blueberries, Honey & Whey', calories: 420, protein: 32, carbs: 55, fats: 8, icon: Coffee },
    { id: 2, name: 'Lunch', desc: 'Grilled Chicken Salad with Quinoa & Avocado', calories: 520, protein: 42, carbs: 45, fats: 16, icon: Utensils },
    { id: 3, name: 'Dinner', food: 'Seared Salmon with Steamed Asparagus', calories: 380, protein: 35, carbs: 12, fats: 22, icon: Moon },
  ]);

  // Form input states
  const [foodName, setFoodName] = useState('');
  const [mealCategory, setMealCategory] = useState('Breakfast');
  const [caloriesInput, setCaloriesInput] = useState('');
  const [proteinInput, setProteinInput] = useState('');
  const [carbsInput, setCarbsInput] = useState('');
  const [fatsInput, setFatsInput] = useState('');

  const addMeal = (e) => {
    e.preventDefault();
    if (!foodName || !caloriesInput) {
      showToast('Please enter at least a Food Name and Calories count.');
      return;
    }

    const icons = {
      Breakfast: Coffee,
      Lunch: Utensils,
      Dinner: Moon,
      Snacks: Apple
    };

    const newMeal = {
      id: Date.now(),
      name: mealCategory,
      food: foodName,
      calories: parseInt(caloriesInput),
      protein: parseInt(proteinInput) || 0,
      carbs: parseInt(carbsInput) || 0,
      fats: parseInt(fatsInput) || 0,
      icon: icons[mealCategory] || Apple
    };

    setLoggedMeals(prev => [...prev, newMeal]);
    showToast(`Logged ${foodName} successfully!`);
    
    // Clear form inputs
    setFoodName('');
    setCaloriesInput('');
    setProteinInput('');
    setCarbsInput('');
    setFatsInput('');
  };

  const handleAddWater = (amount) => {
    const nextIntake = Math.min(waterIntake + amount, 5.0);
    setWaterIntake(parseFloat(nextIntake.toFixed(2)));
    showToast(`Added ${amount * 1000}ml of water.`);
  };

  const totalCalories = loggedMeals.reduce((sum, m) => sum + m.calories, 0);
  const totalProtein = loggedMeals.reduce((sum, m) => sum + m.protein, 0);
  const totalCarbs = loggedMeals.reduce((sum, m) => sum + m.carbs, 0);
  const totalFats = loggedMeals.reduce((sum, m) => sum + m.fats, 0);

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
              <span className="font-display text-[20px] font-extrabold text-[var(--text-primary)]">{totalCalories} kcal</span>
            </div>
            <div className="flex flex-col gap-[4px] border-r border-[var(--border-color)] last:border-0 pr-[12px]">
              <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Protein</span>
              <span className="font-display text-[20px] font-extrabold text-[var(--accent-color)]">{totalProtein} g</span>
            </div>
            <div className="flex flex-col gap-[4px] border-r border-[var(--border-color)] last:border-0 pr-[12px]">
              <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Carbs</span>
              <span className="font-display text-[20px] font-extrabold text-amber-500">{totalCarbs} g</span>
            </div>
            <div className="flex flex-col gap-[4px]">
              <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Fats</span>
              <span className="font-display text-[20px] font-extrabold text-rose-500">{totalFats} g</span>
            </div>
          </div>

          {/* Logged Meals List */}
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] p-[24px] rounded-[var(--radius-md)] shadow-[var(--shadow-sm)] flex flex-col gap-[20px]">
            <h3 className="font-display text-[16px] font-bold text-[var(--text-primary)]">
              Logged Meals
            </h3>

            <div className="flex flex-col gap-[12px]">
              {loggedMeals.map((meal) => {
                const Icon = meal.icon;
                return (
                  <div 
                    key={meal.id} 
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-[16px] rounded-[var(--radius-sm)] border border-[var(--border-color)] bg-[var(--bg-input)] gap-[12px]"
                  >
                    <div className="flex items-start gap-[12px]">
                      <div className="w-[36px] h-[36px] rounded-full bg-[rgba(16,185,129,0.06)] text-[var(--accent-color)] flex items-center justify-center flex-shrink-0">
                        <Icon size={16} />
                      </div>
                      <div>
                        <div className="flex items-center gap-[8px]">
                          <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                            {meal.name}
                          </span>
                        </div>
                        <h4 className="text-[14.5px] font-bold text-[var(--text-primary)] mt-[2px]">
                          {meal.food || meal.desc}
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-[20px] justify-between sm:justify-end border-t sm:border-t-0 border-[var(--border-color)] pt-[10px] sm:pt-0">
                      <div className="flex gap-[12px] text-[11px] font-semibold text-[var(--text-muted)]">
                        <span>P: <strong className="text-[var(--text-primary)]">{meal.protein || 0}g</strong></span>
                        <span>C: <strong className="text-[var(--text-primary)]">{meal.carbs || 0}g</strong></span>
                        <span>F: <strong className="text-[var(--text-primary)]">{meal.fats || 0}g</strong></span>
                      </div>
                      <span className="font-display font-extrabold text-[15px] text-[var(--text-primary)]">
                        {meal.calories} kcal
                      </span>
                    </div>
                  </div>
                );
              })}
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
            
            <form onSubmit={addMeal} className="flex flex-col gap-[14px]">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-[6px]">Meal Category</label>
                <div className="grid grid-cols-4 gap-[4px] bg-[var(--bg-primary)] p-[3px] rounded-lg border border-[var(--border-color)]">
                  {['Breakfast', 'Lunch', 'Dinner', 'Snacks'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setMealCategory(cat)}
                      className={`py-[6px] text-[11px] font-bold rounded-md transition-[var(--transition-fast)] cursor-pointer ${
                        mealCategory === cat
                          ? 'bg-[var(--bg-secondary)] text-[var(--accent-color)] shadow-[var(--shadow-sm)]'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      {cat.slice(0, 5)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-[6px]">Food Item Name</label>
                <input
                  type="text"
                  placeholder="e.g., Avocado Toast with Poached Eggs"
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] outline-none focus:border-[var(--accent-color)] rounded-lg p-[10px] text-[13.5px] text-[var(--text-primary)] transition-[var(--transition-fast)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-[10px]">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-[6px]">Calories (kcal)</label>
                  <input
                    type="number"
                    placeholder="e.g. 350"
                    value={caloriesInput}
                    onChange={(e) => setCaloriesInput(e.target.value)}
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] outline-none focus:border-[var(--accent-color)] rounded-lg p-[10px] text-[13.5px] text-[var(--text-primary)] transition-[var(--transition-fast)]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-[6px]">Protein (g)</label>
                  <input
                    type="number"
                    placeholder="e.g. 20"
                    value={proteinInput}
                    onChange={(e) => setProteinInput(e.target.value)}
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] outline-none focus:border-[var(--accent-color)] rounded-lg p-[10px] text-[13.5px] text-[var(--text-primary)] transition-[var(--transition-fast)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-[10px]">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-[6px]">Carbs (g)</label>
                  <input
                    type="number"
                    placeholder="e.g. 40"
                    value={carbsInput}
                    onChange={(e) => setCarbsInput(e.target.value)}
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] outline-none focus:border-[var(--accent-color)] rounded-lg p-[10px] text-[13.5px] text-[var(--text-primary)] transition-[var(--transition-fast)]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-[6px]">Fats (g)</label>
                  <input
                    type="number"
                    placeholder="e.g. 10"
                    value={fatsInput}
                    onChange={(e) => setFatsInput(e.target.value)}
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] outline-none focus:border-[var(--accent-color)] rounded-lg p-[10px] text-[13.5px] text-[var(--text-primary)] transition-[var(--transition-fast)]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-[11px] bg-[var(--accent-color)] hover:bg-[var(--text-primary)] text-white font-display font-semibold rounded-lg text-[13.5px] shadow-sm transition-[var(--transition-fast)] cursor-pointer mt-[6px]"
              >
                Log Meal Entry
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
