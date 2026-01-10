import axios from "axios";
import { saveRedirectPath } from "../utils/authRedirect";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

const refreshAxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  response => response,

  async error => {
    const { response, config } = error;

    // Safety check
    if (!response || !config) {
      return Promise.reject(error);
    }

    // Prevent infinite loop
    if (config._retry) {
      return Promise.reject(error);
    }

    // Access token expired
    if (
      response.status === 401 &&
      response.data?.errorCode === "INVALID_ACCESS_TOKEN"
    ) {
      config._retry = true;

      try {
        await refreshAxiosInstance.get("/auth/refresh");
        return api(config);
      } catch (refreshError) {
        // Avoid redirect loop
        if (window.location.pathname !== "/login") {
          saveRedirectPath();
          window.location.href = `${import.meta.env.VITE_FRONTEND_URL}/login`;
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
