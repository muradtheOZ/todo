import { Router } from "express";
import {
  createTag,
  getTags,
  updateTag,
  deleteTag,
  getTagById,
} from "../controllers/tagController";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = Router();

router.use(authenticateToken);

router.post("/", createTag);

router.get("/", getTags);

router.put("/:id", updateTag);

router.delete("/:id", deleteTag);

router.get("/:id", getTagById);

export default router;
