import { useEffect } from "react";
import { useMoviesQuery } from "../service/movies.service";
import { useMoviesStore } from "../store/movies.store";
import type { MovieSearchParams } from "../types/movies.type";

/**
 * Hook to manage the movie list state and data fetching.
 * Synchronizes results with the global MoviesStore.
 */
export const useMovies = (params: MovieSearchParams) => {
  const setMovies = useMoviesStore((state) => state.setMovies);

  const query = useMoviesQuery(params);

  useEffect(() => {
    if (query.data) {
      setMovies(query.data);
    }
  }, [query.data, setMovies]);

  return query;
};
