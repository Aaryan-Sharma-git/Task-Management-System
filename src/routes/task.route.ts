import { Router } from "express";
import { validate } from "../middlewares/zod.middleware.js";

import {
  createTaskSchema,
  updateTaskSchema,
  assignTaskSchema,
  updateTaskStatusSchema,
  paginationQuerySchema,
  taskIdParamSchema
} from "../schemas/task.schema.js";


import {
  createTask,
  updateTask,
  deleteTask,
  assignTask,
  updateTaskStatus,
  getTaskById,
  getTasksByPriority,
} from "../controllers/task.controller.js";
import { TaskPriority } from "../utils/enum.util.js";

const router = Router();

router.get("/high", validate(paginationQuerySchema), getTasksByPriority(TaskPriority.HIGH));
router.get("/medium",validate(paginationQuerySchema), getTasksByPriority(TaskPriority.MEDIUM));
router.get("/low", validate(paginationQuerySchema), getTasksByPriority(TaskPriority.LOW)); 

router.post("/",  validate(createTaskSchema), createTask);
router.put("/:id", validate(updateTaskSchema), updateTask);
router.delete("/:id", validate(taskIdParamSchema), deleteTask);
router.patch("/:id/assign", validate(assignTaskSchema), assignTask);
router.patch("/:id/status", validate(updateTaskStatusSchema), updateTaskStatus);
router.get("/:id", validate(taskIdParamSchema), getTaskById);

export default router;
