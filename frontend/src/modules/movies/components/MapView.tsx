import { useEffect, useRef, useMemo, useCallback } from "react";
import { MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";

import { useMoviesStore } from "@/modules/movies/store/movies.store";
import MovieMarker from "./MovieMarker";
import type { Movie } from "@/modules/movies/types/movies.type";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* ─── Constants ──────────────────────────────── */
const MIN_ZOOM = 3; // at zoom 3, tiles are ~2048px — fills any screen, no grey borders
const MAX_ZOOM = 19;
const FLY_ZOOM = 16;
const FLY_DURATION = 1.0;
const FLY_EASE_LINEARITY = 0.15;
const VIEWPORT_THROTTLE_MS = 300;

/**
 * World bounds — prevents horizontal world-copy repetition and
 * panning past the poles, while still allowing the user to navigate
 * to any location on the globe (non-SF markers included).
 */
const WORLD_BOUNDS: L.LatLngBoundsExpression = [
  [-85, -180], // SW
  [85, 180], // NE
];

/* ─── ViewportController ─────────────────────── */
/**
 * Saves map center/zoom to the store on moveend/zoomend so the viewport
 * survives route navigation. Throttled to avoid spamming the store during
 * animated fly-to sequences.
 */
function ViewportController() {
  const setMapViewport = useMoviesStore((state) => state.setMapViewport);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const save = useCallback(
    (map: L.Map) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        const c = map.getCenter();
        setMapViewport([c.lat, c.lng], map.getZoom());
      }, VIEWPORT_THROTTLE_MS);
    },
    [setMapViewport],
  );

  useMapEvents({
    moveend: (e) => save(e.target),
    zoomend: (e) => save(e.target),
  });

  return null;
}

/* ─── FlyToController ────────────────────────── */
/**
 * Lives inside MapContainer so it can access the map instance.
 * Only flies when the selected movie ID actually changes — not on every
 * re-render or when the selection is cleared.
 */
function FlyToController({ movie }: { movie: Movie | null }) {
  const map = useMap();
  const prevIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!movie || !movie.latitude || !movie.longitude) return;
    if (movie.id === prevIdRef.current) return;

    prevIdRef.current = movie.id;

    map.flyTo([movie.latitude, movie.longitude], FLY_ZOOM, {
      duration: FLY_DURATION,
      easeLinearity: FLY_EASE_LINEARITY,
    });
  }, [movie, map]);

  return null;
}

/* ─── Props ──────────────────────────────────── */
interface MapViewProps {
  /** Movies to render as markers. Caller decides all-movies vs favorites-only. */
  movies: Movie[];
}

/* ─── Component ──────────────────────────────── */
export default function MapView({ movies }: MapViewProps) {
  const selectedMovie = useMoviesStore((state) => state.selectedMovie);
  const mapCenter = useMoviesStore((state) => state.mapCenter);
  const mapZoom = useMoviesStore((state) => state.mapZoom);

  // Stable list — only recomputes when the movies prop changes,
  // not when selectedMovie changes. Each MovieMarker handles its own
  // active state via its own store subscription.
  const mappable = useMemo(
    () => movies.filter((m) => m.latitude && m.longitude),
    [movies],
  );

  return (
    /*
     * position: absolute + inset: 0 fills the relative-positioned parent
     * completely without interfering with the outer flex layout.
     * zoom-out will never collapse or overflow the container.
     */
    <MapContainer
      center={mapCenter}
      zoom={mapZoom}
      style={{ position: "absolute", inset: 0 }}
      // ─── Bounds & zoom limits ────────────────
      minZoom={MIN_ZOOM}
      maxZoom={MAX_ZOOM}
      maxBounds={WORLD_BOUNDS}
      maxBoundsViscosity={1.0} // hard wall — no elastic bounce past bounds
      // ─── Smooth zoom ────────────────────────
      zoomDelta={0.5} // smaller step per scroll tick
      zoomSnap={0.5} // allow fractional zoom levels
      wheelPxPerZoomLevel={60} // balanced — responsive but not jumpy
      // ─── Smooth pan / inertia ───────────────
      inertia={true}
      inertiaDeceleration={2500}
      inertiaMaxSpeed={1200}
      // ─── Animations ─────────────────────────
      zoomAnimation={true}
      markerZoomAnimation={true}
      fadeAnimation={true}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
        subdomains="abcd"
        maxZoom={MAX_ZOOM}
        keepBuffer={4} // pre-render extra tile columns/rows for smooth pan
      />

      <ViewportController />
      <FlyToController movie={selectedMovie} />

      {mappable.map((movie) => (
        <MovieMarker key={`${movie.id}-${movie.locations}`} movie={movie} />
      ))}
    </MapContainer>
  );
}
