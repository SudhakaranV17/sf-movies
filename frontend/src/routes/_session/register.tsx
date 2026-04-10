import { createFileRoute } from "@tanstack/react-router";
import { RegisterPage } from "@/modules/auth";

export const Route = createFileRoute("/_session/register")({
  component: RegisterPage,
});
