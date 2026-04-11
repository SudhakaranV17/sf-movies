import { renderHook, act } from '@testing-library/react';
import { useFavoritesStore } from '../favorites.store';
import type { Favorite } from '../../types/favorites.type';

const mockFavorite: Favorite = {
  id: 1,
  movie_id: 100,
  movie: {
    id: 100,
    title: 'Favorite Movie',
    release_year: 2020,
    locations: 'Test Location',
    fun_facts: null,
    production_company: 'Test Company',
    distributor: null,
    director: 'Test Director',
    writer: null,
    actor_1: null,
    actor_2: null,
    actor_3: null,
    latitude: 37.7749,
    longitude: -122.4194,
  },
};

describe('useFavoritesStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useFavoritesStore.setState({
      favorites: [],
    });
  });

  it('should initialize with empty favorites', () => {
    const { result } = renderHook(() => useFavoritesStore());

    expect(result.current.favorites).toEqual([]);
  });

  it('should set favorites', () => {
    const { result } = renderHook(() => useFavoritesStore());
    const favorites = [mockFavorite];

    act(() => {
      result.current.setFavorites(favorites);
    });

    expect(result.current.favorites).toEqual(favorites);
  });

  it('should replace existing favorites when setting new ones', () => {
    const { result } = renderHook(() => useFavoritesStore());
    const firstFavorites = [mockFavorite];
    const secondFavorite: Favorite = {
      ...mockFavorite,
      id: 2,
      movie_id: 200,
      movie: { ...mockFavorite.movie, id: 200, title: 'Another Movie' },
    };

    act(() => {
      result.current.setFavorites(firstFavorites);
    });

    expect(result.current.favorites).toHaveLength(1);

    act(() => {
      result.current.setFavorites([secondFavorite]);
    });

    expect(result.current.favorites).toHaveLength(1);
    expect(result.current.favorites[0].id).toBe(2);
  });

  it('should handle multiple favorites', () => {
    const { result } = renderHook(() => useFavoritesStore());
    const favorites: Favorite[] = [
      mockFavorite,
      { ...mockFavorite, id: 2, movie_id: 200 },
      { ...mockFavorite, id: 3, movie_id: 300 },
    ];

    act(() => {
      result.current.setFavorites(favorites);
    });

    expect(result.current.favorites).toHaveLength(3);
  });
});
