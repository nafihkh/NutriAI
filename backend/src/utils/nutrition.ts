import type { IProfile, ActivityLevel } from "../models/Profile";

export interface DailyTargets {
  bmi: number;
  bmr: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  water: number;
}

const ACTIVITY_FACTORS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

export function calculateBmi(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
}

export function calculateBmr(profile: IProfile): number {
  const base =
    10 * profile.weightKg + 6.25 * profile.heightCm - 5 * profile.age;
  return profile.gender === "male" ? base + 5 : base - 161;
}

export function calculateTargets(profile: IProfile): DailyTargets {
  const bmi = calculateBmi(profile.weightKg, profile.heightCm);
  const bmr = calculateBmr(profile);
  const maintenance = bmr * ACTIVITY_FACTORS[profile.activityLevel];

  let calories = maintenance;
  if (profile.goal === "lose_weight") calories = maintenance - 500;
  if (profile.goal === "gain_muscle") calories = maintenance + 300;

  let protein: number;
  if (profile.goal === "gain_muscle") protein = profile.weightKg * 2.0;
  else if (profile.goal === "lose_weight") protein = profile.weightKg * 1.8;
  else protein = profile.weightKg * 1.2;

  const fat = (calories * 0.25) / 9;
  const carbs = (calories - protein * 4 - fat * 9) / 4;
  const water = Math.round(profile.weightKg * 0.033 * 100) / 100;

  return {
    bmi: Math.round(bmi * 10) / 10,
    bmr: Math.round(bmr),
    calories: Math.round(calories),
    protein: Math.round(protein),
    carbs: Math.round(carbs),
    fat: Math.round(fat),
    water,
  };
}
