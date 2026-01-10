import { Document, Types } from "mongoose";
import { UserRole, TaskPriority, TaskStatus } from "../utils/enum.util.js";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  comparePassword: (enteredPassword: string) => Promise<boolean>
}

export interface ITask extends Document {
  title: string;
  description: string;
  dueDate: Date;
  priority: TaskPriority;
  status: TaskStatus;
  assignedTo?: Types.ObjectId;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISession extends Document {
  userId: Types.ObjectId;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
