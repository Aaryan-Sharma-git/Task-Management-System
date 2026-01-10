import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../schemas/authSchema";
import type { LoginFormData } from "../schemas/authSchema";
import { loginUser } from "../api/authApi";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { getRedirectPath } from "../utils/authRedirect";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      setServerError("");

      await loginUser(data); // backend auth
      await login();         // update auth context

      const redirectPath = getRedirectPath();
      navigate(redirectPath, { replace: true });
    } catch (err: any) {
      setServerError(
        err?.response?.data?.message || "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Welcome Back
        </h2>
        <p className="text-center text-gray-500 mt-2">
          Login to manage your tasks
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              {...register("email")}
              type="email"
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="john@example.com"
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              {...register("password")}
              type="password"
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {serverError && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm">
              {serverError}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 text-white font-semibold rounded-lg bg-linear-to-br from-indigo-600 to-purple-600 hover:opacity-90 transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-indigo-600 font-medium hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
