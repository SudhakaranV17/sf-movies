import { createFileRoute } from "@tanstack/react-router";
import FavoritesPage from "@/pages/favorites/index.page";
import { MovieSearchSchema } from "@/modules/movies/types/movies.type";

export const Route = createFileRoute("/_protected/favorites")({
  validateSearch: (search) => MovieSearchSchema.parse(search),
  component: FavoritesPage,
});