import express from "express";
import { createAchievement, deleteAchievement, getAchievement, getAchievements, togglePublishStatus, updateAchievement } from "../../controllers/Manage Application/achievementController.js";
import { protect } from '../../middleware/authMiddleware.js'
const router = express.Router();

router.post("/", protect, createAchievement);
router.get("/", getAchievements);
router.get("/:id", getAchievement);
router.put("/:id", protect, updateAchievement);
router.delete("/:id", protect, deleteAchievement);
router.put("/status/:id", protect, togglePublishStatus);

export default router;