import Mood from "../models/mood.js";

export const logMood = async (req, res) => {
  try {
    const mood = await Mood.create(req.body);
    res.json({ success: true, mood });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMoods = async (req, res) => {
  try {
    const moods = await Mood.find({ userId: req.params.userId }).sort({ timestamp: -1 });
    res.json({ success: true, moods });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
