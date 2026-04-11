import { useEffect, useRef, useState } from "react";
import { Skeleton } from "primereact/skeleton";
import { Paginator } from "primereact/paginator";
import type { PaginatorPageChangeEvent } from "primereact/paginator";
import { useSearch } from "@tanstack/react-router";

import { useMovies } from "@/modules/movies/hooks/movies.hook";
import { useMoviesStore } from "@/modules/movies/store/movies.store";
import type { MovieSortOption } from "@/modules/movies/types/movies.type";

const SKELETON_COUNT = 8;
const ITEMS_PER_PAGE = 50;

interface MoviesSidebarListProps {
  onVisibleCountChange?: (first: number, last: number) => void;
}

export default function MoviesSidebarList({ onVisibleCountChange }: MoviesSidebarListProps) {
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
  const selectedItemRef = useRef<HTMLButtonElement>(null);
  const isNavigatingToMovie = useRef(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [first, setFirst] = useState(0); // First item index (0-based)

  // Calculate pagination
  const totalRecords = movies.length;
  const currentPage = Math.floor(first / ITEMS_PER_PAGE) + 1;
  const startIndex = first;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedMovies = movies.slice(startIndex, endIndex);

  // Report visible range to parent
  useEffect(() => {
    if (onVisibleCountChange) {
      const lastIndex = Math.min(first + ITEMS_PER_PAGE, totalRecords);
      onVisibleCountChange(first + 1, lastIndex);
    }
  }, [first, totalRecords, onVisibleCountChange]);

  // When movies change (filter/sort), reset to first page
  useEffect(() => {
    setFirst(0);
  }, [movies.length]);

  // Handle movie selection and auto-scroll
  useEffect(() => {
    if (!selectedMovie || movies.length === 0) return;
    if (isNavigatingToMovie.current) return; // Prevent re-triggering during navigation

    const selectedIndex = movies.findIndex((m) => m.id === selectedMovie.id);
    if (selectedIndex === -1) return;

    // Calculate the first index of the page containing the selected movie
    const targetFirst = Math.floor(selectedIndex / ITEMS_PER_PAGE) * ITEMS_PER_PAGE;

    // If selected movie is not on current page, navigate to it with transition
    if (targetFirst !== first) {
      isNavigatingToMovie.current = true;
      setIsTransitioning(true);
      setFirst(targetFirst);
      
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        isNavigatingToMovie.current = false;
      }, 300);

      return () => {
        clearTimeout(timer);
        isNavigatingToMovie.current = false;
      };
    }
  }, [selectedMovie?.id, movies.length]);

  // Separate effect for scrolling to selected item
  useEffect(() => {
    if (!selectedMovie || isTransitioning) return;

    const timer = setTimeout(() => {
      selectedItemRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [selectedMovie?.id, isTransitioning, first]);

  const onPageChange = (event: PaginatorPageChangeEvent) => {
    setFirst(event.first);
    // Scroll to top of list when changing pages
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Show skeleton on initial load OR while filtering OR during page transition
  if (isLoading || isFiltering || isTransitioning) {
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

  // Check if filters are active
  const hasActiveFilters = Boolean(searchParams.q || searchParams.year);

  // Show empty state when no movies found
  if (totalRecords === 0) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 gap-2 p-4 text-center">
        <i className="pi pi-search text-text-dim text-2xl" />
        <div className="flex flex-col gap-1">
          <span className="text-text-secondary text-sm font-medium">
            {hasActiveFilters ? "No results found" : "No movies available"}
          </span>
          <span className="text-text-dim text-xs">
            {hasActiveFilters
              ? "Try adjusting your search or filters"
              : "Movies will appear here"}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Scrollable list */}
      <div ref={scrollRef} className="flex flex-col flex-1 overflow-y-auto">
        {paginatedMovies.map((movie) => {
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
                  {movie.locations || "No location info"} · {movie.release_year}
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
    </div>
  );
}
