import mongoose from "mongoose";

const MoodSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task", default: null },
  mood: { type: String, enum: ["happy", "sad", "neutral", "stressed", "angry"], required: true },
  note: { type: String },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("Mood", MoodSchema);
