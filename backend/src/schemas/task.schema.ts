import { z } from "zod";
import { TaskPrioritySchema, TaskStatusSchema } from "../utils/enum.util.js";

export const taskIdParamSchema = z.object({
  params: z.object({
    id: z.string().length(24, "Invalid task id"),
  }),
});

export const paginationQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(50).default(5),
  }),
});

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    dueDate: z.coerce.date(),
    priority: TaskPrioritySchema,
    assignedTo: z.string().length(24).optional(),
  }),
});

export const updateTaskSchema = z.object({
  params: z.object({
    id: z.string().length(24),
  }),
  body: z.object({
    title: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    dueDate: z.coerce.date().optional(),
    priority: TaskPrioritySchema
  }),
});

export const assignTaskSchema = z.object({
  params: z.object({
    id: z.string().length(24),
  }),
  body: z.object({
    userId: z.string().length(24),
  }),
});

export const updateTaskStatusSchema = z.object({
  params: z.object({
    id: z.string().length(24),
  }),
  body: z.object({
    status: TaskStatusSchema,
  }),
});

export const getSingleTaskSchema = z.object({
  params: z.object({
    id: z.string().length(24),
  }),
});


