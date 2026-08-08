import { Request, Response, Router } from "express";
import WaterIntake from "../models/Water";
import auth from "../middleware/auth";

const router = Router();

const MAX_DAILY_LITERS = 10;

function todayString(): string {
  return new Date().toISOString().slice(0, 10);
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

router.get("/", auth, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const water = await WaterIntake.findOne({
      userId: req.user.id,
      date: todayString(),
    });

    res.json({
      water: water
        ? { date: water.date, liters: round(water.liters) }
        : { date: todayString(), liters: 0 },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", auth, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const amount = Number(req.body.amount);
    if (!amount || amount <= 0) {
      res.status(400).json({ message: "amount must be a positive number" });
      return;
    }

    const water = await WaterIntake.findOneAndUpdate(
      { userId: req.user.id, date: todayString() },
      { $inc: { liters: amount } },
      { new: true, upsert: true }
    );

    if (water.liters > MAX_DAILY_LITERS) {
      water.liters = MAX_DAILY_LITERS;
      await water.save();
    }

    res.json({ water: { date: water.date, liters: round(water.liters) } });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/", auth, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    await WaterIntake.deleteOne({ userId: req.user.id, date: todayString() });

    res.json({ water: { date: todayString(), liters: 0 } });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
