import { create } from "zustand";
import type { Movie, MovieSortOption } from "../types/movies.type";

interface MoviesState {
  movies: Movie[];
  search: string;
  year: string | null;
  sort: MovieSortOption;
  page: number;
  limit: number;
  selectedMovie: Movie | null;

  // Actions
  setMovies: (movies: Movie[]) => void;
  setSearch: (search: string) => void;
  setYear: (year: string | null) => void;
  setSort: (sort: MovieSortOption) => void;
  setPage: (page: number) => void;
  setSelectedMovie: (movie: Movie | null) => void;
  resetFilters: () => void;
}

export const useMoviesStore = create<MoviesState>((set) => ({
  movies: [],
  search: "",
  year: null,
  sort: "title_asc",
  page: 1,
  limit: 2000,
  selectedMovie: null,

  setMovies: (movies) => set({ movies }),
  setSearch: (search) => set({ search }),
  setYear: (year) => set({ year }),
  setSort: (sort) => set({ sort }),
  setPage: (page) => set({ page }),
  setSelectedMovie: (selectedMovie) => set({ selectedMovie }),

  resetFilters: () =>
    set({
      search: "",
      year: null,
      sort: "title_asc",
      page: 1,
      selectedMovie: null,
    }),
}));
