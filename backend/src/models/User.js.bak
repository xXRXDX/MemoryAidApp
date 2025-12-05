import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // Gamification fields
    gamifiedName: { type: String, default: "" },
    theme: { type: String, default: "default" },

    // XP System
    totalXP: { type: Number, default: 0 },
    wisdomXP: { type: Number, default: 0 },
    strengthXP: { type: Number, default: 0 },
    spiritXP: { type: Number, default: 0 },

    // Streak System
    streakCount: { type: Number, default: 0 },
    lastActiveDate: { type: Date, default: null }
  },
  { timestamps: true }
);

const User = mongoose.model('User', UserSchema);
export default User;