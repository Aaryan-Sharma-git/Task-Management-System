import api from "../config/axios";
import type { RegisterFormData } from "../schemas/authSchema";
import type { LoginFormData } from "../schemas/authSchema";

export const registerUser = (data: RegisterFormData) =>
  api.post("/auth/register", data);

export const loginUser = (data: LoginFormData) =>
  api.post("/auth/login", data);

export const googleAuth = () => {
  window.location.href = `${import.meta.env.VITE_API_URL}/google`;
}

export const logoutUser = () =>
  api.post("/auth/logout");
