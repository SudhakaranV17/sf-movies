import apiClient from "@/shared/service/apiClient";
import { AuthResponseSchema } from "../helpers/auth.helper";
import type {
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
} from "../types/auth.type";

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post(
      "/auth/login",
      AuthResponseSchema,
      credentials,
    );
    return response as AuthResponse;
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post(
      "/auth/register",
      AuthResponseSchema,
      credentials,
    );
    return response as AuthResponse;
  },
};
