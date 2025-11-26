import mongoose from 'mongoose';

const QuestSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: { type: String, enum: ['daily','main','side'], required: true },
    baseXP: { type: Number, default: 10 },
    category: { type: String, default: 'general' },
    description: { type: String, default: '' }
  },
  { timestamps: true }
);

const Quest = mongoose.model('Quest', QuestSchema);
export default Quest;