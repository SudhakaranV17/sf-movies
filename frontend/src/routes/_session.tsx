import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_session")({
  // Redirect authenticated users away from auth pages
  beforeLoad: ({ context }) => {
    if (context.authentication.isAuthenticated) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: () => <Outlet />,
});
