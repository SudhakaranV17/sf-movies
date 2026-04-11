import { useState } from "react";

import MapView from "@/modules/movies/components/MapView";
import MovieDetailDrawer from "@/modules/movies/components/MovieDetailDrawer";
import MovieDetailPanel from "@/modules/movies/components/MovieDetailPanel";
import { useMoviesStore } from "@/modules/movies/store/movies.store";
import { useFavoritesStore } from "@/modules/favorites/store/favorites.store";
import { useFavorites } from "@/modules/favorites/hooks/favorites.hook";

type DetailLayout = "drawer" | "panel";

export default function FavoritesModule() {
  const [detailLayout, setDetailLayout] = useState<DetailLayout>("drawer");
  const selectedMovie = useMoviesStore((state) => state.selectedMovie);
  const favorites = useFavoritesStore((state) => state.favorites);

  // Ensures favorites are fetched and synced to the store
  useFavorites();

  const showPanel = detailLayout === "panel" && selectedMovie !== null;
  const showDrawer = detailLayout === "drawer" && selectedMovie !== null;
  const favoritedMovies = favorites.map((f) => f.movie);

  return (
    <div className="relative flex-1 overflow-hidden">
      {/* Map fills the entire area */}
      <MapView movies={favoritedMovies} />

      {/* Right panel — slides in/out from the right */}
      <div
        className={`absolute top-0 right-0 bottom-0 transition-transform duration-200 ease-out z-999 ${
          showPanel ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <MovieDetailPanel onLayoutToggle={() => setDetailLayout("drawer")} />
      </div>

      {/* Bottom drawer — slides in/out from the bottom */}
      <div
        className={`absolute bottom-0 left-0 right-0 transition-transform duration-300 ease-out z-999 ${
          showDrawer ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <MovieDetailDrawer onLayoutToggle={() => setDetailLayout("panel")} />
      </div>
    </div>
  );
}
