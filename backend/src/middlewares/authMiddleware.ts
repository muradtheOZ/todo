// backend/src/middlewares/authMiddleware.ts
import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId?: number;
}

const JWT_SECRET = process.env.JWT_SECRET!;

export const authenticateToken: RequestHandler = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).json({ msg: "Not authenticated" });
    return;
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: number };
    // attach to our custom request
    (req as AuthRequest).userId = payload.userId;
    next();
    return;
  } catch {
    res.status(403).json({ msg: "Invalid token" });
    return;
  }
};
