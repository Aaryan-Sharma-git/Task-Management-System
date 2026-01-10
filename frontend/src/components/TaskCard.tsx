import type { Task } from "../interfaces/taskInterface";

interface TaskCardProps {
  task: Task;
  onToggleStatus: (id: string) => void;
  onView: (id: string) => void;
  priorityColor: string;
}

const TaskCard = ({
  task,
  onToggleStatus,
  onView,
  priorityColor,
}: TaskCardProps) => {
  return (
    <div
      className={`rounded-xl shadow-md p-5 bg-white border-l-4 ${priorityColor}`}
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">
          {task.title}
        </h3>

        <span
          className={`text-xs px-2 py-1 rounded-full font-medium ${
            task.status === "completed"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {task.status}
        </span>
      </div>

      {/* Due Date */}
      <p className="text-sm text-gray-500 mt-2">
        Due: {new Date(task.dueDate).toLocaleString()}
      </p>

      {/* Owner */}
      <p className="text-sm text-gray-600 mt-1">
        Owner: <span className="font-medium">{task.createdBy.name}</span>
      </p>

      {/* Actions */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => onToggleStatus(task._id)}
          className="text-sm px-3 py-1 rounded-lg bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition"
        >
          Toggle Status
        </button>

        <button
          onClick={() => onView(task._id)}
          className="text-sm px-3 py-1 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
