import { MovieSchema, MovieSearchSchema } from '../movies.type';

describe('Movie Schemas', () => {
  describe('MovieSchema', () => {
    it('should validate complete movie data', () => {
      const validMovie = {
        id: 1,
        title: 'The Matrix',
        release_year: 1999,
        locations: 'Market Street',
        fun_facts: 'Filmed in SF',
        production_company: 'Warner Bros',
        distributor: 'Warner Bros',
        director: 'Wachowski Brothers',
        writer: 'Wachowski Brothers',
        actor_1: 'Keanu Reeves',
        actor_2: 'Laurence Fishburne',
        actor_3: 'Carrie-Anne Moss',
        latitude: 37.7749,
        longitude: -122.4194,
        analysis_neighborhood: 'Financial District',
        supervisor_district: 'District 6',
      };

      const result = MovieSchema.safeParse(validMovie);
      expect(result.success).toBe(true);
    });

    it('should validate minimal movie data', () => {
      const minimalMovie = {
        id: 1,
        title: 'Test Movie',
      };

      const result = MovieSchema.safeParse(minimalMovie);
      expect(result.success).toBe(true);
    });

    it('should accept null values for optional fields', () => {
      const movieWithNulls = {
        id: 1,
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
        analysis_neighborhood: null,
        supervisor_district: null,
      };

      const result = MovieSchema.safeParse(movieWithNulls);
      expect(result.success).toBe(true);
    });

    it('should reject movie without id', () => {
      const invalidMovie = {
        title: 'Test Movie',
      };

      const result = MovieSchema.safeParse(invalidMovie);
      expect(result.success).toBe(false);
    });

    it('should reject movie without title', () => {
      const invalidMovie = {
        id: 1,
      };

      const result = MovieSchema.safeParse(invalidMovie);
      expect(result.success).toBe(false);
    });

    it('should reject non-number id', () => {
      const invalidMovie = {
        id: '1',
        title: 'Test Movie',
      };

      const result = MovieSchema.safeParse(invalidMovie);
      expect(result.success).toBe(false);
    });

    it('should reject non-string title', () => {
      const invalidMovie = {
        id: 1,
        title: 123,
      };

      const result = MovieSchema.safeParse(invalidMovie);
      expect(result.success).toBe(false);
    });

    it('should validate movie with coordinates', () => {
      const movieWithCoords = {
        id: 1,
        title: 'Test Movie',
        latitude: 37.7749,
        longitude: -122.4194,
      };

      const result = MovieSchema.safeParse(movieWithCoords);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.latitude).toBe(37.7749);
        expect(result.data.longitude).toBe(-122.4194);
      }
    });

    it('should validate movie with all actor fields', () => {
      const movieWithActors = {
        id: 1,
        title: 'Test Movie',
        actor_1: 'Actor One',
        actor_2: 'Actor Two',
        actor_3: 'Actor Three',
      };

      const result = MovieSchema.safeParse(movieWithActors);
      expect(result.success).toBe(true);
    });
  });

  describe('MovieSearchSchema', () => {
    it('should validate empty search params', () => {
      const emptyParams = {};

      const result = MovieSearchSchema.safeParse(emptyParams);
      expect(result.success).toBe(true);
    });

    it('should validate search query', () => {
      const params = {
        q: 'golden gate',
      };

      const result = MovieSearchSchema.safeParse(params);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.q).toBe('golden gate');
      }
    });

    it('should validate year filter', () => {
      const params = {
        year: '2020',
      };

      const result = MovieSearchSchema.safeParse(params);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.year).toBe('2020');
      }
    });

    it('should validate sort parameter', () => {
      const params = {
        sort: 'title_asc',
      };

      const result = MovieSearchSchema.safeParse(params);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.sort).toBe('title_asc');
      }
    });

    it('should validate movieId parameter', () => {
      const params = {
        movieId: 123,
      };

      const result = MovieSearchSchema.safeParse(params);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.movieId).toBe(123);
      }
    });

    it('should coerce string movieId to number', () => {
      const params = {
        movieId: '456',
      };

      const result = MovieSearchSchema.safeParse(params);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.movieId).toBe(456);
        expect(typeof result.data.movieId).toBe('number');
      }
    });

    it('should validate all parameters together', () => {
      const params = {
        q: 'matrix',
        year: '1999',
        sort: 'year_desc',
        movieId: 100,
      };

      const result = MovieSearchSchema.safeParse(params);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.q).toBe('matrix');
        expect(result.data.year).toBe('1999');
        expect(result.data.sort).toBe('year_desc');
        expect(result.data.movieId).toBe(100);
      }
    });

    it('should handle empty strings', () => {
      const params = {
        q: '',
        year: '',
        sort: '',
      };

      const result = MovieSearchSchema.safeParse(params);
      expect(result.success).toBe(true);
    });

    it('should reject invalid movieId', () => {
      const params = {
        movieId: 'not-a-number',
      };

      const result = MovieSearchSchema.safeParse(params);
      expect(result.success).toBe(false);
    });
  });
});
