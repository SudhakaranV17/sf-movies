import { useState, useEffect } from "react";
import { useSearch, useNavigate, useRouterState } from "@tanstack/react-router";

import MapView from "@/modules/movies/components/MapView";
import MovieDetailDrawer from "@/modules/movies/components/MovieDetailDrawer";
import MovieDetailPanel from "@/modules/movies/components/MovieDetailPanel";
import { useMoviesStore } from "@/modules/movies/store/movies.store";
import type { MovieSearchParams } from "@/modules/movies/types/movies.type";

type DetailLayout = "drawer" | "panel";

export default function MoviesModule() {
  const [detailLayout, setDetailLayout] = useState<DetailLayout>("drawer");
  const selectedMovie = useMoviesStore((state) => state.selectedMovie);
  const setSelectedMovie = useMoviesStore((state) => state.setSelectedMovie);
  const movies = useMoviesStore((state) => state.movies);

  const searchParams = useSearch({ strict: false }) as MovieSearchParams;
  const navigate = useNavigate();
  const { location } = useRouterState();

  // Auto-select movie from URL param once movies are loaded.
  // Runs whenever movieId param or movies list changes (covers shared links
  // and the case where movies load after the route is mounted).
  useEffect(() => {
    if (!searchParams.movieId || movies.length === 0) return;
    // Don't override a selection the user already made in this session
    if (selectedMovie?.id === searchParams.movieId) return;
    const match = movies.find((m) => m.id === searchParams.movieId);
    if (match) setSelectedMovie(match);
  }, [searchParams.movieId, movies.length]);

  // Sync selectedMovie back to URL — but skip the very first render so we
  // don't wipe an incoming movieId param before movies have loaded.
  useEffect(() => {
    // Don't wipe the movieId from the URL if we're still waiting for movies to load.
    if (!selectedMovie && movies.length === 0 && searchParams.movieId) return;

    navigate({
      to: location.pathname,
      search: (prev) => ({
        ...prev,
        movieId: selectedMovie?.id ?? undefined,
      }),
      replace: true,
    });
  }, [selectedMovie?.id]);

  const showPanel = detailLayout === "panel" && selectedMovie !== null;
  const showDrawer = detailLayout === "drawer" && selectedMovie !== null;

  return (
    <div className="relative flex-1 overflow-hidden">
      <MapView movies={movies} />

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
