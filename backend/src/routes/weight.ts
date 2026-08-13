import { Request, Response, Router } from "express";
import WeightLog from "../models/WeightLog";
import auth from "../middleware/auth";

const router = Router();

const MIN_WEIGHT = 20;
const MAX_WEIGHT = 500;

function todayString(): string {
  return new Date().toISOString().slice(0, 10);
}

router.post("/", auth, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const weightKg = Number(req.body.weightKg);
    const date = req.body.date || todayString();

    if (!weightKg || weightKg <= 0) {
      res.status(400).json({ message: "weightKg must be a positive number" });
      return;
    }
    if (weightKg < MIN_WEIGHT || weightKg > MAX_WEIGHT) {
      res
        .status(400)
        .json({ message: `weightKg must be between ${MIN_WEIGHT} and ${MAX_WEIGHT} kg` });
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      res.status(400).json({ message: "date must be in YYYY-MM-DD format" });
      return;
    }

    const log = await WeightLog.findOneAndUpdate(
      { userId: req.user.id, date },
      { weightKg },
      { new: true, upsert: true }
    );

    res.json({ log });
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

    const days = Math.min(Math.max(Number(req.query.days) || 30, 1), 365);
    const since = new Date();
    since.setUTCDate(since.getUTCDate() - (days - 1));
    const sinceString = since.toISOString().slice(0, 10);

    const logs = await WeightLog.find({
      userId: req.user.id,
      date: { $gte: sinceString },
    }).sort({ date: -1 });

    res.json({
      logs,
      current: logs.length > 0 ? logs[0] : null,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
