import { Outlet } from "react-router-dom";
import Sidebar from "../components/SideBar";
import useAuth from "../hooks/useAuth";

const MainLayout = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="flex">
      <Sidebar user={user} onLogout={logout} />

      <main className="flex-1 bg-gray-100 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
