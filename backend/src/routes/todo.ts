import { Router } from "express";
import {
  createTodo,
  getTodos,
  updateTodo,
  deleteTodo,
} from "../controllers/todoController";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = Router();

// 모든 /api/todos/* রিকোয়েস্টের আগে টোকেন চেক করবে
router.use(authenticateToken);

// POST   /api/todos        → নতুন Todo তৈরি
router.post("/", createTodo);
// GET    /api/todos        → পেজিনেশন+ফিল্টারসহ Todos ফেরত দেবে
router.get("/", getTodos);
// PUT    /api/todos/:id    → নির্দিষ্ট Todo আপডেট
router.put("/:id", updateTodo);
// DELETE /api/todos/:id    → নির্দিষ্ট Todo মুছে ফেলা
router.delete("/:id", deleteTodo);

export default router;
