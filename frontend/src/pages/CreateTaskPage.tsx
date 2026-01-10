import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import {
  createTask,
  getAllUsers,
  assignTask,
} from "../api/taskApi";

import type { TaskPriority, User } from "../interfaces/taskInterface";
import useAuth from "../hooks/useAuth";

const CreateTaskPage = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth(); // 👈 logged-in user

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] =
    useState<TaskPriority>("medium");
  const [assignedTo, setAssignedTo] = useState("");

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch users & REMOVE owner from assign list
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();

        const filteredUsers = data.filter(
          (user: User) => user._id !== currentUser?._id
        );

        setUsers(filteredUsers);
      } catch (err) {
        console.error("Failed to fetch users");
      }
    };

    if (currentUser) {
      fetchUsers();
    }
  }, [currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1️⃣ Create task WITHOUT assignment
      const createdTask = await createTask({
        title,
        description,
        dueDate,
        priority,
      });


      // 2️⃣ Assign task ONLY if user selected
      if (assignedTo) {
        await assignTask(createdTask.task._id, assignedTo);
      }

      // 3️⃣ Go back
      navigate(-1);
    } catch (err) {
      console.error("Failed to create task");
    } finally {
      setLoading(false);
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

      {/* Form Card */}
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Create New Task
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Task Title
            </label>
            <input
              type="text"
              className="w-full border rounded-md p-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              className="w-full border rounded-md p-2"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Due Date
            </label>
            <input
              type="datetime-local"
              className="w-full border rounded-md p-2"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Priority
            </label>
            <select
              className="w-full border rounded-md p-2"
              value={priority}
              onChange={(e) =>
                setPriority(e.target.value as TaskPriority)
              }
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* ✅ Assign User (Owner excluded) */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Assign To
            </label>
            <select
              className="w-full border rounded-md p-2"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
            >
              <option value="">Assign later</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md font-medium disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Task"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskPage;
