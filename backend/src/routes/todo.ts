import { Router } from "express";
import {
  createTodo,
  getTodos,
  updateTodo,
  deleteTodo,
} from "../controllers/todoController";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = Router();

router.use(authenticateToken);

router.post("/", createTodo);

router.get("/", getTodos);

router.put("/:id", updateTodo);

router.delete("/:id", deleteTodo);

export default router;
