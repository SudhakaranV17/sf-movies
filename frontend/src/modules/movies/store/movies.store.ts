import { create } from "zustand";
import type { Movie, MovieSortOption } from "../types/movies.type";

const SF_CENTER: [number, number] = [37.7749, -122.4194];
const DEFAULT_ZOOM = 13;

interface MoviesState {
  movies: Movie[];
  search: string;
  year: string | null;
  sort: MovieSortOption;
  page: number;
  limit: number;
  selectedMovie: Movie | null;
  mapCenter: [number, number];
  mapZoom: number;
  /** True while filters are changing and list hasn't refreshed yet */
  isFiltering: boolean;

  // Actions
  setMovies: (movies: Movie[]) => void;
  setSearch: (search: string) => void;
  setYear: (year: string | null) => void;
  setSort: (sort: MovieSortOption) => void;
  setPage: (page: number) => void;
  setSelectedMovie: (movie: Movie | null) => void;
  setMapViewport: (center: [number, number], zoom: number) => void;
  setIsFiltering: (v: boolean) => void;
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
  mapCenter: SF_CENTER,
  mapZoom: DEFAULT_ZOOM,
  isFiltering: false,

  setMovies: (movies) => set({ movies }),
  setSearch: (search) => set({ search }),
  setYear: (year) => set({ year }),
  setSort: (sort) => set({ sort }),
  setPage: (page) => set({ page }),
  setSelectedMovie: (selectedMovie) => set({ selectedMovie }),
  setMapViewport: (mapCenter, mapZoom) => set({ mapCenter, mapZoom }),
  setIsFiltering: (isFiltering) => set({ isFiltering }),

  resetFilters: () =>
    set({
      search: "",
      year: null,
      sort: "title_asc",
      page: 1,
      selectedMovie: null,
    }),
}));
