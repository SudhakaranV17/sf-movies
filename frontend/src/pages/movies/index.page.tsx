import { useState } from "react";

import MapView from "@/modules/movies/components/MapView";
import MovieDetailDrawer from "@/modules/movies/components/MovieDetailDrawer";
import MovieDetailPanel from "@/modules/movies/components/MovieDetailPanel";
import { useMoviesStore } from "@/modules/movies/store/movies.store";

type DetailLayout = "drawer" | "panel";

export default function MoviesPage() {
  const [detailLayout, setDetailLayout] = useState<DetailLayout>("drawer");
  const selectedMovie = useMoviesStore((state) => state.selectedMovie);
  const movies = useMoviesStore((state) => state.movies);

  const showPanel = detailLayout === "panel";

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Map + optional right panel */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 relative overflow-hidden">
          <MapView movies={movies} />
        </div>

        {/* Right detail panel — always mounted when in panel mode so empty state is visible */}
        {showPanel && (
          <MovieDetailPanel onLayoutToggle={() => setDetailLayout("drawer")} />
        )}
      </div>

      {/* Bottom drawer — only when a movie is selected in drawer mode */}
      {!showPanel && selectedMovie && (
        <MovieDetailDrawer onLayoutToggle={() => setDetailLayout("panel")} />
      )}
    </div>
  );
}