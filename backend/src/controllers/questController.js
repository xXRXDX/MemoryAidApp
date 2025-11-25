// src/controllers/questController.js
import questGenerator from "../utils/questGenerator.js";
import UserQuest from "../models/UserQuest.js";
import QuestTemplates from "../utils/questTemplates.js";
import Quest from "../models/Quest.js";
import User from "../models/User.js";

async function generateToday(req, res) {
  try {
    const userId = req.userId || req.user?.id;
    const created = await questGenerator.generateDailySet(userId, { force: false });
    return res.json({ success: true, message: "Today's quests ready", data: created });
  } catch (err) {
    console.error("generateToday err:", err);
    return res.status(500).json({ success: false, message: "Generation error", error: err.message });
  }
}

async function forceGenerate(req, res) {
  try {
    const userId = req.userId || req.user?.id;
    const created = await questGenerator.generateDailySet(userId, { force: true });
    return res.json({ success: true, message: "Forced generation done", data: created });
  } catch (err) {
    console.error("forceGenerate err:", err);
    return res.status(500).json({ success: false, message: "Generation error", error: err.message });
  }
}

async function generateMainQuest(req, res) {
  try {
    const userId = req.userId || req.user?.id;
    const quest = await questGenerator.generateOneMain(userId);
    return res.json({ success: true, message: "Main quest generated", data: quest });
  } catch (err) {
    console.error("generateMainQuest err:", err);
    return res.status(500).json({ success: false, message: "Error generating main quest" });
  }
}

async function generateSideQuest(req, res) {
  try {
    const userId = req.userId || req.user?.id;
    const quest = await questGenerator.generateOneSide(userId);
    return res.json({ success: true, message: "Side quest generated", data: quest });
  } catch (err) {
    console.error("generateSideQuest err:", err);
    return res.status(500).json({ success: false, message: "Error generating side quest" });
  }
}

async function regenerateToday(req, res) {
  try {
    const userId = req.userId || req.user?.id;
    const created = await questGenerator.generateDailySet(userId, { force: true });
    return res.json({ success: true, message: "Today's quests regenerated", data: created });
  } catch (err) {
    console.error("regenerateToday err:", err);
    return res.status(500).json({ success: false, message: "Error regenerating quests" });
  }
}

async function getTodayQuests(req, res) {
  try {
    const userId = req.userId || req.user?.id;
    const start = new Date(); start.setHours(0, 0, 0, 0);
    const end = new Date(); end.setHours(23, 59, 59, 999);
    const quests = await UserQuest.find({ userId, dateAssigned: { $gte: start, $lte: end } }).sort({ createdAt: 1 });
    return res.json({ success: true, data: quests });
  } catch (err) {
    console.error("getTodayQuests err:", err);
    return res.status(500).json({ success: false, message: "Error loading quests", error: err.message });
  }
}

async function completeQuest(req, res) {
  try {
    const questId = req.params.id;
    const userId = req.userId || req.user?.id;

    const quest = await UserQuest.findById(questId);
    if (!quest) return res.status(404).json({ success: false, message: "Quest not found" });
    if (quest.userId.toString() !== (userId).toString()) return res.status(403).json({ success: false, message: "Not your quest" });
    if (quest.isCompleted) return res.json({ success: true, message: "Already completed" });

    quest.isCompleted = true;
    quest.completedAt = new Date();
    await quest.save();

    const user = await User.findById(userId);
    const xp = quest.xpReward || 0;
    user.totalXP = (user.totalXP || 0) + xp;

    const cat = quest.category || quest.type || "general";
    if (["mental", "study", "habit", "productivity"].includes(cat)) {
      user.wisdomXP = (user.wisdomXP || 0) + xp;
    } else if (["physical"].includes(cat)) {
      user.strengthXP = (user.strengthXP || 0) + xp;
    } else {
      user.spiritXP = (user.spiritXP || 0) + xp;
    }

    // streak logic
    const now = new Date();
    const last = user.lastActiveDate ? new Date(user.lastActiveDate) : null;
    function isSameDay(d1, d2) { return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate(); }
    function isYesterday(d1, d2) { const y = new Date(d2); y.setDate(d2.getDate() - 1); return isSameDay(d1, y); }

    if (!last) user.streakCount = 1;
    else if (isSameDay(last, now)) user.streakCount = user.streakCount || 1;
    else if (isYesterday(last, now)) user.streakCount = (user.streakCount || 0) + 1;
    else user.streakCount = 1;

    user.lastActiveDate = now;
    await user.save();

    return res.json({ success: true, message: "Quest completed", data: { xpAwarded: xp, totalXP: user.totalXP, streakCount: user.streakCount } });
  } catch (err) {
    console.error("completeQuest err:", err);
    return res.status(500).json({ success: false, message: "Error completing quest", error: err.message });
  }
}

async function addCustomQuest(req, res) {
  try {
    const { title, action, category, baseAmount = 1, unit = "", baseXP = 10, baseDifficulty = 1, rarity = "common", type } = req.body;
    const quest = await Quest.create({ title, type: type || "daily", baseXP, description: action || "" });
    QuestTemplates.push({ key: `custom_${Date.now()}`, title, action: action || title, category, baseAmount, unit, baseDifficulty, baseXP, rarity });
    return res.json({ success: true, message: "Custom template added", data: { quest, template: QuestTemplates[QuestTemplates.length - 1] } });
  } catch (err) {
    console.error("addCustomQuest err:", err);
    return res.status(500).json({ success: false, message: "Error creating template", error: err.message });
  }
}

async function listTemplates(req, res) {
  try {
    return res.json({ success: true, data: QuestTemplates });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Error listing templates" });
  }
}

export default {
  generateToday,
  forceGenerate,
  generateMainQuest,
  generateSideQuest,
  regenerateToday,
  getTodayQuests,
  completeQuest,
  addCustomQuest,
  listTemplates
};
