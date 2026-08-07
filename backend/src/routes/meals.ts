import { Request, Response, Router } from "express";
import Meal from "../models/Meal";
import Food from "../models/Food";
import Profile from "../models/Profile";
import auth from "../middleware/auth";
import { calculateTargets } from "../utils/nutrition";

const router = Router();

function todayString(): string {
  return new Date().toISOString().slice(0, 10);
}

router.post("/", auth, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { foodId, quantity } = req.body;
    if (!foodId || !quantity) {
      res.status(400).json({ message: "foodId and quantity are required" });
      return;
    }

    const food = await Food.findById(foodId);
    if (!food) {
      res.status(404).json({ message: "Food not found" });
      return;
    }

    const grams = Number(quantity);
    if (grams <= 0) {
      res.status(400).json({ message: "Quantity must be positive" });
      return;
    }

    const ratio = grams / 100;
    const item = {
      foodId: food._id,
      name: food.name,
      quantity: grams,
      calories: Math.round(food.calories * ratio),
      protein: Math.round(food.protein * ratio * 10) / 10,
      carbs: Math.round(food.carbs * ratio * 10) / 10,
      fat: Math.round(food.fat * ratio * 10) / 10,
    };

    const meal = await Meal.findOneAndUpdate(
      { userId: req.user.id, date: todayString() },
      { $push: { items: item } },
      { new: true, upsert: true }
    );

    res.json({ meal });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/today", auth, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const meal = await Meal.findOne({ userId: req.user.id, date: todayString() });
    res.json({ meal: meal || { items: [] } });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/summary", auth, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const profile = await Profile.findOne({ userId: req.user.id });
    const meal = await Meal.findOne({ userId: req.user.id, date: todayString() });

    const totals = { calories: 0, protein: 0, carbs: 0, fat: 0 };
    for (const item of meal?.items || []) {
      totals.calories += item.calories;
      totals.protein += item.protein;
      totals.carbs += item.carbs;
      totals.fat += item.fat;
    }

    if (!profile) {
      res.json({
        hasProfile: false,
        consumed: totals,
        targets: null,
      });
      return;
    }

    const targets = calculateTargets(profile);
    res.json({
      hasProfile: true,
      consumed: {
        calories: Math.round(totals.calories),
        protein: Math.round(totals.protein * 10) / 10,
        carbs: Math.round(totals.carbs * 10) / 10,
        fat: Math.round(totals.fat * 10) / 10,
      },
      targets,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
