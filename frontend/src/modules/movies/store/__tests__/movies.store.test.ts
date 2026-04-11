import { renderHook, act } from '@testing-library/react';
import { useMoviesStore } from '../movies.store';
import type { Movie } from '../../types/movies.type';

const mockMovie: Movie = {
  id: 1,
  title: 'Test Movie',
  release_year: 2020,
  locations: 'Test Location',
  fun_facts: 'Test fact',
  production_company: 'Test Company',
  distributor: 'Test Distributor',
  director: 'Test Director',
  writer: 'Test Writer',
  actor_1: 'Actor 1',
  actor_2: 'Actor 2',
  actor_3: 'Actor 3',
  latitude: 37.7749,
  longitude: -122.4194,
};

describe('useMoviesStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useMoviesStore.setState({
      movies: [],
      search: '',
      year: null,
      sort: 'title_asc',
      page: 1,
      limit: 2000,
      selectedMovie: null,
      mapCenter: [37.7749, -122.4194],
      mapZoom: 13,
      isFiltering: false,
    });
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useMoviesStore());

    expect(result.current.movies).toEqual([]);
    expect(result.current.search).toBe('');
    expect(result.current.year).toBeNull();
    expect(result.current.sort).toBe('title_asc');
    expect(result.current.page).toBe(1);
    expect(result.current.selectedMovie).toBeNull();
    expect(result.current.isFiltering).toBe(false);
  });

  it('should set movies', () => {
    const { result } = renderHook(() => useMoviesStore());
    const movies = [mockMovie];

    act(() => {
      result.current.setMovies(movies);
    });

    expect(result.current.movies).toEqual(movies);
  });

  it('should set search query', () => {
    const { result } = renderHook(() => useMoviesStore());

    act(() => {
      result.current.setSearch('golden gate');
    });

    expect(result.current.search).toBe('golden gate');
  });

  it('should set year filter', () => {
    const { result } = renderHook(() => useMoviesStore());

    act(() => {
      result.current.setYear('2020');
    });

    expect(result.current.year).toBe('2020');
  });

  it('should set sort option', () => {
    const { result } = renderHook(() => useMoviesStore());

    act(() => {
      result.current.setSort('year_desc');
    });

    expect(result.current.sort).toBe('year_desc');
  });

  it('should set page number', () => {
    const { result } = renderHook(() => useMoviesStore());

    act(() => {
      result.current.setPage(3);
    });

    expect(result.current.page).toBe(3);
  });

  it('should set selected movie', () => {
    const { result } = renderHook(() => useMoviesStore());

    act(() => {
      result.current.setSelectedMovie(mockMovie);
    });

    expect(result.current.selectedMovie).toEqual(mockMovie);
  });

  it('should set map viewport', () => {
    const { result } = renderHook(() => useMoviesStore());
    const newCenter: [number, number] = [37.8, -122.5];
    const newZoom = 15;

    act(() => {
      result.current.setMapViewport(newCenter, newZoom);
    });

    expect(result.current.mapCenter).toEqual(newCenter);
    expect(result.current.mapZoom).toBe(newZoom);
  });

  it('should set filtering state', () => {
    const { result } = renderHook(() => useMoviesStore());

    act(() => {
      result.current.setIsFiltering(true);
    });

    expect(result.current.isFiltering).toBe(true);
  });

  it('should reset filters to default values', () => {
    const { result } = renderHook(() => useMoviesStore());

    // Set some filters
    act(() => {
      result.current.setSearch('test');
      result.current.setYear('2020');
      result.current.setSort('year_desc');
      result.current.setPage(5);
      result.current.setSelectedMovie(mockMovie);
    });

    // Reset filters
    act(() => {
      result.current.resetFilters();
    });

    expect(result.current.search).toBe('');
    expect(result.current.year).toBeNull();
    expect(result.current.sort).toBe('title_asc');
    expect(result.current.page).toBe(1);
    expect(result.current.selectedMovie).toBeNull();
  });

  it('should not reset movies when resetting filters', () => {
    const { result } = renderHook(() => useMoviesStore());
    const movies = [mockMovie];

    act(() => {
      result.current.setMovies(movies);
      result.current.setSearch('test');
    });

    act(() => {
      result.current.resetFilters();
    });

    expect(result.current.movies).toEqual(movies);
  });
});
