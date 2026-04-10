import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected")({
  beforeLoad: ({ context }) => {
    const { isAuthenticated } = context.authentication;
    if (!isAuthenticated) {
      throw redirect({ to: "/login" });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <>protected</>;
}
