import mongoose, { Schema, Document } from "mongoose";

export type Goal = "lose_weight" | "gain_muscle" | "maintain_weight";
export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "very_active";

export interface IProfile extends Document {
  userId: mongoose.Types.ObjectId;
  age: number;
  gender: "male" | "female";
  heightCm: number;
  weightKg: number;
  goal: Goal;
  activityLevel: ActivityLevel;
  dietPreference?: string;
  allergies: string[];
}

const profileSchema = new Schema<IProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    age: { type: Number, required: true },
    gender: { type: String, enum: ["male", "female"], required: true },
    heightCm: { type: Number, required: true },
    weightKg: { type: Number, required: true },
    goal: {
      type: String,
      enum: ["lose_weight", "gain_muscle", "maintain_weight"],
      required: true,
    },
    activityLevel: {
      type: String,
      enum: ["sedentary", "light", "moderate", "active", "very_active"],
      required: true,
    },
    dietPreference: { type: String },
    allergies: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model<IProfile>("Profile", profileSchema);
