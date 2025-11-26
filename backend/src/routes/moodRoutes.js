import express from "express";
import { logMood, getMoods } from "../controllers/moodController.js";

const router = express.Router();

router.post("/log", logMood);             // Log a mood
router.get("/:userId", getMoods);         // Get mood history

export default router;
