const mongoose = require("mongoose");

const QuestSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: { type: String, enum: ["daily", "main", "side"], required: true },

    baseXP: { type: Number, default: 10 },      // XP before scaling
    category: { type: String, default: "general" }, // mental, physical, emotional
    description: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quest", QuestSchema);
