import type { TaskStatus } from "../interfaces/taskInterface";
import api from "../config/axios";
import type { Task, CreateTaskPayload, User } from "../interfaces/taskInterface";

interface TaskResponse {
  tasks: Task[];
  totalPages: number;
  currentPage: number;
}

export const getTasksByPriority = async (
  priority: "high" | "medium" | "low",
  page: number,
  limit: number = import.meta.env.PAGINATION_LIMIT
): Promise<TaskResponse> => {
  const res = await api.get(`/task/${priority}`, {
    params: { page, limit },
  });

  return res.data;
};


export const updateTaskStatus = async (
  taskId: string,
  status: TaskStatus
) => {
  const res = await api.patch(`/task/${taskId}/status`, {
    status,
  });

  return res.data;
};

export const createTask = async (
  payload: CreateTaskPayload
) => {
  const response = await api.post("/task", payload);
  console.log(response.data);
  return response.data;
};


export const getAllUsers = async (): Promise<User[]> => {
  const response = await api.get("/user/users");
  return response.data;
};

export const getTaskById = async (taskId: string): Promise<Task> => {
  const response = await api.get(`/task/${taskId}`);
  return response.data.task;
};

export const updateTask = async (
  taskId: string,
  updatedTask: Partial<Task>
): Promise<Task> => {
  const response = await api.put(`/task/${taskId}`, updatedTask);
  return response.data.task;
};

export const deleteTask = async (taskId: string) => {
  const response = await api.delete(`/task/${taskId}`);
  return response.data;
};

export const assignTask = async (taskId: string, userId: string) => {
  console.log(taskId);
  const res = await api.patch(`/task/${taskId}/assign`, {
    userId,
  });
  return res.data.task;
};






