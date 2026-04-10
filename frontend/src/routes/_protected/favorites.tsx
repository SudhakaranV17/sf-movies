import { createFileRoute } from "@tanstack/react-router";
import { MovieSearchSchema } from "@/modules/movies/types/movies.type";

export const Route = createFileRoute("/_protected/favorites")({
  validateSearch: (search) => MovieSearchSchema.parse(search),
  component: FavoritesPage,
});

function FavoritesPage() {
  return <div>Hello "/_protected/favorites"!</div>;
}
