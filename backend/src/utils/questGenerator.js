import QuestTemplates from "./questTemplates.js";
import { computeDifficultyLevelForUser, computeDifficultyLevelFromTemplate, scaleAmount, computeXP } from "./difficultyScaler.js";
import UserQuest from "../models/UserQuest.js";
import Quest from "../models/Quest.js";
import User from "../models/User.js";

function pickRandom(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function formatAction(action, amount){ return action.replace('{amount}', amount); }

async function createUserQuestFromTemplate(template, user, difficultyLevel) {
  const amount = scaleAmount(template, difficultyLevel);
  const xpReward = computeXP(template, difficultyLevel);
  const payload = {
    userId: user._id,
    questId: template._id || null,
    title: template.title,
    type: decideTypeByCategory(template.category),
    difficultyScore: difficultyLevel,
    xpReward,
    action: formatAction(template.action || template.title, amount),
    amount,
    unit: template.unit || '',
    category: template.category,
    rarity: template.rarity || 'common',
    dateAssigned: new Date()
  };
  const uq = await UserQuest.create(payload);
  return uq;
}

function decideTypeByCategory(category){
  const dailyCats = ['habit','health','mental','productivity'];
  const mainCats = ['study','physical','creative'];
  const sideCats = ['social'];
  if (dailyCats.includes(category)) return 'daily';
  if (mainCats.includes(category)) return 'main';
  if (sideCats.includes(category)) return 'side';
  return 'daily';
}

export async function generateDailySet(userId, opts={force:false}){
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  if (!opts.force){
    const start = new Date(); start.setHours(0,0,0,0);
    const end = new Date(); end.setHours(23,59,59,999);
    const existing = await UserQuest.countDocuments({ userId, dateAssigned: { $gte: start, $lte: end }});
    if (existing >= 5) {
      const docs = await UserQuest.find({ userId, dateAssigned: { $gte: start, $lte: end }});
      return docs;
    }
  }

  const userDifficulty = await computeDifficultyLevelForUser(user);

  const dailyPool = QuestTemplates.filter(t=>['habit','health','mental','productivity'].includes(t.category));
  const mainPool = QuestTemplates.filter(t=>['study','physical','creative'].includes(t.category));
  const sidePool = QuestTemplates.filter(t=>['social'].includes(t.category));

  function pickN(pool,n){
    const copy = [...pool]; const out=[];
    while(out.length<n && copy.length){
      const i=Math.floor(Math.random()*copy.length);
      out.push(copy.splice(i,1)[0]);
    }
    return out;
  }

  const chosenDaily = pickN(dailyPool,3);
  const chosenMain = pickN(mainPool,1);
  const chosenSide = pickN(sidePool,1);

  const created=[];
  for(const t of chosenDaily){
    const templateDifficulty = computeDifficultyLevelFromTemplate(t);
    const finalDifficulty = Math.max(1, Math.round((templateDifficulty + userDifficulty)/2));
    created.push(await createUserQuestFromTemplate(t, user, finalDifficulty));
  }
  for(const t of chosenMain){
    const templateDifficulty = computeDifficultyLevelFromTemplate(t);
    const finalDifficulty = Math.max(1, Math.round((templateDifficulty + userDifficulty + 1)/2));
    created.push(await createUserQuestFromTemplate(t, user, finalDifficulty));
  }
  for(const t of chosenSide){
    const templateDifficulty = computeDifficultyLevelFromTemplate(t);
    const finalDifficulty = Math.max(1, Math.round((templateDifficulty + userDifficulty - 1)/2));
    created.push(await createUserQuestFromTemplate(t, user, finalDifficulty));
  }
  return created;
}

export async function generateOneMain(userId){
  const user = await User.findById(userId);
  const pool = QuestTemplates.filter(t=>['study','physical','creative'].includes(t.category));
  const template = pickRandom(pool);
  const userDifficulty = await computeDifficultyLevelForUser(user);
  const templateDifficulty = computeDifficultyLevelFromTemplate(template);
  const finalDifficulty = Math.max(1, Math.round((templateDifficulty + userDifficulty + 1)/2));
  return createUserQuestFromTemplate(template, user, finalDifficulty);
}

export async function generateOneSide(userId){
  const user = await User.findById(userId);
  const pool = QuestTemplates.filter(t=>['social'].includes(t.category));
  const template = pickRandom(pool);
  const userDifficulty = await computeDifficultyLevelForUser(user);
  const templateDifficulty = computeDifficultyLevelFromTemplate(template);
  const finalDifficulty = Math.max(1, Math.round((templateDifficulty + userDifficulty -1)/2));
  return createUserQuestFromTemplate(template, user, finalDifficulty);
}

export default {
  generateDailySet,
  generateOneMain,
  generateOneSide,
  createUserQuestFromTemplate,
  QuestTemplates
};