import express from "express";
import auth from "../utils/authMiddleware.js";
import userController from "../controllers/userController.js";

const router = express.Router();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/me", auth, userController.getProfile);

export default router;
