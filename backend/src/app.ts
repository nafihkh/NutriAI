import express from "express";
import cors from "cors";
import path from "path";
import "dotenv/config";
import connectDB from "./config/db";
import authRoutes from "./routes/auth";
import profileRoutes from "./routes/profile";
import mealRoutes from "./routes/meals";
import foodRoutes from "./routes/foods";
import waterRoutes from "./routes/water";
import avatarRoutes from "./routes/avatar";
import googleRoutes from "./routes/google";
import { seedFoods } from "./utils/seed";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/meals", mealRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/water", waterRoutes);
app.use("/api/users/avatar", avatarRoutes);
app.use("/api/auth/google", googleRoutes);

app.get("/", (req, res) => {
  res.send("NutriAI backend is running");
});

connectDB()
  .then(async () => {
    await seedFoods();
    app.listen(PORT, () => {
      console.log("Server running on port " + PORT);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
  });
