import { memo, useCallback } from "react";
import { Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";

import { useMoviesStore } from "@/modules/movies/store/movies.store";
import MoviePopup from "./MoviePopup";
import type { Movie } from "@/modules/movies/types/movies.type";

interface Props {
  movie: Movie;
}

/* ─── Pre-built icons — created once, reused across all markers ─── */
const ICON_INACTIVE = L.divIcon({
  className: "",
  iconSize: [9, 9],
  iconAnchor: [4.5, 4.5],
  html: `<div style="width:9px;height:9px;border-radius:50%;background:#1e3a55;border:1.5px solid rgba(96,165,250,0.4);"></div>`,
});

const ICON_ACTIVE = L.divIcon({
  className: "",
  iconSize: [14, 14],
  iconAnchor: [7, 7],
  html: `<div style="width:14px;height:14px;border-radius:50%;background:#60a5fa;border:2px solid #93c5fd;box-shadow:0 0 0 4px rgba(96,165,250,0.2);"></div>`,
});

/* ─── Tooltip HTML — built once per movie, never rebuilt on re-render ─ */
const tooltipCache = new Map<number, string>();

function getTooltipHtml(movie: Movie): string {
  if (!tooltipCache.has(movie.id)) {
    tooltipCache.set(
      movie.id,
      renderToStaticMarkup(<MoviePopup movie={movie} />),
    );
  }
  return tooltipCache.get(movie.id)!;
}

/* ─── Component ──────────────────────────────── */
const MovieMarker = memo(function MovieMarker({ movie }: Props) {
  /*
   * Each marker subscribes only to selectedMovie — but uses a selector
   * that returns a stable boolean so it only re-renders when THIS marker's
   * active state changes, not when a different marker is selected.
   */
  const isActive = useMoviesStore(
    (state) => state.selectedMovie?.id === movie.id,
  );
  const setSelectedMovie = useMoviesStore((state) => state.setSelectedMovie);

  const handleClick = useCallback(() => {
    setSelectedMovie(isActive ? null : movie);
  }, [isActive, movie, setSelectedMovie]);

  if (!movie.latitude || !movie.longitude) return null;

  return (
    <Marker
      position={[movie.latitude, movie.longitude]}
      icon={isActive ? ICON_ACTIVE : ICON_INACTIVE}
      zIndexOffset={isActive ? 1000 : 0}
      eventHandlers={{ click: handleClick }}
    >
      <Tooltip direction="top" offset={[0, -6]} opacity={1}>
        <div dangerouslySetInnerHTML={{ __html: getTooltipHtml(movie) }} />
      </Tooltip>
    </Marker>
  );
});

export default MovieMarker;
