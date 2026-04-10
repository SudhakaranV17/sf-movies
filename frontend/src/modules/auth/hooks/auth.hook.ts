import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "@/shared/store/useAuthStore";
import { authService } from "../service/auth.service";
import type { LoginCredentials, RegisterCredentials } from "../types/auth.type";
import toast from "react-hot-toast";

// Login hook
export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationKey: ["login"],
    mutationFn: (credentials: LoginCredentials) =>
      authService.login(credentials),
    onSuccess: (data) => {
      setAuth(data.user, data.access_token);
      toast.success("Login successfully!");
      navigate({ to: "/dashboard" });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.detail || "Login failed";
      toast.error(errorMessage);
    },
  });
};

// Register hook
export const useRegister = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationKey: ["register"],
    mutationFn: (credentials: RegisterCredentials) =>
      authService.register(credentials),
    onSuccess: (data) => {
      setAuth(data.user, data.access_token);
      toast.success("Registered successfully!");
      navigate({ to: "/dashboard" });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.detail || "Registration failed";
      toast.error(errorMessage);
    },
  });
};
