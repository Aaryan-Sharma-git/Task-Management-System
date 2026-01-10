import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthWrapper from "./components/AuthWrapper";
import MainLayout from "./pages/Main";
import PriorityTasksPage from "./pages/Priority";
import CreateTaskPage from "./pages/CreateTaskPage";
import TaskDetailsPage from "./pages/TaskDetailsPage";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  const router = createBrowserRouter([
  {
    element: <AuthWrapper />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <PriorityTasksPage priority="high" />,
          },
          {
            path: "tasks/medium",
            element: <PriorityTasksPage priority="medium" />,
          },
          {
            path: "tasks/low",
            element: <PriorityTasksPage priority="low" />,
          },
          {
            path: "tasks/create",
            element: <CreateTaskPage />,
          },
          {
            path: "task/:id",
            element: <TaskDetailsPage />,
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

  return <RouterProvider router={router} />;
}

export default App;
