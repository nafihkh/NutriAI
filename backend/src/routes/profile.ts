import { Request, Response, Router } from "express";
import Profile from "../models/Profile";
import WeightLog from "../models/WeightLog";
import auth from "../middleware/auth";
import { calculateTargets } from "../utils/nutrition";

const router = Router();

router.post("/", auth, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const {
      age,
      gender,
      heightCm,
      weightKg,
      goal,
      activityLevel,
      dietPreference,
      allergies,
    } = req.body;

    if (!age || !gender || !heightCm || !weightKg || !goal || !activityLevel) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    const profile = await Profile.findOneAndUpdate(
      { userId: req.user.id },
      {
        age,
        gender,
        heightCm,
        weightKg,
        goal,
        activityLevel,
        dietPreference,
        allergies: allergies || [],
      },
      { new: true, upsert: true }
    );

    const today = new Date().toISOString().slice(0, 10);
    await WeightLog.findOneAndUpdate(
      { userId: req.user.id, date: today },
      { weightKg },
      { upsert: true }
    );

    const targets = calculateTargets(profile);
    res.json({ profile, targets });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/", auth, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const profile = await Profile.findOne({ userId: req.user.id });
    if (!profile) {
      res
        .status(404)
        .json({ message: "No profile found. Please complete your health profile." });
      return;
    }

    const targets = calculateTargets(profile);
    res.json({ profile, targets });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
