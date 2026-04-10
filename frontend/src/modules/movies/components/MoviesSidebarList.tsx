import { Skeleton } from "primereact/skeleton";
import { useSearch } from "@tanstack/react-router";

import { useMovies } from "@/modules/movies/hooks/movies.hook";
import { useMoviesStore } from "@/modules/movies/store/movies.store";
import type {
  Movie,
  MovieSortOption,
} from "@/modules/movies/types/movies.type";

interface Props {
  onSelect?: (movie: Movie) => void;
  onClose: () => void;
}

export default function MoviesSidebarList({ onSelect, onClose }: Props) {
  const searchParams = useSearch({ strict: false });

  // Trigger fetch + store sync
  const { isLoading } = useMovies({
    q: searchParams.q,
    year: searchParams.year,
    sort: searchParams.sort as MovieSortOption,
  });

  // Read from store — always Movie[], never undefined
  const movies = useMoviesStore((state) => state.movies);

  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      {isLoading ? (
        <div className="flex flex-col flex-1 gap-4 p-2.5 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <Skeleton
                width="70%"
                height="1rem"
                borderRadius="4px"
                className="bg-text-muted"
              />
              <Skeleton
                width="40%"
                height="0.75rem"
                borderRadius="4px"
                className="bg-text-muted"
              />
            </div>
          ))}
        </div>
      ) : (
        movies.map((movie) => (
          <button
            key={movie.id}
            onClick={() => {
              onSelect?.(movie);
              onClose();
            }}
            className="flex items-center gap-2 bg-transparent hover:bg-bg-overlay/50 px-2.5 py-2 border-border-subtle border-b border-l-2 border-l-transparent w-full text-left cursor-pointer"
          >
            <div className="border border-accent/25 rounded-full w-1.5 h-1.5 bg-accent-dim shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-[13px] text-text-secondary truncate">
                {movie.title}
              </div>
              <div className="mt-0.5 text-[11px] text-text-dim">
                {movie.locations || "No location info"} · {movie.release_year}
              </div>
            </div>
          </button>
        ))
      )}
    </div>
  );
}
