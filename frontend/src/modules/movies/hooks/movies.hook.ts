import { useEffect } from "react";
import { useMoviesQuery } from "../service/movies.service";
import { useMoviesStore } from "../store/movies.store";
import type { MovieSearchParams } from "../types/movies.type";

export const useMovies = (params: MovieSearchParams) => {
  const setMovies = useMoviesStore((state) => state.setMovies);
  const setIsFiltering = useMoviesStore((state) => state.setIsFiltering);

  const query = useMoviesQuery(params);

  useEffect(() => {
    if (query.data) {
      setMovies(query.data);
      // Clear the filtering flag — list is now up to date
      setIsFiltering(false);
    }
  }, [query.data, setMovies, setIsFiltering]);

  return query;
};
