import { useState, useMemo } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { useSearch, useNavigate, useRouterState } from "@tanstack/react-router";

import { useMoviesStore } from "@/modules/movies/store/movies.store";
import { useFavoritesStore } from "@/modules/favorites/store/favorites.store";
import { debounce } from "@/shared/utils/common.utils";
import type { MovieSortOption } from "@/modules/movies/types/movies.type";
import MoviesSidebarList from "@/modules/movies/components/MoviesSidebarList";
import FavoritesSidebarList from "@/modules/favorites/components/FavoritesSidebarList";

/* ─── Filter options ─────────────────────────── */
const YEAR_OPTIONS = [
  { label: "All years", value: "" },
  { label: "2020s", value: "2020s" },
  { label: "2010s", value: "2010s" },
  { label: "2000s", value: "2000s" },
  { label: "1990s", value: "1990s" },
  { label: "1980s", value: "1980s" },
  { label: "1970s & earlier", value: "older" },
];

const SORT_OPTIONS = [
  { label: "Title A→Z", value: "title_asc" },
  { label: "Title Z→A", value: "title_desc" },
  { label: "Year (newest)", value: "year_desc" },
  { label: "Year (oldest)", value: "year_asc" },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const searchParams = useSearch({ strict: false });
  const navigate = useNavigate();
  const { location } = useRouterState();
  const currentPath = location.pathname;

  const isFavorites = currentPath.includes("favorites");

  // Store reads
  const setSearchStore = useMoviesStore((state) => state.setSearch);
  const setYearStore = useMoviesStore((state) => state.setYear);
  const setSortStore = useMoviesStore((state) => state.setSort);
  const resetFiltersStore = useMoviesStore((state) => state.resetFilters);
  const setIsFilteringStore = useMoviesStore((state) => state.setIsFiltering);
  const movieCount = useMoviesStore((state) => state.movies.length);
  const favoriteCount = useFavoritesStore((state) => state.favorites.length);

  const [localSearch, setLocalSearch] = useState(searchParams.q || "");
  const [visibleRange, setVisibleRange] = useState<[number, number]>([1, 50]);

  // Check if any filters are applied
  const hasActiveFilters = Boolean(
    searchParams.q || searchParams.year || (searchParams.sort && searchParams.sort !== "title_asc")
  );

  const debouncedNavigate = useMemo(
    () =>
      debounce((val: string) => {
        navigate({
          to: currentPath,
          search: (prev) => ({ ...prev, q: val || undefined }),
          replace: true,
        });
      }, 500),
    [navigate, currentPath],
  );

  const handleSearchChange = (val: string) => {
    setLocalSearch(val);
    setSearchStore(val);
    setIsFilteringStore(true);
    debouncedNavigate(val);
  };

  const handleYearChange = (val: string) => {
    // "" means "All years" — omit the param entirely so Zod sees undefined
    const year = val || undefined;
    setYearStore(year ?? null);
    setIsFilteringStore(true);
    navigate({
      to: currentPath,
      search: (prev) => ({ ...prev, year }),
      replace: true,
    });
  };

  const handleSortChange = (val: MovieSortOption) => {
    setSortStore(val);
    setIsFilteringStore(true);
    navigate({
      to: currentPath,
      search: (prev) => ({ ...prev, sort: val || undefined }),
      replace: true,
    });
  };

  const handleReset = () => {
    // Cancel any pending debounced search navigation first so it doesn't
    // fire after the reset and re-apply the old query string.
    debouncedNavigate.cancel();
    setLocalSearch("");
    resetFiltersStore();
    setIsFilteringStore(true);
    navigate({ to: currentPath, search: () => ({}), replace: true });
  };

  return (
    <>
      {/* Mobile backdrop — sits above map overlays (z-999) but below sidebar */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-1000 bg-black/50 md:hidden transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Sidebar panel — z-[1001] so it always sits on top of everything */}
      <aside
        className={`fixed md:relative inset-y-0 left-0 z-1001
          w-[75%] max-w-[260px] md:w-[26%] lg:w-[20%] xl:w-[18%]
          md:shrink-0 bg-bg-surface border-r border-border-strong
          flex flex-col transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Mobile-only header row with close button */}
        <div className="flex items-center justify-between px-2.5 py-2 border-b border-border-strong md:hidden shrink-0">
          <span className="text-[11px] font-medium text-text-primary">Filters</span>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-7 h-7 rounded-[5px] bg-bg-overlay border border-border-strong text-text-dim hover:text-text-secondary cursor-pointer transition-colors"
          >
            <i className="pi pi-times text-[11px]" />
          </button>
        </div>

        {/* Filter controls */}
        <div className="flex flex-col gap-1.5 p-2 border-border-strong border-b">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] text-text-secondary font-medium uppercase tracking-[.05em]">
              Search
            </span>
            <div className="flex items-center gap-1.5 bg-bg-page px-2 py-1 border border-border-strong rounded-[5px]">
              <i className="text-text-dim text-xs pi pi-search shrink-0" />
              <InputText
                className="flex-1 min-w-0"
                value={localSearch}
                onInput={(e) =>
                  handleSearchChange((e.target as HTMLInputElement).value)
                }
                placeholder="Movie or actor..."
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[11px] text-text-secondary font-medium uppercase tracking-[.05em]">
              Year
            </span>
            <Dropdown
              className="px-1 w-full"
              panelClassName="z-[9999]"
              value={searchParams.year || ""}
              onChange={(e) => handleYearChange(e.value)}
              options={YEAR_OPTIONS}
              optionLabel="label"
              placeholder="All years"
            />
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[11px] text-text-secondary font-medium uppercase tracking-[.05em]">
              Sort by
            </span>
            <Dropdown
              className="px-1 w-full"
              panelClassName="z-[9999]"
              value={searchParams.sort || "title_asc"}
              onChange={(e) => handleSortChange(e.value)}
              options={SORT_OPTIONS}
              optionLabel="label"
              placeholder="Title A→Z"
            />
          </div>
        </div>

        {/* List header with count */}
        <div className="flex justify-between items-center px-2.5 py-1.5 border-border-default border-b shrink-0">
          <span className="text-text-secondary text-xs font-medium">
            {isFavorites ? (
              <>{favoriteCount} saved</>
            ) : (
              <>
                {movieCount > 0
                  ? `${visibleRange[0]}-${visibleRange[1]} of ${movieCount} films`
                  : "0 films"}
              </>
            )}
          </span>
          <button
            onClick={handleReset}
            disabled={!hasActiveFilters}
            className={`flex items-center gap-1 bg-transparent p-0 border-none text-xs transition-opacity ${
              hasActiveFilters
                ? "text-accent hover:opacity-75 cursor-pointer"
                : "text-text-dim cursor-not-allowed opacity-50"
            }`}
          >
            <i className="text-[10px] pi pi-refresh" />
            reset
          </button>
        </div>

        {/* Route-aware list panel */}
        {isFavorites ? (
          <FavoritesSidebarList />
        ) : (
          <MoviesSidebarList onVisibleCountChange={(first, last) => setVisibleRange([first, last])} />
        )}
      </aside>
    </>
  );
}