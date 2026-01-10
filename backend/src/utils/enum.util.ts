import { z } from "zod";


export enum TaskPriority {
  HIGH = "high",
  MEDIUM = "medium",
  LOW = "low",
}

export enum TaskStatus {
  PENDING = "pending",
  COMPLETED = "completed",
}

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

export enum TokenType {
  REFRESH_TOKEN = "refresh_token",
  ACCESS_TOKEN = "access_token"
}

export const TaskPrioritySchema = z.enum(["high", "medium", "low"]);
export const TaskStatusSchema = z.enum(["pending", "completed"]);

