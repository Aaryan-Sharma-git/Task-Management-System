import { NavLink } from "react-router-dom";
import type { User } from "../interfaces/taskInterface"

interface SidebarProps {
  user: User;
  onLogout: () => void;
}

const SideBar = ({ user, onLogout }: SidebarProps) => {
  return (
    <aside className="h-screen w-64 bg-linear-to-b from-indigo-600 to-purple-700 text-white flex flex-col">
      
      {/* App Title */}
      <div className="px-6 py-6 text-2xl font-bold border-b border-white/20">
        Task Management System
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        <NavItem to="/" label="High Priority" color="red" />
        <NavItem to="/tasks/medium" label="Medium Priority" color="yellow" />
        <NavItem to="/tasks/low" label="Low Priority" color="green" />
      </nav>

      {/* Profile Section */}
      <div className="px-6 py-4 border-t border-white/20">
        <p className="font-semibold">{user.name}</p>
        <p className="text-sm text-white/80">{user.email}</p>
        <p className="text-xs uppercase tracking-wide mt-1">
          {user.role}
        </p>

        <button
          onClick={onLogout}
          className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default SideBar;

interface NavItemProps {
  to: string;
  label: string;
  color: "red" | "yellow" | "green";
}

const NavItem = ({ to, label, color }: NavItemProps) => {
  const base =
    "flex items-center px-4 py-2 rounded-lg font-medium transition";

  const colorMap = {
    red: "hover:bg-red-500/20",
    yellow: "hover:bg-yellow-400/20",
    green: "hover:bg-green-500/20",
  };

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `${base} ${
          isActive
            ? "bg-white/20"
            : colorMap[color]
        }`
      }
    >
      {label}
    </NavLink>
  );
};
