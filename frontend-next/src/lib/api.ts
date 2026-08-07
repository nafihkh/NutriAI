const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

const TOKEN_KEY = "nutriai_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

interface RequestOptions extends RequestInit {}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `Request failed (${res.status})`);
  }
  return data;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Targets {
  bmi: number;
  bmr: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  water: number;
}

export interface Consumed {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface FoodItem {
  _id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving?: string;
}

export interface MealItem {
  foodId: string;
  name: string;
  quantity: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Summary {
  hasProfile: boolean;
  consumed: Consumed;
  targets: Targets | null;
}

export interface Profile {
  _id: string;
  age: number;
  gender: string;
  heightCm: number;
  weightKg: number;
  goal: string;
  activityLevel: string;
}

export const api = {
  register: (name: string, email: string, password: string) =>
    request<{ token: string; user: User }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),

  login: (email: string, password: string) =>
    request<{ token: string; user: User }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  me: () => request<{ user: User }>("/auth/me"),

  getSummary: () => request<Summary>("/meals/summary"),

  getTodayMeals: () => request<{ meal: { items: MealItem[] } }>("/meals/today"),

  getProfile: () => request<{ profile: Profile; targets: Targets }>("/profile"),

  saveProfile: (data: {
    age: number;
    gender: string;
    heightCm: number;
    weightKg: number;
    goal: string;
    activityLevel: string;
    dietPreference?: string;
    allergies?: string[];
  }) =>
    request<{ profile: Profile; targets: Targets }>("/profile", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  searchFoods: (q: string) =>
    request<{ foods: FoodItem[] }>(`/foods/search?q=${encodeURIComponent(q)}`),

  addMeal: (foodId: string, quantity: number) =>
    request<{ meal: { items: MealItem[] } }>("/meals", {
      method: "POST",
      body: JSON.stringify({ foodId, quantity }),
    }),
};
