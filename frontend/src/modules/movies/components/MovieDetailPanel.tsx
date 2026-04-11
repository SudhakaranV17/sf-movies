import { useMoviesStore } from "@/modules/movies/store/movies.store";
import { useFavoritesStore } from "@/modules/favorites/store/favorites.store";
import { useAddFavorite, useRemoveFavorite } from "@/modules/favorites/service/favorites.service";
import { useAuthStore } from "@/shared/store/useAuthStore";

interface Props {
  onLayoutToggle: () => void;
}

function DetailRow({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number | null | undefined;
  accent?: boolean;
}) {
  return (
    <>
      <div className="flex flex-col gap-0.5">
        <span className="text-[9px] text-text-dim uppercase tracking-[.05em]">
          {label}
        </span>
        <span
          className={`text-[11px] font-medium ${accent ? "text-accent" : "text-text-secondary"}`}
        >
          {value || "—"}
        </span>
      </div>
      <div className="h-px bg-border-default" />
    </>
  );
}

export default function MovieDetailPanel({ onLayoutToggle }: Props) {
  const selectedMovie = useMoviesStore((state) => state.selectedMovie);
  const setSelectedMovie = useMoviesStore((state) => state.setSelectedMovie);
  const favorites = useFavoritesStore((state) => state.favorites);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const { mutate: addFavorite, isPending: isAdding } = useAddFavorite();
  const { mutate: removeFavorite, isPending: isRemoving } = useRemoveFavorite();

  const isFavorite =
    selectedMovie !== null &&
    favorites.some((f) => f.movie_id === selectedMovie.id);
  const isBusy = isAdding || isRemoving;

  const handleFavoriteToggle = () => {
    if (!selectedMovie) return;
    if (isFavorite) {
      removeFavorite(selectedMovie.id);
    } else {
      addFavorite(selectedMovie.id);
    }
  };

  return (
    <div className="w-[180px] shrink-0 bg-bg-surface border-l border-border-strong flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border-strong shrink-0">
        <span className="text-[11px] font-medium text-text-primary truncate">
          {selectedMovie ? selectedMovie.title : "Details"}
        </span>
        <div className="flex items-center gap-1 shrink-0 ml-2">
          {/* Switch to drawer layout */}
          <button
            onClick={onLayoutToggle}
            title="Switch to bottom drawer"
            className="w-5 h-5 flex items-center justify-center rounded-[4px] bg-bg-overlay border border-border-strong text-text-dim hover:text-text-secondary cursor-pointer transition-colors"
          >
            <i className="pi pi-window-minimize text-[9px]" />
          </button>
          {/* Close */}
          <button
            onClick={() => setSelectedMovie(null)}
            title="Close"
            className="w-5 h-5 flex items-center justify-center rounded-[4px] bg-bg-overlay border border-border-strong text-text-dim hover:text-text-secondary cursor-pointer transition-colors"
          >
            <i className="pi pi-times text-[9px]" />
          </button>
        </div>
      </div>

      {/* Body */}
      {selectedMovie ? (
        <>
          <div className="flex flex-col gap-2 p-3 flex-1 overflow-y-auto">
            <DetailRow label="Year" value={selectedMovie.release_year} accent />
            <DetailRow label="Director" value={selectedMovie.director} />
            <DetailRow label="Actor" value={selectedMovie.actor_1} />
            {selectedMovie.actor_2 && (
              <DetailRow label="Co-actor" value={selectedMovie.actor_2} />
            )}
            <DetailRow
              label="Location"
              value={selectedMovie.locations}
              accent
            />
            {selectedMovie.fun_facts && (
              <div className="flex flex-col gap-0.5 mt-1">
                <span className="text-[9px] text-text-dim uppercase tracking-[.05em]">
                  Fun fact
                </span>
                <span className="text-[10px] text-text-dim leading-relaxed">
                  {selectedMovie.fun_facts}
                </span>
              </div>
            )}
          </div>

          {/* Footer actions */}
          {isAuthenticated && (
            <div className="p-2.5 flex flex-col gap-1.5 border-t border-border-strong shrink-0">
              <button
                onClick={handleFavoriteToggle}
                disabled={isBusy}
                className={`w-full py-1.5 rounded-[6px] text-[11px] font-medium border-none cursor-pointer transition-opacity disabled:opacity-50 ${
                  isFavorite
                    ? "bg-danger-bg text-danger border border-danger-border"
                    : "bg-accent text-bg-surface"
                }`}
              >
                {isBusy
                  ? "..."
                  : isFavorite
                    ? "− Remove favorite"
                    : "+ Add to favorites"}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center flex-1 gap-2 p-4 text-center">
          <div className="w-8 h-8 rounded-full bg-bg-raised border border-border-strong flex items-center justify-center">
            <i className="pi pi-map-marker text-text-dim text-sm" />
          </div>
          <span className="text-[10px] text-text-dim">
            Select a film to view details
          </span>
        </div>
      )}
    </div>
  );
}
