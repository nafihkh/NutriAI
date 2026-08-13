import mongoose, { Schema, Document } from "mongoose";

export interface IWeightLog extends Document {
  userId: mongoose.Types.ObjectId;
  date: string;
  weightKg: number;
}

const weightLogSchema = new Schema<IWeightLog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: String, required: true },
    weightKg: { type: Number, required: true },
  },
  { timestamps: true }
);

weightLogSchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.model<IWeightLog>("WeightLog", weightLogSchema);
