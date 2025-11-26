import express from "express";
import {
  startFocus,
  endFocus,
  getFocusStats,
} from "../controllers/focusController.js";

const router = express.Router();

// start focus session
router.post("/start", startFocus);

// end focus session
router.post("/end", endFocus);

// get focus history
router.get("/:userId", getFocusStats);

export default router;
