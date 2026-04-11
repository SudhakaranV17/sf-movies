import { useCallback } from "react";
import { Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";

import { useMoviesStore } from "@/modules/movies/store/movies.store";
import MoviePopup from "./MoviePopup";
import type { Movie } from "@/modules/movies/types/movies.type";

interface Props {
  movie: Movie;
}

/* ─── Icon factories ─────────────────────────── */
const makeIcon = (active: boolean) =>
  L.divIcon({
    className: "",
    iconSize: active ? [14, 14] : [9, 9],
    iconAnchor: active ? [7, 7] : [4.5, 4.5],
    html: active
      ? `<div style="
          width:14px;height:14px;border-radius:50%;
          background:#60a5fa;border:2px solid #93c5fd;
          box-shadow:0 0 0 4px rgba(96,165,250,0.2);
        "></div>`
      : `<div style="
          width:9px;height:9px;border-radius:50%;
          background:#1e3a55;border:1.5px solid rgba(96,165,250,0.4);
        "></div>`,
  });

/* ─── Component ──────────────────────────────── */
export default function MovieMarker({ movie }: Props) {
  const selectedMovie = useMoviesStore((state) => state.selectedMovie);
  const setSelectedMovie = useMoviesStore((state) => state.setSelectedMovie);

  const isActive = selectedMovie?.id === movie.id;

  const handleClick = useCallback(() => {
    setSelectedMovie(isActive ? null : movie);
  }, [isActive, movie, setSelectedMovie]);

  if (!movie.latitude || !movie.longitude) return null;

  return (
    <Marker
      position={[movie.latitude, movie.longitude]}
      icon={makeIcon(isActive)}
      zIndexOffset={isActive ? 1000 : 0}
      eventHandlers={{ click: handleClick }}
    >
      <Tooltip
        direction="top"
        offset={[0, -6]}
        opacity={1}
      >
        {/* renderToStaticMarkup lets us use our React component inside Leaflet Tooltip */}
        <div
          dangerouslySetInnerHTML={{
            __html: renderToStaticMarkup(<MoviePopup movie={movie} />),
          }}
        />
      </Tooltip>
    </Marker>
  );
}
