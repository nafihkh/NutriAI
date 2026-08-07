import mongoose, { Schema, Document } from "mongoose";

export interface IFood extends Document {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving: string;
}

const foodSchema = new Schema<IFood>({
  name: { type: String, required: true, unique: true },
  calories: { type: Number, required: true },
  protein: { type: Number, required: true },
  carbs: { type: Number, required: true },
  fat: { type: Number, required: true },
  serving: { type: String, required: true },
});

export default mongoose.model<IFood>("Food", foodSchema);
