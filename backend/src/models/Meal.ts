import mongoose, { Schema, Document } from "mongoose";

export interface IMealItem {
  foodId: mongoose.Types.ObjectId;
  name: string;
  quantity: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface IMeal extends Document {
  userId: mongoose.Types.ObjectId;
  date: string;
  items: IMealItem[];
}

const mealItemSchema = new Schema<IMealItem>(
  {
    foodId: { type: Schema.Types.ObjectId, ref: "Food", required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    calories: { type: Number, required: true },
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fat: { type: Number, required: true },
  },
  { _id: false }
);

const mealSchema = new Schema<IMeal>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: String, required: true },
    items: { type: [mealItemSchema], default: [] },
  },
  { timestamps: true }
);

mealSchema.index({ userId: 1, date: 1 });

export default mongoose.model<IMeal>("Meal", mealSchema);
