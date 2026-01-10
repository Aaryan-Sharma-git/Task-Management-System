export interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "user";
}

export type TaskStatus = "pending" | "completed";
export type TaskPriority = "high" | "medium" | "low";

export interface Task {
  _id: string;

  title: string;
  description: string;

  dueDate: string; 

  priority: TaskPriority;
  status: TaskStatus;

  assignedTo: User | undefined,

  createdBy: User,

  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}


export interface CreateTaskPayload {
  title: string;
  description: string;
  dueDate: string; // datetime-local string
  priority: TaskPriority;
  assignedTo?: string;
}

