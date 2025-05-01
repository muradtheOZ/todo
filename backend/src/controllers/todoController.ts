// backend/src/controllers/todoController.ts
import { RequestHandler } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST /api/todos
export const createTodo: RequestHandler = async (req, res, next) => {
  const { title, content, dueDate, tagIds } = req.body;
  if (!title) {
    res.status(400).json({ msg: "Title is required" });
    return;
  }

  try {
    const todo = await prisma.todo.create({
      data: {
        title,
        content,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        user: { connect: { id: (req as any).userId } },
        tags: tagIds
          ? {
            create: tagIds.map((tagId: number) => ({
              tag: { connect: { id: tagId } },
            })),
          }
          : undefined,
      },
      include: { tags: { include: { tag: true } } },
    });
    res.status(201).json(todo);
    return;
  } catch (err) {
    next(err);
    return;
  }
};

// GET /api/todos?page=&limit=&status=&tagIds=1,2
export const getTodos: RequestHandler = async (req, res, next) => {
  const userId = (req as any).userId;
  const page = parseInt(req.query.page as string) || 1;
  const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
  const skip = (page - 1) * limit;
  const status = req.query.status as string | undefined;
  const tagIds = (req.query.tagIds as string | undefined)
    ?.split(",")
    .map((id) => parseInt(id));

  try {
    const whereClause: any = { userId };
    if (status) whereClause.status = status;
    if (tagIds?.length) {
      whereClause.tags = { some: { tagId: { in: tagIds } } };
    }

    const [total, todos] = await Promise.all([
      prisma.todo.count({ where: whereClause }),
      prisma.todo.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { dueDate: "asc" },
        include: { tags: { include: { tag: true } } },
      }),
    ]);

    res.json({
      page,
      totalPages: Math.ceil(total / limit),
      total,
      todos,
    });
    return;
  } catch (err) {
    next(err);
    return;
  }
};

// PUT /api/todos/:id
export const updateTodo: RequestHandler = async (req, res, next) => {
  const id = parseInt(req.params.id);
  const { title, content, dueDate, status, tagIds } = req.body;

  try {
    const updated = await prisma.todo.update({
      where: { id },
      data: {
        title,
        content,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        status,
        completedAt: status === "complete" ? new Date() : null,
        tags: tagIds
          ? {
            deleteMany: {},
            create: tagIds.map((tagId: number) => ({
              tag: { connect: { id: tagId } },
            })),
          }
          : undefined,
      },
      include: { tags: { include: { tag: true } } },
    });
    res.json(updated);
    return;
  } catch (err: any) {
    if (err.code === "P2025") {
      res.status(404).json({ msg: "Todo not found" });
      return;
    }
    next(err);
    return;
  }
};

// DELETE /api/todos/:id
export const deleteTodo: RequestHandler = async (req, res, next) => {
  const id = parseInt(req.params.id);

  try {
    // Remove all associations between the Todo and its Tags
    await prisma.todoTag.deleteMany({
      where: { todoId: id },
    });

    // Delete the Todo itself
    await prisma.todo.delete({
      where: { id },
    });

    res.status(204).send();
    return;
  } catch (err: any) {
    if (err.code === "P2025") {
      res.status(404).json({ msg: "Todo not found" });
      return;
    }
    next(err);
    return;
  }
};

export const getTodoById: RequestHandler = async (req, res, next) => {
  const id = parseInt(req.params.id);

  try {
    const todo = await prisma.todo.findUnique({
      where: { id },
      include: { tags: { include: { tag: true } } },
    });

    if (!todo) {
      res.status(404).json({ msg: "Todo not found" });
      return;
    }

    res.json(todo);
    return;
  } catch (err) {
    next(err);
    return;
  }
};
