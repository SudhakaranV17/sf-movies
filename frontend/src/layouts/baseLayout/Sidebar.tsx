import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";

/* ─── Types ─────────────────────────────────── */
interface MovieItem {
  id: number;
  title: string;
  location: string;
  year: number;
  active?: boolean;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  movies?: MovieItem[];
  totalCount?: number;
  onSelect?: (id: number) => void;
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

/* ─── Mock data ──────────────────────────────── */
const MOCK_MOVIES: MovieItem[] = [
  { id: 1, title: "Milk", location: "City Hall", year: 2008, active: true },
  { id: 2, title: "The Rock", location: "Alcatraz", year: 1996 },
  { id: 3, title: "Mrs. Doubtfire", location: "Broadway", year: 1993 },
  { id: 4, title: "Vertigo", location: "Mission", year: 1958 },
  { id: 5, title: "Bullitt", location: "Russian Hill", year: 1968 },
  { id: 6, title: "Basic Instinct", location: "Palace of FA", year: 1992 },
];

/* ─── Component ──────────────────────────────── */
export default function Sidebar({
  isOpen,
  onClose,
  movies = MOCK_MOVIES,
  totalCount = 247,
  onSelect,
  onReset,
}: SidebarProps) {
  const [search, setSearch] = useState("");
  const [year, setYear] = useState<string | null>(null);
  const [sort, setSort] = useState("title_asc");

  return (
    <>
      {/* Mobile backdrop */}
      <div
        onClick={onClose}
        className={`absolute inset-0 z-40 bg-black/50 md:hidden transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Sidebar panel */}
      <aside
        className={`absolute md:relative inset-y-0 left-0 z-50
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
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
              value={year}
              onChange={(e) => setYear(e.value)}
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
              value={sort}
              onChange={(e) => setSort(e.value)}
              options={SORT_OPTIONS}
              optionLabel="label"
              placeholder="Title A→Z"
            />
          </div>
        </div>

        {/* List header */}
        <div className="flex justify-between items-center px-2.5 py-1.5 border-border-default border-b shrink-0">
          <span className="text-text-dim text-xs">{totalCount} films</span>
          <button
            onClick={onReset}
            className="flex items-center gap-1 bg-transparent hover:opacity-75 p-0 border-none text-accent text-xs transition-opacity cursor-pointer"
          >
            <i className="text-[10px] pi pi-refresh" />
            reset
          </button>
        </div>

        {/* Film list */}
        <div className="flex flex-col flex-1 overflow-y-auto">
          {movies.map((movie) => (
            <button
              key={movie.id}
              onClick={() => {
                onSelect?.(movie.id);
                onClose();
              }}
              className={`px-2.5 py-2 border-b border-border-subtle cursor-pointer flex items-center gap-2 text-left w-full bg-transparent ${
                movie.active
                  ? "bg-bg-overlay border-l-2 border-l-accent"
                  : "border-l-2 border-l-transparent hover:bg-bg-overlay/50"
              }`}
            >
              {/* Status dot */}
              <div
                className={`w-1.5 h-1.5 rounded-full shrink-0 border ${
                  movie.active
                    ? "bg-accent border-accent-light"
                    : "bg-accent-dim border-accent/25"
                }`}
              />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div
                  className={`text-[13px] font-medium truncate ${
                    movie.active ? "text-text-primary" : "text-text-secondary"
                  }`}
                >
                  {movie.title}
                </div>
                <div className="mt-0.5 text-[11px] text-text-dim">
                  {movie.location} · {movie.year}
                </div>
              </div>
            </button>
          ))}
        </div>
      </aside>
    </>
  );
}
