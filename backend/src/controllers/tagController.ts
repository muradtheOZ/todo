// backend/src/controllers/tagController.ts
import { RequestHandler } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST /api/tags
export const createTag: RequestHandler = async (req, res, next) => {
  const { name } = req.body;
  if (!name) {
    res.status(400).json({ msg: "Tag name is required" });
    return;
  }

  try {
    const tag = await prisma.tag.create({
      data: { name, user: { connect: { id: (req as any).userId } } },
    });
    res.status(201).json(tag);
    return;
  } catch (err) {
    next(err);
    return;
  }
};

// GET /api/tags
export const getTags: RequestHandler = async (req, res, next) => {
  try {
    const tags = await prisma.tag.findMany({
      where: { userId: (req as any).userId },
    });
    res.json(tags);
    return;
  } catch (err) {
    next(err);
    return;
  }
};

// PUT /api/tags/:id
export const updateTag: RequestHandler = async (req, res, next) => {
  const id = parseInt(req.params.id);
  const { name } = req.body;
  if (!name) {
    res.status(400).json({ msg: "Tag name is required" });
    return;
  }

  try {
    const updated = await prisma.tag.update({
      where: { id },
      data: { name },
    });
    res.json(updated);
    return;
  } catch (err: any) {
    if (err.code === "P2025") {
      res.status(404).json({ msg: "Tag not found" });
      return;
    }
    next(err);
    return;
  }
};

// DELETE /api/tags/:id
export const deleteTag: RequestHandler = async (req, res, next) => {
  const id = parseInt(req.params.id);

  try {
    // Remove the association of the tag from all Todos
    await prisma.todoTag.deleteMany({
      where: { tagId: id },
    });

    // Delete the tag itself
    const tag = await prisma.tag.delete({
      where: { id },
    });

    res.json({ msg: "Tag deleted successfully", tag });
  } catch (err) {
    next(err);
  }
};
// GET /api/tags/:id/todos
export const getTagById: RequestHandler = async (req, res, next) => {
  const id = parseInt(req.params.id);

  try {
    const tag = await prisma.tag.findUnique({
      where: { id },
    });

    if (!tag) {
      res.status(404).json({ msg: "Tag not found" });
      return;
    }

    res.json(tag);
    return;
  } catch (err) {
    next(err);
    return;
  }
};
