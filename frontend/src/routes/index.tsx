import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    // Dashboard is public — always land there.
    // The favorites link will redirect to /login if the user isn't authenticated.
    throw redirect({ to: "/dashboard" });
  },
});
