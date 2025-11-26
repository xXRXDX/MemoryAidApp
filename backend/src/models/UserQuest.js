import mongoose from 'mongoose';

const UserQuestSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    questId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quest', default: null },

    title: String,
    type: String,
    difficultyScore: { type: Number, default: 1 },

    xpReward: { type: Number, default: 10 },
    isCompleted: { type: Boolean, default: false },

    action: { type: String, default: '' },
    amount: { type: Number, default: 1 },
    unit: { type: String, default: '' },
    category: { type: String, default: 'general' },
    rarity: { type: String, default: 'common' },

    dateAssigned: { type: Date, default: Date.now },
    completedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

const UserQuest = mongoose.model('UserQuest', UserQuestSchema);
export default UserQuest;