import { useState } from "react";

import MapView from "@/modules/movies/components/MapView";
import MovieDetailDrawer from "@/modules/movies/components/MovieDetailDrawer";
import MovieDetailPanel from "@/modules/movies/components/MovieDetailPanel";
import { useMoviesStore } from "@/modules/movies/store/movies.store";
import { useFavoritesStore } from "@/modules/favorites/store/favorites.store";
import { useFavorites } from "@/modules/favorites/hooks/favorites.hook";

type DetailLayout = "drawer" | "panel";

export default function FavoritesPage() {
  const [detailLayout, setDetailLayout] = useState<DetailLayout>("drawer");
  const selectedMovie = useMoviesStore((state) => state.selectedMovie);
  const favorites = useFavoritesStore((state) => state.favorites);

  // Ensures favorites are fetched and synced to the store
  useFavorites();

  const showPanel = detailLayout === "panel";
  const favoritedMovies = favorites.map((f) => f.movie);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 relative overflow-hidden">
          <MapView movies={favoritedMovies} />
        </div>

        {showPanel && (
          <MovieDetailPanel onLayoutToggle={() => setDetailLayout("drawer")} />
        )}
      </div>

      {!showPanel && selectedMovie && (
        <MovieDetailDrawer onLayoutToggle={() => setDetailLayout("panel")} />
      )}
    </div>
  );
}