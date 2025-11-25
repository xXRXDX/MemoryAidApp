// src/utils/questTemplates.js
module.exports = [
  // Physical
  {
    key: "pushups",
    title: "Push-ups",
    action: "Do {amount} push-ups",
    category: "physical",
    baseAmount: 10,       // reps
    unit: "reps",
    baseDifficulty: 2,
    baseXP: 15,
    rarity: "common"
  },
  {
    key: "squat_jumps",
    title: "Squat jumps",
    action: "Do {amount} squat jumps",
    category: "physical",
    baseAmount: 8,
    unit: "reps",
    baseDifficulty: 3,
    baseXP: 18,
    rarity: "uncommon"
  },

  // Mental
  {
    key: "read_pages",
    title: "Read",
    action: "Read for {amount} minutes",
    category: "mental",
    baseAmount: 10,      // minutes
    unit: "minutes",
    baseDifficulty: 1,
    baseXP: 12,
    rarity: "common"
  },
  {
    key: "meditation",
    title: "Meditation",
    action: "Meditate for {amount} minutes",
    category: "mental",
    baseAmount: 5,
    unit: "minutes",
    baseDifficulty: 1,
    baseXP: 10,
    rarity: "common"
  },

  // Habit
  {
    key: "drink_water",
    title: "Drink water",
    action: "Drink {amount} glasses of water",
    category: "habit",
    baseAmount: 2,
    unit: "glasses",
    baseDifficulty: 1,
    baseXP: 8,
    rarity: "common"
  },
  {
    key: "journal",
    title: "Journal",
    action: "Write in your journal for {amount} minutes",
    category: "habit",
    baseAmount: 5,
    unit: "minutes",
    baseDifficulty: 1,
    baseXP: 12,
    rarity: "uncommon"
  },

  // Productivity
  {
    key: "pomodoro",
    title: "Pomodoro",
    action: "Complete {amount} focus session(s) of 25 minutes",
    category: "productivity",
    baseAmount: 1,
    unit: "sessions",
    baseDifficulty: 2,
    baseXP: 20,
    rarity: "common"
  },
  {
    key: "declutter",
    title: "Declutter",
    action: "Declutter for {amount} minutes",
    category: "productivity",
    baseAmount: 10,
    unit: "minutes",
    baseDifficulty: 3,
    baseXP: 22,
    rarity: "uncommon"
  },

  // Creative
  {
    key: "sketch",
    title: "Sketch",
    action: "Create a quick sketch for {amount} minutes",
    category: "creative",
    baseAmount: 10,
    unit: "minutes",
    baseDifficulty: 2,
    baseXP: 18,
    rarity: "common"
  },
  {
    key: "photo_walk",
    title: "Photo walk",
    action: "Take photos on a walk for {amount} minutes",
    category: "creative",
    baseAmount: 15,
    unit: "minutes",
    baseDifficulty: 3,
    baseXP: 25,
    rarity: "rare"
  },

  // Study
  {
    key: "study",
    title: "Study",
    action: "Study for {amount} minutes",
    category: "study",
    baseAmount: 20,
    unit: "minutes",
    baseDifficulty: 3,
    baseXP: 30,
    rarity: "common"
  },
  {
    key: "learn_vocab",
    title: "Learn vocabulary",
    action: "Learn {amount} new words",
    category: "study",
    baseAmount: 5,
    unit: "words",
    baseDifficulty: 2,
    baseXP: 18,
    rarity: "uncommon"
  },

  // Health
  {
    key: "sleep_prep",
    title: "Sleep prep",
    action: "Do a {amount}-minute wind-down routine",
    category: "health",
    baseAmount: 10,
    unit: "minutes",
    baseDifficulty: 1,
    baseXP: 15,
    rarity: "common"
  },
  {
    key: "healthy_meal",
    title: "Healthy meal",
    action: "Prepare a healthy meal",
    category: "health",
    baseAmount: 1,
    unit: "task",
    baseDifficulty: 3,
    baseXP: 35,
    rarity: "rare"
  },

  // Social
  {
    key: "message_friend",
    title: "Message a friend",
    action: "Message a friend and check in",
    category: "social",
    baseAmount: 1,
    unit: "task",
    baseDifficulty: 1,
    baseXP: 10,
    rarity: "common"
  },
  {
    key: "group_walk",
    title: "Group walk",
    action: "Go for a walk with a friend for {amount} minutes",
    category: "social",
    baseAmount: 20,
    unit: "minutes",
    baseDifficulty: 2,
    baseXP: 22,
    rarity: "uncommon"
  }
];
