import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_session/login")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Login</div>;
}
