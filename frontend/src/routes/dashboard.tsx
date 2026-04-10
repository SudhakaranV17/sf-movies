import BaseLayout from "@/layouts/baseLayout";
import { createFileRoute } from "@tanstack/react-router";
import { MovieSearchSchema } from "@/modules/movies/types/movies.type";

export const Route = createFileRoute("/dashboard")({
  validateSearch: (search) => MovieSearchSchema.parse(search),
  component: DashboardPage,
});

function DashboardPage() {
  return <BaseLayout />;
}
