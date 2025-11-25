import express from "express";
import auth from "../utils/authMiddleware.js";
import questController from "../controllers/questController.js";

const router = express.Router();

router.post("/generate", auth, questController.generateToday);
router.get("/today", auth, questController.getTodayQuests);
router.post("/complete/:id", auth, questController.completeQuest);
router.post("/custom", auth, questController.addCustomQuest);
router.get("/templates", auth, questController.listTemplates);
router.post("/generate/main", auth, questController.generateMainQuest);
router.post("/generate/side", auth, questController.generateSideQuest);
router.post("/regenerate", auth, questController.regenerateToday);

export default router;
