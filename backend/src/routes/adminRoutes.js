import express from "express";
import { getAdminStats, getAllIdeas } from "../controllers/adminController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/ideas", protect, adminOnly, getAllIdeas);
router.get("/stats", protect, adminOnly, getAdminStats);

export default router;