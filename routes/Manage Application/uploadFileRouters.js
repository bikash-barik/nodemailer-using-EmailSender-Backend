import express from "express";
import { uploadCSV } from "../../controllers/Manage Application/UploadFileController.js";
import { protect } from '../../middleware/authMiddleware.js'
const router = express.Router();

router.post("/", uploadCSV);
// router.get("/", getAchievements);
// router.get("/:id", getAchievement);
// router.put("/:id", protect, updateAchievement);
// router.delete("/:id", protect, deleteAchievement);
// router.put("/status/:id", protect, togglePublishStatus);

export default router;