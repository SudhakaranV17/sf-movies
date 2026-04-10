import { useState, useMemo } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { useSearch, useNavigate, useRouterState } from "@tanstack/react-router";

import { useMoviesStore } from "@/modules/movies/store/movies.store";
import { debounce } from "@/shared/utils/common.utils";
import type { Movie, MovieSortOption } from "@/modules/movies/types/movies.type";
import MoviesSidebarList from "@/modules/movies/components/MoviesSidebarList";
import FavoritesSidebarList from "@/modules/favorites/components/FavoritesSidebarList";

/* ─── Types ─────────────────────────────────── */
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (movie: Movie) => void;
  onReset?: () => void;
}

/* ─── Filter options ─────────────────────────── */
const YEAR_OPTIONS = [
  { label: "All years", value: null },
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

/* ─── Component ──────────────────────────────── */
export default function Sidebar({
  isOpen,
  onClose,
  onSelect,
  onReset,
}: SidebarProps) {
  const searchParams = useSearch({ strict: false });
  const navigate = useNavigate();
  const { location } = useRouterState();
  const currentPath = location.pathname;

  const isFavorites = currentPath.includes("favorites");

  // Store actions
  const setSearchStore = useMoviesStore((state) => state.setSearch);
  const setYearStore = useMoviesStore((state) => state.setYear);
  const setSortStore = useMoviesStore((state) => state.setSort);
  const resetFiltersStore = useMoviesStore((state) => state.resetFilters);

  const [localSearch, setLocalSearch] = useState(searchParams.q || "");

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
    debouncedNavigate(val);
  };

  const handleYearChange = (val: string | null) => {
    setYearStore(val);
    navigate({
      to: currentPath,
      search: (prev) => ({ ...prev, year: val || undefined }),
      replace: true,
    });
  };

  const handleSortChange = (val: MovieSortOption) => {
    setSortStore(val);
    navigate({
      to: currentPath,
      search: (prev) => ({ ...prev, sort: val || undefined }),
      replace: true,
    });
  };

  const handleReset = () => {
    setLocalSearch("");
    resetFiltersStore();
    navigate({
      to: currentPath,
      search: () => ({}),
      replace: true,
    });
    onReset?.();
  };

  return (
    <>
      {/* Mobile backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/50 md:hidden transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Sidebar panel */}
      <aside
        className={`fixed md:relative inset-y-0 left-0 z-50
          w-[75%] max-w-[260px] md:w-[26%] lg:w-[20%] xl:w-[18%]
          md:shrink-0 bg-bg-surface border-r border-border-strong
          flex flex-col transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Filter controls */}
        <div className="flex flex-col gap-1.5 p-2 border-border-strong border-b">
          {/* Search */}
          <div className="flex flex-col gap-1">
            <span className="text-[11px] text-text-dim uppercase tracking-[.05em]">
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

          {/* Year */}
          <div className="flex flex-col gap-1">
            <span className="text-[11px] text-text-dim uppercase tracking-[.05em]">
              Year
            </span>
            <Dropdown
              className="px-1 w-full"
              panelClassName="z-[9999]"
              value={searchParams.year || null}
              onChange={(e) => handleYearChange(e.value)}
              options={YEAR_OPTIONS}
              optionLabel="label"
              placeholder="All years"
            />
          </div>

          {/* Sort by */}
          <div className="flex flex-col gap-1">
            <span className="text-[11px] text-text-dim uppercase tracking-[.05em]">
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

        {/* List header */}
        <div className="flex justify-between items-center px-2.5 py-1.5 border-border-default border-b shrink-0">
          <span className="text-text-dim text-xs">
            {isFavorites ? "Favourites" : "All films"}
          </span>
          <button
            onClick={handleReset}
            className="flex items-center gap-1 bg-transparent hover:opacity-75 p-0 border-none text-accent text-xs transition-opacity cursor-pointer"
          >
            <i className="text-[10px] pi pi-refresh" />
            reset
          </button>
        </div>

        {/* Route-aware list panel — each module owns its own list */}
        {isFavorites ? (
          <FavoritesSidebarList onSelect={onSelect} onClose={onClose} />
        ) : (
          <MoviesSidebarList onSelect={onSelect} onClose={onClose} />
        )}
      </aside>
    </>
  );
}
