import Food from "../models/Food";
import foods from "../data/foods.json";

export async function seedFoods(): Promise<void> {
  const count = await Food.countDocuments();
  if (count > 0) return;
  await Food.insertMany(foods);
  console.log("Seeded " + foods.length + " foods");
}
