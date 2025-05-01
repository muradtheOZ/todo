// backend/src/app.ts
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth";
import todoRoutes from "./routes/todo";
import tagRoutes from "./routes/tag";

const app = express();


app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);
app.use("/api/tags", tagRoutes);

export default app;

