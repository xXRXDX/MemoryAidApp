import UserQuest from "../models/UserQuest.js";

export function computeDifficultyLevelFromTemplate(template) {
  let difficulty = template.baseDifficulty || 1;
  const rarityWeights = { common: 0, uncommon: 1, rare: 2, epic: 3, legendary: 5 };
  difficulty += rarityWeights[template.rarity] || 0;
  const categoryMultiplier = { physical:1.2, mental:1.1, habit:1.0, productivity:1.3, creative:1.2, study:1.4, health:1.1, social:1.0 };
  difficulty *= categoryMultiplier[template.category] || 1;
  return Math.round(difficulty);
}

export async function computeDifficultyLevelForUser(user) {
  const completedCount = await UserQuest.countDocuments({ userId: user._id, isCompleted: true }).catch(()=>0);
  const levelFromXP = Math.floor((user.totalXP || 0) / 200);
  const levelFromCompleted = Math.floor(completedCount / 50);
  const levelFromStreak = Math.floor((user.streakCount || 0) / 5);
  return 1 + levelFromXP + levelFromCompleted + levelFromStreak;
}

export function scaleAmount(template, difficultyLevel) {
  const factor = 1 + difficultyLevel * 0.12;
  return Math.max(1, Math.round((template.baseAmount || 1) * factor));
}

export function computeXP(template, difficultyLevel) {
  const rarityXP = { common:0, uncommon:5, rare:12, epic:20, legendary:30 };
  return Math.max(1, Math.round((template.baseXP || 10) + difficultyLevel * 5 + (rarityXP[template.rarity] || 0)));
}