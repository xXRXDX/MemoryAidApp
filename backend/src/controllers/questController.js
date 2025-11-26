// src/controllers/questController.js
import * as generator from "../utils/questGenerator.js";
import UserQuest from "../models/UserQuest.js";
import QuestTemplates from "../utils/questTemplates.js";
import Quest from "../models/Quest.js";
import User from "../models/User.js";

export async function generateToday(req, res) {
  try {
    const userId = req.userId || req.user?.id;
    const created = await generator.generateDailySet(userId, { force: false });
    return res.json({ success: true, data: created });
  } catch (err) {
    console.error("generateToday:", err);
    return res.status(500).json({ success: false, message: "Generation error", error: err.message });
  }
}

export async function forceGenerate(req, res) {
  try {
    const userId = req.userId || req.user?.id;
    const created = await generator.generateDailySet(userId, { force: true });
    return res.json({ success: true, data: created });
  } catch (err) {
    console.error("forceGenerate:", err);
    return res.status(500).json({ success: false, message: "Generation error", error: err.message });
  }
}

export async function generateMainQuest(req, res) {
  try {
    const userId = req.userId || req.user?.id;
    const created = await generator.generateOneMain(userId);
    return res.json({ success: true, data: created });
  } catch (err) {
    console.error("generateMainQuest:", err);
    return res.status(500).json({ success: false, message: "Generation error", error: err.message });
  }
}

export async function generateSideQuest(req, res) {
  try {
    const userId = req.userId || req.user?.id;
    const created = await generator.generateOneSide(userId);
    return res.json({ success: true, data: created });
  } catch (err) {
    console.error("generateSideQuest:", err);
    return res.status(500).json({ success: false, message: "Generation error", error: err.message });
  }
}

export async function regenerateToday(req, res) {
  try {
    const userId = req.userId || req.user?.id;
    const created = await generator.generateDailySet(userId, { force: true });
    return res.json({ success: true, data: created });
  } catch (err) {
    console.error("regenerateToday:", err);
    return res.status(500).json({ success: false, message: "Regeneration error", error: err.message });
  }
}

export async function getTodayQuests(req, res) {
  try {
    const userId = req.userId || req.user?.id;
    const start = new Date(); start.setHours(0,0,0,0);
    const end = new Date(); end.setHours(23,59,59,999);
    const quests = await UserQuest.find({ userId, dateAssigned: { $gte: start, $lte: end }});
    return res.json({ success: true, data: quests });
  } catch (err) {
    console.error("getTodayQuests:", err);
    return res.status(500).json({ success: false, message: "Error loading quests", error: err.message });
  }
}

export async function completeQuest(req, res) {
  try {
    const qid = req.params.id;
    const uid = req.userId || req.user?.id;
    const quest = await UserQuest.findById(qid);
    if (!quest) return res.status(404).json({ success: false, message: "Quest not found" });
    if (quest.userId.toString() !== uid.toString()) return res.status(403).json({ success: false, message: "Not your quest" });
    if (quest.isCompleted) return res.json({ success: true, message: "Already completed" });

    quest.isCompleted = true;
    quest.completedAt = new Date();
    await quest.save();

    const user = await User.findById(uid);
    const xp = quest.xpReward || 0;
    user.totalXP = (user.totalXP || 0) + xp;

    const cat = quest.category || quest.type || 'general';
    if (['mental','study','habit','productivity'].includes(cat)) user.wisdomXP = (user.wisdomXP||0)+xp;
    else if (['physical'].includes(cat)) user.strengthXP = (user.strengthXP||0)+xp;
    else user.spiritXP = (user.spiritXP||0)+xp;

    // streak update
    const now = new Date();
    const last = user.lastActiveDate ? new Date(user.lastActiveDate) : null;
    function isSameDay(a,b){ return a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate(); }
    function isYesterday(a,b){ const y=new Date(b); y.setDate(b.getDate()-1); return isSameDay(a,y); }
    if (!last) user.streakCount = 1;
    else if (isSameDay(last, now)) user.streakCount = user.streakCount||1;
    else if (isYesterday(last, now)) user.streakCount = (user.streakCount||0)+1;
    else user.streakCount = 1;
    user.lastActiveDate = now;
    await user.save();

    return res.json({ success: true, data: { xpAwarded: xp, totalXP: user.totalXP, streakCount: user.streakCount } });
  } catch (err) {
    console.error("completeQuest:", err);
    return res.status(500).json({ success: false, message: "Completion error", error: err.message });
  }
}

export async function addCustomQuest(req, res) {
  try {
    const { title, action, category, baseAmount=1, unit='', baseXP=10, baseDifficulty=1, rarity='common', type } = req.body;
    const q = await Quest.create({ title, type: type||'daily', baseXP, description: action||title });
    QuestTemplates.push({ key:`custom_${Date.now()}`, title, action: action||title, category, baseAmount, unit, baseDifficulty, baseXP, rarity });
    return res.json({ success: true, data: { quest: q }});
  } catch (err) {
    console.error("addCustomQuest:", err);
    return res.status(500).json({ success: false, message: "Add template failed", error: err.message });
  }
}

export async function listTemplates(req, res) {
  try {
    return res.json({ success: true, data: QuestTemplates });
  } catch (err) {
    console.error("listTemplates:", err);
    return res.status(500).json({ success: false, message: "Error listing templates" });
  }
}
