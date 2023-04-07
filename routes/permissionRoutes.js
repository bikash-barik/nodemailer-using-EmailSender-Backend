import express from "express";
import { addPermissions, fetchPermissions } from "../controllers/permissionController.js";
import { protect } from '../middleware/authMiddleware.js'
const router = express.Router();

router.route("/:subUserId").post(protect, addPermissions);
router.route("/:subUserId").get(fetchPermissions);

export default router;
