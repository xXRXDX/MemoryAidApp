// src/utils/questGenerator.js
import QuestTemplates from "./questTemplates.js";
import { computeDifficultyLevel, scaleAmount, computeXP } from "./difficultyScaler.js";
import UserQuest from "../models/UserQuest.js";
import Quest from "../models/Quest.js";
import User from "../models/User.js";

function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function formatAction(action, amount) { return action.replace("{amount}", amount); }

async function createUserQuestFromTemplate(template, user, difficultyLevel) {
  const amount = scaleAmount(template.baseAmount || 1, difficultyLevel);
  const xpReward = computeXP(template.baseXP || 10, difficultyLevel, template.rarity);
  const payload = {
    userId: user._id,
    questId: template._id || null,
    title: template.title,
    type: decideTypeByCategory(template.category),
    difficultyScore: difficultyLevel,
    xpReward,
    action: formatAction(template.action || template.title, amount),
    amount,
    unit: template.unit || "",
    category: template.category,
    rarity: template.rarity || "common",
    dateAssigned: new Date()
  };
  const uq = await UserQuest.create(payload);
  return uq;
}

function decideTypeByCategory(category) {
  const dailyCats = ["habit", "health", "mental", "productivity"];
  const mainCats = ["study", "physical", "creative"];
  const sideCats = ["social"];
  if (dailyCats.includes(category)) return "daily";
  if (mainCats.includes(category)) return "main";
  if (sideCats.includes(category)) return "side";
  return "daily";
}

async function generateDailySet(userId, opts = { force: false }) {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  if (!opts.force) {
    const start = new Date(); start.setHours(0, 0, 0, 0);
    const end = new Date(); end.setHours(23, 59, 59, 999);
    const existing = await UserQuest.countDocuments({ userId, dateAssigned: { $gte: start, $lte: end } });
    if (existing >= 5) {
      const docs = await UserQuest.find({ userId, dateAssigned: { $gte: start, $lte: end } });
      return docs;
    }
  }

  const difficultyLevel = await computeDifficultyLevel(user);
  const dailyPool = QuestTemplates.filter(t => ["habit", "health", "mental", "productivity"].includes(t.category));
  const mainPool = QuestTemplates.filter(t => ["study", "physical", "creative"].includes(t.category));
  const sidePool = QuestTemplates.filter(t => ["social"].includes(t.category));

  function pickN(pool, n) {
    const copy = [...pool]; const out = [];
    while (out.length < n && copy.length) { const i = Math.floor(Math.random() * copy.length); out.push(copy.splice(i, 1)[0]); }
    return out;
  }

  const chosenDaily = pickN(dailyPool, 3);
  const chosenMain = pickN(mainPool, 1);
  const chosenSide = pickN(sidePool, 1);

  const created = [];
  for (const t of chosenDaily) { created.push(await createUserQuestFromTemplate(t, user, difficultyLevel)); }
  for (const t of chosenMain) { created.push(await createUserQuestFromTemplate(t, user, difficultyLevel + 1)); }
  for (const t of chosenSide) { created.push(await createUserQuestFromTemplate(t, user, Math.max(1, difficultyLevel - 1))); }

  return created;
}

async function generateOneMain(userId) {
  const user = await User.findById(userId);
  const difficultyLevel = await computeDifficultyLevel(user);
  const pool = QuestTemplates.filter(t => ["study", "physical", "creative"].includes(t.category));
  const template = pickRandom(pool);
  return createUserQuestFromTemplate(template, user, difficultyLevel + 1);
}

async function generateOneSide(userId) {
  const user = await User.findById(userId);
  const difficultyLevel = await computeDifficultyLevel(user);
  const pool = QuestTemplates.filter(t => ["social"].includes(t.category));
  const template = pickRandom(pool);
  return createUserQuestFromTemplate(template, user, Math.max(1, difficultyLevel - 1));
}

export default {
  generateDailySet,
  generateOneMain,
  generateOneSide,
  createUserQuestFromTemplate,
  QuestTemplates
};
