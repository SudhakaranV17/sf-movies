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
      <div className="bg-border-default h-px" />
    </>
  );
}

export default function MovieDetailPanel({ onLayoutToggle }: Props) {
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
    <div className="flex flex-col bg-bg-surface border-border-strong border-l w-[85vw] md:w-[200px] lg:w-[220px] max-w-[240px] h-full">
      {/* Header */}
      <div className="flex justify-between items-center px-3 py-2 border-border-strong border-b shrink-0">
        <span className="font-medium text-[11px] text-text-primary truncate">
          {selectedMovie ? selectedMovie.title : "Details"}
        </span>
        <div className="flex items-center gap-1 ml-2 shrink-0">
          <button
            onClick={handleShare}
            title="Copy shareable link"
            className="flex justify-center items-center bg-bg-overlay border border-border-strong rounded-[4px] w-5 h-5 text-text-dim hover:text-text-secondary transition-colors cursor-pointer"
          >
            <i className="text-[9px] pi pi-share-alt" />
          </button>
          <button
            onClick={onLayoutToggle}
            title="Switch to bottom drawer"
            className="hidden sm:flex justify-center items-center bg-bg-overlay border border-border-strong rounded-[4px] w-5 h-5 text-text-dim hover:text-text-secondary transition-colors cursor-pointer"
          >
            <i className="text-[9px] pi pi-window-minimize" />
          </button>
          <button
            onClick={() => setSelectedMovie(null)}
            title="Close"
            className="flex justify-center items-center bg-bg-overlay border border-border-strong rounded-[4px] w-5 h-5 text-text-dim hover:text-text-secondary transition-colors cursor-pointer"
          >
            <i className="text-[9px] pi pi-times" />
          </button>
        </div>
      </div>

      {/* Body */}
      {selectedMovie ? (
        <>
          <div className="flex flex-col flex-1 gap-2 p-3 overflow-y-auto">
            <DetailRow label="Year" value={selectedMovie.release_year} accent />
            <DetailRow label="Director" value={selectedMovie.director} />
            <DetailRow label="Actor" value={selectedMovie.actor_1} />
            {selectedMovie.actor_2 && (
              <DetailRow label="Co-actor" value={selectedMovie.actor_2} />
            )}
            {selectedMovie.actor_3 && (
              <DetailRow label="Co-actor" value={selectedMovie.actor_3} />
            )}
            {selectedMovie.distributor && (
              <DetailRow
                label="Distributor"
                value={selectedMovie.distributor}
              />
            )}
            {selectedMovie.production_company && (
              <DetailRow
                label="Production Company"
                value={selectedMovie.production_company}
              />
            )}
            {selectedMovie.writer && (
              <DetailRow label="Writer" value={selectedMovie.writer} />
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

          {isAuthenticated && (
            <div className="flex flex-col gap-1.5 p-2.5 border-border-strong border-t shrink-0">
              <button
                onClick={handleFavoriteToggle}
                disabled={isBusy}
                className={`w-full py-1.5 rounded-[6px] text-[11px] font-medium cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1 ${
                  isFavorite
                    ? "bg-danger-bg text-danger border border-danger-border"
                    : "bg-accent text-bg-surface border-none"
                }`}
              >
                {isAdding ? (
                  <><i className="text-[10px] pi pi-spin pi-spinner" /> Saving…</>
                ) : isRemoving ? (
                  <><i className="text-[10px] pi pi-spin pi-spinner" /> Removing…</>
                ) : isFavorite ? (
                  <><i className="pi pi-heart-fill text-[10px]" /> Remove</>
                ) : (
                  <><i className="pi pi-heart text-[10px]" /> Favorite</>
                )}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col flex-1 justify-center items-center gap-2 p-4 text-center">
          <div className="flex justify-center items-center bg-bg-raised border border-border-strong rounded-full w-8 h-8">
            <i className="text-text-dim text-sm pi pi-map-marker" />
          </div>
          <span className="text-[10px] text-text-dim">
            Select a film to view details
          </span>
        </div>
      )}
    </div>
  );
}
