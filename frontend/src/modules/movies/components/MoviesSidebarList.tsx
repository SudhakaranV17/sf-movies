import { useEffect, useRef } from "react";
import { Skeleton } from "primereact/skeleton";
import { useSearch } from "@tanstack/react-router";
import { useVirtualizer } from "@tanstack/react-virtual";

import { useMovies } from "@/modules/movies/hooks/movies.hook";
import { useMoviesStore } from "@/modules/movies/store/movies.store";
import type { MovieSortOption } from "@/modules/movies/types/movies.type";

const ITEM_HEIGHT = 52;
const SKELETON_COUNT = 8;

export default function MoviesSidebarList() {
  const searchParams = useSearch({ strict: false });

  const { isLoading } = useMovies({
    q: searchParams.q,
    year: searchParams.year,
    sort: searchParams.sort as MovieSortOption,
  });

  const movies = useMoviesStore((state) => state.movies);
  const selectedMovie = useMoviesStore((state) => state.selectedMovie);
  const isFiltering = useMoviesStore((state) => state.isFiltering);
  const setSelectedMovie = useMoviesStore((state) => state.setSelectedMovie);

  const scrollRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: movies.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ITEM_HEIGHT,
    overscan: 8,
  });

  const virtualItems = virtualizer.getVirtualItems();

  // Scroll the active item into view on:
  //  - map marker click (selectedMovie changes)
  //  - navigation return (movies re-populates)
  //  - shared-link auto-select (both change together)
  useEffect(() => {
    if (!selectedMovie || movies.length === 0) return;
    const idx = movies.findIndex((m) => m.id === selectedMovie.id);
    if (idx === -1) return;
    // Use a small delay so the virtualizer has had a chance to measure rows
    // before we ask it to scroll (especially after a list re-render).
    const t = setTimeout(() => {
      virtualizer.scrollToIndex(idx, { align: "center", behavior: "smooth" });
    }, 50);
    return () => clearTimeout(t);
  }, [selectedMovie?.id, movies.length]);

  // Show skeleton on initial load OR while filtering (search/year/sort/reset)
  if (isLoading || isFiltering) {
    return (
      <div className="flex flex-col flex-1 gap-4 p-2.5 overflow-hidden">
        {[...Array(SKELETON_COUNT)].map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <Skeleton width="70%" height="1rem" borderRadius="4px" />
            <Skeleton width="40%" height="0.75rem" borderRadius="4px" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div ref={scrollRef} className="flex flex-col flex-1 overflow-y-auto">
      <div style={{ height: virtualizer.getTotalSize(), position: "relative" }}>
        {virtualItems.map((vItem) => {
          const movie = movies[vItem.index];
          const isActive = selectedMovie?.id === movie.id;
          return (
            <button
              key={movie.id}
              data-index={vItem.index}
              ref={virtualizer.measureElement}
              onClick={() => setSelectedMovie(isActive ? null : movie)}
              style={{
                position: "absolute",
                top: vItem.start,
                left: 0,
                right: 0,
              }}
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
                  {movie.locations || "No location info"} · {movie.release_year}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Count badge after all items */}
      {movies.length > 0 && (
        <div className="flex justify-center py-4">
          <div className="flex items-center gap-1.5 bg-bg-overlay px-3 py-1 border border-border-subtle rounded-full">
            <div className="rounded-full w-1.5 h-1.5 bg-accent-dim" />
            <span className="font-medium text-[10px] text-text-dim">
              {movies.length} films
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
