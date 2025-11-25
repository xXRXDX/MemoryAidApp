// src/utils/difficultyScaler.js
const UserQuest = require("../models/UserQuest");

const RARITY_MULTIPLIER = {
  common: 1,
  uncommon: 1.2,
  rare: 1.5,
  epic: 2
};

/**
 * Compute a difficultyLevel integer for a user
 * influences scaling (higher => larger amounts and XP)
 */
async function computeDifficultyLevel(user) {
  // completed quests count (safe fallback to 0)
  const completedCount = await UserQuest.countDocuments({
    userId: user._id,
    isCompleted: true
  }).catch(() => 0);

  // formula tuned for prototypes: change constants to taste
  const levelFromXP = Math.floor((user.totalXP || 0) / 200);      // every 200 XP = +1
  const levelFromCompleted = Math.floor(completedCount / 50);    // every 50 finished quests = +1
  const levelFromStreak = Math.floor((user.streakCount || 0) / 5); // every 5-day streak = +1

  const difficultyLevel = 1 + levelFromXP + levelFromCompleted + levelFromStreak;
  return difficultyLevel;
}

/**
 * Convert a base amount into scaled amount using difficultyLevel
 */
function scaleAmount(baseAmount, difficultyLevel) {
  // mild scaling: +10% per difficulty level above 1
  const multiplier = 1 + (difficultyLevel - 1) * 0.12;
  // ensure that integer quantities stay sensible
  const scaled = Math.max(1, Math.round(baseAmount * multiplier));
  return scaled;
}

/**
 * Compute XP reward from template and difficulty level + rarity
 */
function computeXP(baseXP, difficultyLevel, rarity = "common") {
  const rarityMult = RARITY_MULTIPLIER[rarity] || 1;
  const xp = Math.round(baseXP * (1 + (difficultyLevel - 1) * 0.18) * rarityMult);
  return Math.max(1, xp);
}

module.exports = {
  computeDifficultyLevel,
  scaleAmount,
  computeXP,
  RARITY_MULTIPLIER
};
