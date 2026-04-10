import apiClient from "@/shared/service/apiClient";
import { AuthResponseSchema } from "../helpers/auth.helper";
import type {
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
} from "../types/auth.type";
import { useMutation } from "@tanstack/react-query";
import { endpoints } from "@/config/constants";

export const useLoginMutation = () => {
  const postData = async (credentials: LoginCredentials) => {
    const response = await apiClient.post(
      endpoints.AUTH_LOGIN,
      AuthResponseSchema,
      credentials,
    );
    return response as AuthResponse;
  };

  return useMutation({
    mutationFn: postData,
  });
};

export const useRegisterMutation = () => {
  const postData = async (credentials: RegisterCredentials) => {
    const response = await apiClient.post(
      endpoints.AUTH_REGISTER,
      AuthResponseSchema,
      credentials,
    );
    return response as AuthResponse;
  };

  return useMutation({
    mutationFn: postData,
  });
};
