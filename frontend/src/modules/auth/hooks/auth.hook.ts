import { useNavigate } from "@tanstack/react-router";
import { useForm } from "@/lib/hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoginMutation, useRegisterMutation } from "../service/auth.service";
import { LoginSchema, RegisterSchema } from "../types/auth.schema";
import type { LoginCredentials, RegisterCredentials } from "../types/auth.type";
import { useAuthStore } from "@/shared/store/useAuthStore";
import toast from "react-hot-toast";

/**
 * Hook for managing the login form and mutation.
 */
export const useLogin = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const form = useForm<LoginCredentials>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate: login, isPending: isLoggingIn } = useLoginMutation();

  const handleLogin = (data: LoginCredentials) => {
    login(data, {
      onSuccess: (response) => {
        setAuth(response.user, response.access_token);
        toast.success("Welcome back!");
        navigate({ to: "/dashboard" });
      },
      onError: (error: any) => {
        const errorMessage =
          error.response?.data?.detail ||
          "Login failed. Please check your credentials.";
        toast.error(errorMessage);
      },
    });
  };

  return {
    ...form,
    isLoggingIn,
    handleLogin,
  };
};

/**
 * Hook for managing the registration form and mutation.
 */
export const useRegister = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const form = useForm<RegisterCredentials>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate: register, isPending: isRegistering } = useRegisterMutation();

  const handleRegister = (data: RegisterCredentials) => {
    register(data, {
      onSuccess: (response) => {
        setAuth(response.user, response.access_token);
        toast.success("Account created successfully!");
        navigate({ to: "/dashboard" });
      },
      onError: (error: any) => {
        const errorMessage =
          error.response?.data?.detail || "Registration failed.";
        toast.error(errorMessage);
      },
    });
  };

  return {
    ...form,
    isRegistering,
    handleRegister,
  };
};
