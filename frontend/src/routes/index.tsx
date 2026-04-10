import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: ({ context }) => {
    const { isAuthenticated } = context.authentication;
    console.log(isAuthenticated);
    if (!isAuthenticated) {
      throw redirect({ to: "/login" });
    } else {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
