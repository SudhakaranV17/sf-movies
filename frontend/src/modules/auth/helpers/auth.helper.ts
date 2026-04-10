// modules/auth/helpers/auth.helper.ts
import { z } from "zod";

export const AuthResponseSchema = z.object({
  user: z.object({
    id: z.number(),
    email: z.string().email(),
  }),
  token: z.string(),
});

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const RegisterSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
