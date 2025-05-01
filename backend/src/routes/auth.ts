import { Router } from "express";
import { register, login } from "../controllers/authController";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = Router();

// POST /api/auth/register
router.post("/register", register);

// POST /api/auth/login
router.post("/login", login);

router.get(
    "/verify",
    authenticateToken,
    (_req, res) => { res.sendStatus(200); }
  );

export default router;
