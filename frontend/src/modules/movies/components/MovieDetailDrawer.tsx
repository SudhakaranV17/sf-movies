import { useMoviesStore } from "@/modules/movies/store/movies.store";
import { useFavoritesStore } from "@/modules/favorites/store/favorites.store";
import { useAddFavorite, useRemoveFavorite } from "@/modules/favorites/service/favorites.service";
import { useAuthStore } from "@/shared/store/useAuthStore";

interface Props {
  onLayoutToggle: () => void;
}

export default function MovieDetailDrawer({ onLayoutToggle }: Props) {
  const selectedMovie = useMoviesStore((state) => state.selectedMovie);
  const setSelectedMovie = useMoviesStore((state) => state.setSelectedMovie);
  const favorites = useFavoritesStore((state) => state.favorites);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const { mutate: addFavorite, isPending: isAdding } = useAddFavorite();
  const { mutate: removeFavorite, isPending: isRemoving } = useRemoveFavorite();

  if (!selectedMovie) return null;

  const isFavorite = favorites.some((f) => f.movie_id === selectedMovie.id);
  const isBusy = isAdding || isRemoving;

  const handleFavoriteToggle = () => {
    if (isFavorite) {
      removeFavorite(selectedMovie.id);
    } else {
      addFavorite(selectedMovie.id);
    }
  };

  return (
    <div className="shrink-0 border-t border-border-strong bg-bg-raised">
      <div className="flex items-center gap-3 px-4 h-16">
        {/* Title + year */}
        <div className="shrink-0">
          <div className="font-medium text-[13px] text-text-primary leading-tight">
            {selectedMovie.title}
          </div>
          <div className="text-[11px] text-text-muted mt-0.5">
            {selectedMovie.release_year ?? "—"}
          </div>
        </div>

        {/* Separator */}
        <div className="w-px h-9 bg-border-strong shrink-0" />

        {/* Meta grid */}
        <div className="grid grid-cols-3 gap-x-4 flex-1 min-w-0">
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-[9px] text-text-dim uppercase tracking-[.05em]">
              Director
            </span>
            <span className="text-[11px] text-text-secondary font-medium truncate">
              {selectedMovie.director || "—"}
            </span>
          </div>
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-[9px] text-text-dim uppercase tracking-[.05em]">
              Actor
            </span>
            <span className="text-[11px] text-text-secondary font-medium truncate">
              {selectedMovie.actor_1 || "—"}
            </span>
          </div>
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-[9px] text-text-dim uppercase tracking-[.05em]">
              Location
            </span>
            <span className="text-[11px] text-accent font-medium truncate">
              {selectedMovie.locations || "—"}
            </span>
          </div>
        </div>

        {/* Separator */}
        <div className="w-px h-9 bg-border-strong shrink-0" />

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {isAuthenticated && (
            <button
              onClick={handleFavoriteToggle}
              disabled={isBusy}
              className={`text-[11px] font-medium px-3 py-1.5 rounded-[6px] border-none cursor-pointer transition-opacity disabled:opacity-50 ${
                isFavorite
                  ? "bg-danger-bg text-danger border border-danger-border"
                  : "bg-accent text-bg-surface"
              }`}
            >
              {isBusy
                ? "..."
                : isFavorite
                  ? "− Unfavorite"
                  : "+ Favorites"}
            </button>
          )}

          {/* Switch to right-panel layout */}
          <button
            onClick={onLayoutToggle}
            title="Switch to side panel"
            className="w-7 h-7 flex items-center justify-center rounded-[5px] bg-bg-overlay border border-border-strong text-text-dim hover:text-text-secondary hover:bg-bg-overlay/80 cursor-pointer transition-colors"
          >
            <i className="pi pi-layout text-[11px]" />
          </button>

          {/* Close */}
          <button
            onClick={() => setSelectedMovie(null)}
            title="Close"
            className="w-7 h-7 flex items-center justify-center rounded-[5px] bg-bg-overlay border border-border-strong text-text-dim hover:text-text-secondary hover:bg-bg-overlay/80 cursor-pointer transition-colors"
          >
            <i className="pi pi-times text-[11px]" />
          </button>
        </div>
      </div>
    </div>
  );
}
