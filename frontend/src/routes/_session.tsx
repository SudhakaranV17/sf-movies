import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_session")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
