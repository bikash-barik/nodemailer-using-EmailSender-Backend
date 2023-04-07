import express from "express";
import { authSubUser, DeleteSubUser, getSubUserById, getSubUsers, registerSubUser, toggleStatus, updateSubUserProfile } from "../controllers/subUserController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();


router.route("/").get(getSubUsers);
router.route("/").post(protect, registerSubUser);
router.post("/login", authSubUser);
router.route("/profile/:id").put(protect, updateSubUserProfile);
router.route("/status/:id").put(protect, toggleStatus);
router.route("/:id").delete(protect, DeleteSubUser);
router.route("/:id").get(getSubUserById)

export default router;
