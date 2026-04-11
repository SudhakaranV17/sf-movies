import BaseLayout from "@/layouts/baseLayout";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected")({
  beforeLoad: ({ context }) => {
    const { isAuthenticated } = context.authentication;
    if (!isAuthenticated) {
      throw redirect({
        to: "/login",
        search: (prev) => prev,
      });
    }
  },
  component: BaseLayout,
});
