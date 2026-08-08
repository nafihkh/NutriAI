import mongoose, { Schema, Document } from "mongoose";

export interface IWaterIntake extends Document {
  userId: mongoose.Types.ObjectId;
  date: string;
  liters: number;
}

const waterIntakeSchema = new Schema<IWaterIntake>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: String, required: true },
    liters: { type: Number, default: 0 },
  },
  { timestamps: true }
);

waterIntakeSchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.model<IWaterIntake>("WaterIntake", waterIntakeSchema);
