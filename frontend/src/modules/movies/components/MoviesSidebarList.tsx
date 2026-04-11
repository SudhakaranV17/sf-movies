import { Skeleton } from "primereact/skeleton";
import { useSearch } from "@tanstack/react-router";

import { useMovies } from "@/modules/movies/hooks/movies.hook";
import { useMoviesStore } from "@/modules/movies/store/movies.store";
import type { MovieSortOption } from "@/modules/movies/types/movies.type";

export default function MoviesSidebarList() {
  const searchParams = useSearch({ strict: false });

  const { isLoading } = useMovies({
    q: searchParams.q,
    year: searchParams.year,
    sort: searchParams.sort as MovieSortOption,
  });

  const movies = useMoviesStore((state) => state.movies);
  const selectedMovie = useMoviesStore((state) => state.selectedMovie);
  const setSelectedMovie = useMoviesStore((state) => state.setSelectedMovie);

  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      {isLoading ? (
        <div className="flex flex-col flex-1 gap-4 p-2.5 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <Skeleton width="70%" height="1rem" borderRadius="4px" />
              <Skeleton width="40%" height="0.75rem" borderRadius="4px" />
            </div>
          ))}
        </div>
      ) : (
        movies.map((movie) => {
          const isActive = selectedMovie?.id === movie.id;
          return (
            <button
              key={movie.id}
              onClick={() => setSelectedMovie(isActive ? null : movie)}
              className={`px-2.5 py-2 border-b border-border-subtle cursor-pointer flex items-center gap-2 text-left w-full bg-transparent border-l-2 transition-colors ${
                isActive
                  ? "bg-bg-overlay border-l-accent"
                  : "border-l-transparent hover:bg-bg-overlay/50"
              }`}
            >
              <div
                className={`rounded-full w-1.5 h-1.5 shrink-0 border transition-colors ${
                  isActive
                    ? "bg-accent border-accent-light"
                    : "bg-accent-dim border-accent/25"
                }`}
              />
              <div className="flex-1 min-w-0">
                <div
                  className={`font-medium text-[13px] truncate ${
                    isActive ? "text-text-primary" : "text-text-secondary"
                  }`}
                >
                  {movie.title}
                </div>
                <div className="mt-0.5 text-[11px] text-text-dim">
                  {movie.locations || "No location info"} ·{" "}
                  {movie.release_year}
                </div>
              </div>
            </button>
          );
        })
      )}
    </div>
  );
}