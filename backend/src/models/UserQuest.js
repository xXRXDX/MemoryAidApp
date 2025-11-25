// src/models/UserQuest.js
const mongoose = require("mongoose");

const UserQuestSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    questId: { type: mongoose.Schema.Types.ObjectId, ref: "Quest", default: null },

    title: String,
    type: String,
    difficultyScore: { type: Number, default: 1 },

    xpReward: { type: Number, default: 10 },
    isCompleted: { type: Boolean, default: false },

    // additional fields for frontend
    action: { type: String, default: "" },
    amount: { type: Number, default: 1 },
    unit: { type: String, default: "" },
    category: { type: String, default: "general" },
    rarity: { type: String, default: "common" },

    dateAssigned: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserQuest", UserQuestSchema);
