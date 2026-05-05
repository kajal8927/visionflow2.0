import express from "express";
import {
  createIdea,
  getIdeaById,
  getMyIdeas,
  updateIdeaStatus,
  generateIdeaReport,
} from "../controllers/ideaController.js";
import { protect } from "../middleware/authMiddleware.js";
import { compareMyIdeasWithAI } from "../controllers/ideaController.js";


const router = express.Router();

router.post("/", protect, createIdea);
router.get("/my", protect, getMyIdeas);
router.get("/:id", protect, getIdeaById);
router.get("/:id/report", protect, generateIdeaReport);
router.patch("/:id/status", protect, updateIdeaStatus);
router.post("/ai-compare", protect, compareMyIdeasWithAI);

export default router;