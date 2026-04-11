import { createFileRoute } from "@tanstack/react-router";
import BaseLayout from "@/layouts/baseLayout";
import MoviesPage from "@/pages/movies/index.page";
import { MovieSearchSchema } from "@/modules/movies/types/movies.type";

export const Route = createFileRoute("/dashboard")({
  validateSearch: (search) => MovieSearchSchema.parse(search),
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <BaseLayout>
      <MoviesPage />
    </BaseLayout>
  );
}