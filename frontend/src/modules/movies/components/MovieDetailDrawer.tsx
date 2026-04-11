import toast from "react-hot-toast";
import { useIsMutating } from "@tanstack/react-query";

import { useMoviesStore } from "@/modules/movies/store/movies.store";
import { useFavoritesStore } from "@/modules/favorites/store/favorites.store";
import {
  useAddFavorite,
  useRemoveFavorite,
} from "@/modules/favorites/service/favorites.service";
import { useAuthStore } from "@/shared/store/useAuthStore";
import { QUERYKEYPROVIDER } from "@/config/constants";

interface Props {
  onLayoutToggle: () => void;
}

export default function MovieDetailDrawer({ onLayoutToggle }: Props) {
  const selectedMovie = useMoviesStore((state) => state.selectedMovie);
  const setSelectedMovie = useMoviesStore((state) => state.setSelectedMovie);
  const favorites = useFavoritesStore((state) => state.favorites);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const { mutate: addFavorite } = useAddFavorite();
  const { mutate: removeFavorite } = useRemoveFavorite();

  const isAdding =
    useIsMutating({ mutationKey: [QUERYKEYPROVIDER.ADD_FAVORITE] }) > 0;
  const isRemoving =
    useIsMutating({ mutationKey: [QUERYKEYPROVIDER.REMOVE_FAVORITE] }) > 0;
  const isBusy = isAdding || isRemoving;

  const isFavorite =
    selectedMovie !== null &&
    favorites.some((f) => f.movie_id === selectedMovie.id);

  const handleFavoriteToggle = () => {
    if (!selectedMovie) return;
    if (isFavorite) {
      removeFavorite(selectedMovie.id);
    } else {
      addFavorite(selectedMovie.id);
    }
  };

  const handleShare = () => {
    if (!selectedMovie) return;
    const url = `${window.location.origin}/dashboard?movieId=${selectedMovie.id}`;
    navigator.clipboard
      .writeText(url)
      .then(() => toast.success("Link copied to clipboard"))
      .catch(() => toast.error("Failed to copy link"));
  };

  return (
    <div className="bg-bg-raised border-border-strong border-t shrink-0">
      <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 sm:h-16">
        {selectedMovie && (
          <>
            {/* Title + year */}
            <div className="min-w-0 max-w-[140px] sm:max-w-none shrink-0">
              <div className="font-medium text-[13px] text-text-primary truncate leading-tight">
                {selectedMovie.title}
              </div>
              <div className="mt-0.5 text-[11px] text-text-muted">
                {selectedMovie.release_year ?? "—"}
              </div>
            </div>

            {/* Separator + meta grid — hidden on small screens */}
            <div className="hidden sm:block bg-border-strong w-px h-9 shrink-0" />

            <div className="hidden flex-1 gap-x-4 sm:grid grid-cols-3 min-w-0">
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-[9px] text-text-dim uppercase tracking-[.05em]">
                  Director
                </span>
                <span className="font-medium text-[11px] text-text-secondary truncate">
                  {selectedMovie.director || "—"}
                </span>
              </div>
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-[9px] text-text-dim uppercase tracking-[.05em]">
                  Actor
                </span>
                <span className="font-medium text-[11px] text-text-secondary truncate">
                  {selectedMovie.actor_1 || "—"}
                </span>
              </div>
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-[9px] text-text-dim uppercase tracking-[.05em]">
                  Location
                </span>
                <span className="font-medium text-[11px] text-accent truncate">
                  {selectedMovie.locations || "—"}
                </span>
              </div>
            </div>

            {/* Separator before actions */}
            <div className="hidden sm:block bg-border-strong w-px h-9 shrink-0" />

            {/* Actions — pushed to right on mobile */}
            <div className="flex items-center gap-2 ml-auto sm:ml-0 shrink-0">
              {isAuthenticated && (
                <button
                  onClick={handleFavoriteToggle}
                  disabled={isBusy}
                  title={
                    isFavorite ? "Remove from favorites" : "Add to favorites"
                  }
                  className={`text-[11px] font-medium px-2.5 sm:px-3 py-1.5 rounded-[6px] cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 ${
                    isFavorite
                      ? "bg-danger-bg text-danger border border-danger-border"
                      : "bg-accent text-bg-surface border-none"
                  }`}
                >
                  {isAdding ? (
                    <>
                      <i className="text-[10px] pi pi-spin pi-spinner" />
                      <span className="hidden sm:inline">Saving…</span>
                    </>
                  ) : isRemoving ? (
                    <>
                      <i className="text-[10px] pi pi-spin pi-spinner" />
                      <span className="hidden sm:inline">Removing…</span>
                    </>
                  ) : isFavorite ? (
                    <>
                      <i className="sm:hidden text-[11px] pi pi-heart-fill" />
                      <span className="hidden sm:inline"> Unfavorite</span>
                    </>
                  ) : (
                    <>
                      <i className="sm:hidden text-[11px] pi pi-heart" />
                      <span className="hidden sm:inline"> Favorites</span>
                    </>
                  )}
                </button>
              )}

              {/* Share link */}
              <button
                onClick={handleShare}
                title="Copy shareable link"
                className="flex justify-center items-center bg-bg-overlay hover:bg-bg-overlay/80 border border-border-strong rounded-[5px] w-7 h-7 text-text-dim hover:text-text-secondary transition-colors cursor-pointer"
              >
                <i className="text-[11px] pi pi-share-alt" />
              </button>

              {/* Switch to panel — desktop only */}
              <button
                onClick={onLayoutToggle}
                title="Switch to side panel"
                className="hidden sm:flex justify-center items-center bg-bg-overlay hover:bg-bg-overlay/80 border border-border-strong rounded-[5px] w-7 h-7 text-text-dim hover:text-text-secondary transition-colors cursor-pointer"
              >
                <i className="text-xs pi pi-window-maximize" />
              </button>

              <button
                onClick={() => setSelectedMovie(null)}
                title="Close"
                className="flex justify-center items-center bg-bg-overlay hover:bg-bg-overlay/80 border border-border-strong rounded-[5px] w-7 h-7 text-text-dim hover:text-text-secondary transition-colors cursor-pointer"
              >
                <i className="text-[11px] pi pi-times" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
