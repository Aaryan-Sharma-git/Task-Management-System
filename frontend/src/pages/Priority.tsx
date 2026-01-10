import { useNavigate } from "react-router-dom";
import TaskCard from "../components/TaskCard";
import type { Task, TaskPriority } from "../interfaces/taskInterface";
import { useEffect, useState, useCallback } from "react";
import {
  getTasksByPriority,
  updateTaskStatus,
} from "../api/taskApi";
import useAuth from "../hooks/useAuth";

const PriorityTasksPage = ({ priority }: { priority: TaskPriority }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) return null;

  const [tasks, setTasks] = useState<Task[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // ✅ Centralized fetch function
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getTasksByPriority(priority, page);
      setTasks(data.tasks);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    } finally {
      setLoading(false);
    }
  }, [priority, page]);

  // ✅ Initial + pagination fetch
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleToggleStatus = async (taskId: string) => {
    const currentTask = tasks.find((task) => task._id === taskId);
    if (!currentTask) return;

    const nextStatus =
      currentTask.status === "pending" ? "completed" : "pending";

    // 1️⃣ Optimistic update (instant UX)
    setTasks((prev) =>
      prev.map((task) =>
        task._id === taskId
          ? { ...task, status: nextStatus }
          : task
      )
    );

    try {
      // 2️⃣ Backend update
      await updateTaskStatus(taskId, nextStatus);

      // 3️⃣ 🔥 REFRESH FROM BACKEND
      await fetchTasks();
    } catch (error) {
      console.error("Failed to update task status");

      // 4️⃣ Rollback UI
      setTasks((prev) =>
        prev.map((task) =>
          task._id === taskId
            ? { ...task, status: currentTask.status }
            : task
        )
      );
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold capitalize">
          {priority} Priority Tasks
        </h1>

        {user.role === "admin" && (
          <button
            onClick={() => navigate("/tasks/create")}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
          >
            + Create Task
          </button>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-gray-500">Loading tasks...</p>
      )}

      {/* Empty */}
      {!loading && tasks.length === 0 && (
        <p className="text-gray-500">No tasks found.</p>
      )}

      {/* Task Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            priorityColor={
              priority === "high"
                ? "border-red-500"
                : priority === "medium"
                ? "border-yellow-500"
                : "border-green-500"
            }
            onToggleStatus={handleToggleStatus}
            onView={(id) => navigate(`/task/${id}`)}
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span className="text-sm">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PriorityTasksPage;
