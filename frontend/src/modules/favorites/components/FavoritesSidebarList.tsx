import { useMemo } from "react";
import { Skeleton } from "primereact/skeleton";
import { useSearch } from "@tanstack/react-router";

import { useFavorites } from "@/modules/favorites/hooks/favorites.hook";
import { useFavoritesStore } from "@/modules/favorites/store/favorites.store";
import type { Movie, MovieSearchParams } from "@/modules/movies/types/movies.type";

interface Props {
  onSelect?: (movie: Movie) => void;
  onClose: () => void;
}

function matchesYear(releaseYear: number | undefined | null, filter: string | undefined): boolean {
  if (!filter || !releaseYear) return true;
  if (filter === "older") return releaseYear < 1970;
  const decade = parseInt(filter);
  return releaseYear >= decade && releaseYear < decade + 10;
}

export default function FavoritesSidebarList({ onSelect, onClose }: Props) {
  const searchParams = useSearch({ strict: false }) as MovieSearchParams;

  // Trigger fetch + store sync
  const { isLoading } = useFavorites();

  // Read from store — always Favorite[], never undefined
  const favorites = useFavoritesStore((state) => state.favorites);

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
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 gap-1 p-4 text-center">
          <i className="text-text-dim text-lg pi pi-heart" />
          <span className="text-text-dim text-xs">No favourites yet</span>
        </div>
      ) : (
        filtered.map((movie) => (
          <button
            key={movie.id}
            onClick={() => {
              onSelect?.(movie);
              onClose();
            }}
            className="px-2.5 py-2 border-b border-border-subtle cursor-pointer flex items-center gap-2 text-left w-full bg-transparent border-l-2 border-l-transparent hover:bg-bg-overlay/50"
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