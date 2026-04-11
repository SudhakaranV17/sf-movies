import { FavoriteSchema } from '../favorites.type';

describe('Favorite Schemas', () => {
  describe('FavoriteSchema', () => {
    it('should validate complete favorite data', () => {
      const validFavorite = {
        id: 1,
        movie_id: 100,
        movie: {
          id: 100,
          title: 'Favorite Movie',
          release_year: 2020,
          locations: 'Golden Gate Bridge',
          fun_facts: 'Iconic location',
          production_company: 'Test Studios',
          distributor: 'Test Distributor',
          director: 'Test Director',
          writer: 'Test Writer',
          actor_1: 'Actor One',
          actor_2: 'Actor Two',
          actor_3: 'Actor Three',
          latitude: 37.8199,
          longitude: -122.4783,
        },
      };

      const result = FavoriteSchema.safeParse(validFavorite);
      expect(result.success).toBe(true);
    });

    it('should validate favorite with minimal movie data', () => {
      const minimalFavorite = {
        id: 1,
        movie_id: 100,
        movie: {
          id: 100,
          title: 'Test Movie',
        },
      };

      const result = FavoriteSchema.safeParse(minimalFavorite);
      expect(result.success).toBe(true);
    });

    it('should validate favorite with null movie fields', () => {
      const favoriteWithNulls = {
        id: 1,
        movie_id: 100,
        movie: {
          id: 100,
          title: 'Test Movie',
          release_year: null,
          locations: null,
          fun_facts: null,
          production_company: null,
          distributor: null,
          director: null,
          writer: null,
          actor_1: null,
          actor_2: null,
          actor_3: null,
          latitude: null,
          longitude: null,
        },
      };

      const result = FavoriteSchema.safeParse(favoriteWithNulls);
      expect(result.success).toBe(true);
    });

    it('should reject favorite without id', () => {
      const invalidFavorite = {
        movie_id: 100,
        movie: {
          id: 100,
          title: 'Test Movie',
        },
      };

      const result = FavoriteSchema.safeParse(invalidFavorite);
      expect(result.success).toBe(false);
    });

    it('should reject favorite without movie_id', () => {
      const invalidFavorite = {
        id: 1,
        movie: {
          id: 100,
          title: 'Test Movie',
        },
      };

      const result = FavoriteSchema.safeParse(invalidFavorite);
      expect(result.success).toBe(false);
    });

    it('should reject favorite without movie object', () => {
      const invalidFavorite = {
        id: 1,
        movie_id: 100,
      };

      const result = FavoriteSchema.safeParse(invalidFavorite);
      expect(result.success).toBe(false);
    });

    it('should reject favorite with invalid movie data', () => {
      const invalidFavorite = {
        id: 1,
        movie_id: 100,
        movie: {
          id: 100,
          // missing title
        },
      };

      const result = FavoriteSchema.safeParse(invalidFavorite);
      expect(result.success).toBe(false);
    });

    it('should reject non-number id', () => {
      const invalidFavorite = {
        id: '1',
        movie_id: 100,
        movie: {
          id: 100,
          title: 'Test Movie',
        },
      };

      const result = FavoriteSchema.safeParse(invalidFavorite);
      expect(result.success).toBe(false);
    });

    it('should reject non-number movie_id', () => {
      const invalidFavorite = {
        id: 1,
        movie_id: '100',
        movie: {
          id: 100,
          title: 'Test Movie',
        },
      };

      const result = FavoriteSchema.safeParse(invalidFavorite);
      expect(result.success).toBe(false);
    });

    it('should validate favorite with movie coordinates', () => {
      const favoriteWithCoords = {
        id: 1,
        movie_id: 100,
        movie: {
          id: 100,
          title: 'Test Movie',
          latitude: 37.7749,
          longitude: -122.4194,
        },
      };

      const result = FavoriteSchema.safeParse(favoriteWithCoords);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.movie.latitude).toBe(37.7749);
        expect(result.data.movie.longitude).toBe(-122.4194);
      }
    });

    it('should ensure movie_id matches movie.id conceptually', () => {
      // Note: Schema doesn't enforce this, but we can test the structure
      const favorite = {
        id: 1,
        movie_id: 100,
        movie: {
          id: 100, // Should match movie_id
          title: 'Test Movie',
        },
      };

      const result = FavoriteSchema.safeParse(favorite);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.movie_id).toBe(result.data.movie.id);
      }
    });
  });
});
