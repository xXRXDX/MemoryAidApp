// src/routes/questRoutes.js
import express from "express";
import * as questController from "../controllers/questController.js";
import auth from "../utils/authMiddleware.js";

const router = express.Router();

// helper: ensure controller function exists and is a function — throws a clear error at startup
function getHandler(name) {
  const h = questController[name];
  if (typeof h !== "function") {
    // fail fast with a descriptive error so you can fix the controller export
    throw new Error(
      `questRoutes: controller function "${name}" is missing or not a function. ` +
      `Available exports: ${Object.keys(questController).join(", ")}`
    );
  }
  return h;
}

// routes (each uses named exports from controllers)
router.post("/generate", auth, getHandler("generateToday"));
router.post("/generate/force", auth, getHandler("forceGenerate"));
router.get("/today", auth, getHandler("getTodayQuests"));
router.post("/complete/:id", auth, getHandler("completeQuest"));

router.post("/custom", auth, getHandler("addCustomQuest"));
router.get("/templates", auth, getHandler("listTemplates"));

router.post("/generate/main", auth, getHandler("generateMainQuest"));
router.post("/generate/side", auth, getHandler("generateSideQuest"));
router.post("/regenerate", auth, getHandler("regenerateToday"));

export default router;
