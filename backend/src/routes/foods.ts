import { Request, Response, Router } from "express";
import Food from "../models/Food";
import auth from "../middleware/auth";

const router = Router();

router.get("/search", auth, async (req: Request, res: Response) => {
  try {
    const query = String(req.query.q || "").trim();
    if (!query) {
      res.json({ foods: [] });
      return;
    }

    const foods = await Food.find({ name: { $regex: query, $options: "i" } })
      .limit(10)
      .select("name calories protein carbs fat serving");

    res.json({ foods });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
