import type { Movie } from "@/modules/movies/types/movies.type";

interface Props {
  movie: Movie;
}

/** Content rendered inside a Leaflet Tooltip on marker hover. */
export default function MoviePopup({ movie }: Props) {
  return (
    <div className="flex flex-col gap-0.5 min-w-[120px]">
      <span className="font-medium text-[13px] text-text-primary leading-tight">
        {movie.title}
      </span>
      <span className="text-[11px] text-text-dim">
        {[movie.release_year, movie.locations].filter(Boolean).join(" · ")}
      </span>
    </div>
  );
}