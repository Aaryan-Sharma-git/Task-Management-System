import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import {
  getTaskById,
  updateTask,
  deleteTask,
  getAllUsers,
  assignTask,
} from "../api/taskApi";

import type { Task, TaskPriority, User } from "../interfaces/taskInterface";
import useAuth from "../hooks/useAuth";

const TaskDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [task, setTask] = useState<Task | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ Assigned user tracked separately
  const [assignedUserId, setAssignedUserId] = useState<string>("");

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1️⃣ Fetch task
        const taskData = await getTaskById(id!);
        setTask(taskData);

        const currentAssignedId =
          typeof taskData.assignedTo === "string"
            ? taskData.assignedTo
            : taskData.assignedTo?._id || "";

        setAssignedUserId(currentAssignedId);

        // 2️⃣ Fetch users (ADMIN ONLY)
        if (isAdmin) {
          const usersData = await getAllUsers();

          // ✅ Extract ownerId safely
          const ownerId =
            typeof taskData.createdBy === "string"
              ? taskData.createdBy
              : taskData.createdBy?._id;

          // ✅ Remove owner
          let filteredUsers = usersData.filter(
            (u: User) => u._id !== ownerId
          );

          // ✅ ENSURE currently assigned user is present
          if (
            currentAssignedId &&
            !filteredUsers.some((u) => u._id === currentAssignedId)
          ) {
            const assignedUser = usersData.find(
              (u) => u._id === currentAssignedId
            );
            if (assignedUser) {
              filteredUsers = [assignedUser, ...filteredUsers];
            }
          }

          setUsers(filteredUsers);
        }
      } catch (err) {
        console.error("Failed to fetch task details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isAdmin]);

  if (loading) {
    return <p className="text-center">Loading...</p>;
  }

  if (!task) {
    return (
      <p className="text-center text-red-500">
        Task not found
      </p>
    );
  }

  const handleSave = async () => {
    try {
      // 1️⃣ Update task fields
      await updateTask(task._id, {
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        priority: task.priority,
      });

      // 2️⃣ Assign / Unassign user
      if (assignedUserId !== (task.assignedTo?._id || "")) {
        await assignTask(task._id, assignedUserId);
      }

      setEditMode(false);
    } catch (err) {
      console.error("Failed to update task");
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      await deleteTask(task._id);
      navigate(-1);
    } catch (err) {
      console.error("Failed to delete task");
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-black"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>

      {/* Card */}
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow">
        {/* Title + Actions */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Task Details</h2>

          {isAdmin && (
            <div className="flex gap-2">
              {!editMode && (
                <button
                  onClick={handleDelete}
                  className="bg-red-100 text-red-700 px-4 py-1 rounded hover:bg-red-200"
                >
                  Delete
                </button>
              )}

              <button
                onClick={() => setEditMode(!editMode)}
                className="bg-indigo-100 text-indigo-700 px-4 py-1 rounded"
              >
                {editMode ? "Cancel" : "Edit"}
              </button>
            </div>
          )}
        </div>

        {/* Title */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Task Title
          </label>
          <input
            disabled={!editMode}
            value={task.title}
            onChange={(e) =>
              setTask({ ...task, title: e.target.value })
            }
            className="w-full border rounded-md p-2"
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            disabled={!editMode}
            value={task.description}
            onChange={(e) =>
              setTask({
                ...task,
                description: e.target.value,
              })
            }
            className="w-full border rounded-md p-2"
            rows={4}
          />
        </div>

        {/* Due Date */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Due Date
          </label>
          <input
            type="datetime-local"
            disabled={!editMode}
            value={task.dueDate.slice(0, 16)}
            onChange={(e) =>
              setTask({
                ...task,
                dueDate: e.target.value,
              })
            }
            className="w-full border rounded-md p-2"
          />
        </div>

        {/* Priority */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Priority
          </label>
          <select
            disabled={!editMode}
            value={task.priority}
            onChange={(e) =>
              setTask({
                ...task,
                priority: e.target.value as TaskPriority,
              })
            }
            className="w-full border rounded-md p-2"
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Assigned User */}
        {isAdmin && (
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">
              Assigned To
            </label>
            <select
              disabled={!editMode}
              value={assignedUserId}
              onChange={(e) =>
                setAssignedUserId(e.target.value)
              }
              className="w-full border rounded-md p-2"
            >
              <option value="">Unassigned</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Save */}
        {editMode && isAdmin && (
          <button
            onClick={handleSave}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-medium"
          >
            Save Changes
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskDetailsPage;
