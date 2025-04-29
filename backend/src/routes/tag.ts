import { Router } from "express";
import {
  createTag,
  getTags,
  updateTag,
  deleteTag,
} from "../controllers/tagController";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = Router();

// /api/tags সবগুলো রিকোয়েস্টে আগে auth
router.use(authenticateToken);

// POST   /api/tags        → নতুন Tag তৈরি
router.post("/", createTag);
// GET    /api/tags        → ইউজারের সব Tag ফেরত দেবে
router.get("/", getTags);
// PUT    /api/tags/:id    → নির্দিষ্ট Tag আপডেট
router.put("/:id", updateTag);
// DELETE /api/tags/:id    → নির্দিষ্ট Tag ডিলিট
router.delete("/:id", deleteTag);

export default router;
