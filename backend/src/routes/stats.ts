import { Request, Response, Router } from "express";
import Meal from "../models/Meal";
import WaterIntake from "../models/Water";
import auth from "../middleware/auth";

const router = Router();

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

function todayString(): string {
  return new Date().toISOString().slice(0, 10);
}

function dateString(offsetDays: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - offsetDays);
  return d.toISOString().slice(0, 10);
}

router.get("/weekly", auth, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const days = Math.min(Math.max(Number(req.query.days) || 7, 1), 365);
    const startDate = dateString(days - 1);

    const [meals, waters] = await Promise.all([
      Meal.find({ userId: req.user.id, date: { $gte: startDate } }),
      WaterIntake.find({ userId: req.user.id, date: { $gte: startDate } }),
    ]);

    const mealTotals = new Map<string, { calories: number; protein: number; carbs: number; fat: number }>();
    for (const meal of meals) {
      const totals = mealTotals.get(meal.date) || {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      };
      for (const item of meal.items || []) {
        totals.calories += item.calories;
        totals.protein += item.protein;
        totals.carbs += item.carbs;
        totals.fat += item.fat;
      }
      mealTotals.set(meal.date, totals);
    }

    const waterTotals = new Map<string, number>();
    for (const water of waters) {
      waterTotals.set(water.date, water.liters);
    }

    const dayEntries = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = dateString(i);
      const meal = mealTotals.get(date);
      dayEntries.push({
        date,
        calories: Math.round(meal?.calories || 0),
        protein: round(meal?.protein || 0),
        carbs: round(meal?.carbs || 0),
        fat: round(meal?.fat || 0),
        water: round(waterTotals.get(date) || 0),
      });
    }

    res.json({ days: dayEntries });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
