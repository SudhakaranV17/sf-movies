import { useEffect, useRef, useMemo, useState } from "react";
import { Skeleton } from "primereact/skeleton";
import { Paginator } from "primereact/paginator";
import type { PaginatorPageChangeEvent } from "primereact/paginator";
import { useSearch } from "@tanstack/react-router";

import { useFavorites } from "@/modules/favorites/hooks/favorites.hook";
import { useFavoritesStore } from "@/modules/favorites/store/favorites.store";
import { useMoviesStore } from "@/modules/movies/store/movies.store";
import type { MovieSearchParams } from "@/modules/movies/types/movies.type";

const ITEMS_PER_PAGE = 30;

function matchesYear(
  releaseYear: number | undefined | null,
  filter: string | undefined,
): boolean {
  if (!filter || !releaseYear) return true;
  if (filter === "older") return releaseYear < 1970;
  const decade = parseInt(filter);
  return releaseYear >= decade && releaseYear < decade + 10;
}

interface FavoritesSidebarListProps {
  onVisibleCountChange?: (first: number, last: number) => void;
}

export default function FavoritesSidebarList({ onVisibleCountChange }: FavoritesSidebarListProps) {
  const searchParams = useSearch({ strict: false }) as MovieSearchParams;

  const { isLoading } = useFavorites();
  const favorites = useFavoritesStore((state) => state.favorites);
  const selectedMovie = useMoviesStore((state) => state.selectedMovie);
  const setSelectedMovie = useMoviesStore((state) => state.setSelectedMovie);

  const scrollRef = useRef<HTMLDivElement>(null);
  const selectedItemRef = useRef<HTMLButtonElement>(null);
  const [first, setFirst] = useState(0); // First item index (0-based)

  const filtered = useMemo(() => {
    let result = favorites.map((f) => f.movie);
    const q = searchParams.q?.toLowerCase();
    const year = searchParams.year;
    const sort = searchParams.sort ?? "title_asc";

    if (q) {
      result = result.filter(
        (m) =>
          m.title?.toLowerCase().includes(q) ||
          m.actor_1?.toLowerCase().includes(q) ||
          m.actor_2?.toLowerCase().includes(q) ||
          m.actor_3?.toLowerCase().includes(q),
      );
    }
    if (year) {
      result = result.filter((m) => matchesYear(m.release_year, year));
    }

    return [...result].sort((a, b) => {
      if (sort === "title_asc") return (a.title ?? "").localeCompare(b.title ?? "");
      if (sort === "title_desc") return (b.title ?? "").localeCompare(a.title ?? "");
      if (sort === "year_asc") return (a.release_year ?? 0) - (b.release_year ?? 0);
      if (sort === "year_desc") return (b.release_year ?? 0) - (a.release_year ?? 0);
      return 0;
    });
  }, [favorites, searchParams.q, searchParams.year, searchParams.sort]);

  // Calculate pagination
  const totalRecords = filtered.length;
  const currentPage = Math.floor(first / ITEMS_PER_PAGE) + 1;
  const startIndex = first;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedFavorites = filtered.slice(startIndex, endIndex);

  // Report visible range to parent
  useEffect(() => {
    if (onVisibleCountChange) {
      const lastIndex = Math.min(first + ITEMS_PER_PAGE, totalRecords);
      onVisibleCountChange(first + 1, lastIndex);
    }
  }, [first, totalRecords, onVisibleCountChange]);

  // When filtered list changes, reset to first page
  useEffect(() => {
    setFirst(0);
  }, [filtered.length]);

  // When favorites list changes and the currently selected movie is no longer
  // in the list (i.e. it was just removed), auto-select the next item by the
  // same index it was at, or the last item if it was at the end, or clear
  // if the list is now empty.
  const prevFilteredIdsRef = useRef<number[]>([]);
  useEffect(() => {
    const currentIds = filtered.map((m) => m.id);
    const prevIds = prevFilteredIdsRef.current;
    prevFilteredIdsRef.current = currentIds;

    if (!selectedMovie) return;
    const stillPresent = currentIds.includes(selectedMovie.id);
    if (stillPresent) return;

    // Selected movie was removed — find where it was in the previous list
    const removedIndex = prevIds.indexOf(selectedMovie.id);
    if (filtered.length === 0) {
      setSelectedMovie(null);
    } else {
      // Select item at the same position, clamped to the new list length
      const nextIndex = Math.min(removedIndex, filtered.length - 1);
      setSelectedMovie(filtered[Math.max(0, nextIndex)]);
    }
  }, [filtered, selectedMovie, setSelectedMovie]);

  // Scroll active item into view when selectedMovie changes
  useEffect(() => {
    if (!selectedMovie) return;
    setTimeout(() => {
      selectedItemRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);
  }, [selectedMovie?.id]);

  const onPageChange = (event: PaginatorPageChangeEvent) => {
    setFirst(event.first);
    // Scroll to top of list when changing pages
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {isLoading ? (
        <div className="flex flex-col flex-1 gap-4 p-2.5 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <Skeleton width="70%" height="1rem" borderRadius="4px" />
              <Skeleton width="40%" height="0.75rem" borderRadius="4px" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 gap-2 p-4 text-center">
          <i className={`text-text-dim text-2xl ${searchParams.q || searchParams.year ? "pi pi-search" : "pi pi-heart"}`} />
          <div className="flex flex-col gap-1">
            <span className="text-text-secondary text-sm font-medium">
              {searchParams.q || searchParams.year ? "No results found" : "No favorites yet"}
            </span>
            <span className="text-text-dim text-xs">
              {searchParams.q || searchParams.year
                ? "Try adjusting your search or filters"
                : "Save movies to see them here"}
            </span>
          </div>
        </div>
      ) : (
        <>
          {/* Scrollable list */}
          <div ref={scrollRef} className="flex flex-col flex-1 overflow-y-auto">
            {paginatedFavorites.map((movie) => {
              const isActive = selectedMovie?.id === movie.id;
              return (
                <button
                  key={movie.id}
                  ref={isActive ? selectedItemRef : null}
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
            })}
          </div>

          {/* Paginator */}
          {totalRecords > ITEMS_PER_PAGE && (
            <div className="border-t border-border-subtle bg-bg-surface">
              <Paginator
                first={first}
                rows={ITEMS_PER_PAGE}
                totalRecords={totalRecords}
                onPageChange={onPageChange}
                template={{
                  layout: "FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink",
                }}
                currentPageReportTemplate={`Page ${currentPage} of ${Math.ceil(totalRecords / ITEMS_PER_PAGE)}`}
                pt={{
                  root: { className: "bg-bg-surface border-0 p-2" },
                  firstPageButton: { 
                    className: "min-w-[2rem] h-8 text-text-secondary hover:bg-bg-overlay border border-border-subtle rounded-[5px] mx-0.5"
                  },
                  prevPageButton: { 
                    className: "min-w-[2rem] h-8 text-text-secondary hover:bg-bg-overlay border border-border-subtle rounded-[5px] mx-0.5"
                  },
                  nextPageButton: { 
                    className: "min-w-[2rem] h-8 text-text-secondary hover:bg-bg-overlay border border-border-subtle rounded-[5px] mx-0.5"
                  },
                  lastPageButton: { 
                    className: "min-w-[2rem] h-8 text-text-secondary hover:bg-bg-overlay border border-border-subtle rounded-[5px] mx-0.5"
                  },
                  current: { 
                    className: "text-text-secondary text-xs px-2 min-w-0"
                  },
                }}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}