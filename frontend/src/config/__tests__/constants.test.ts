import { ENDPOINTS, QUERYKEYPROVIDER } from '../constants';

describe('constants', () => {
  describe('ENDPOINTS', () => {
    it('should have correct auth endpoints', () => {
      expect(ENDPOINTS.AUTH_LOGIN).toBe('/auth/login');
      expect(ENDPOINTS.AUTH_REGISTER).toBe('/auth/register');
    });

    it('should have correct movie endpoints', () => {
      expect(ENDPOINTS.MOVIES_LIST).toBe('/movies');
      expect(ENDPOINTS.MOVIES_SEARCH).toBe('/movies/search');
    });

    it('should have correct favorites endpoint', () => {
      expect(ENDPOINTS.FAVORITES).toBe('/favorites');
    });

    it('should have all required endpoints', () => {
      const requiredEndpoints = [
        'AUTH_LOGIN',
        'AUTH_REGISTER',
        'MOVIES_LIST',
        'MOVIES_SEARCH',
        'FAVORITES',
      ];

      requiredEndpoints.forEach((endpoint) => {
        expect(ENDPOINTS).toHaveProperty(endpoint);
        expect(typeof ENDPOINTS[endpoint as keyof typeof ENDPOINTS]).toBe('string');
      });
    });
  });

  describe('QUERYKEYPROVIDER', () => {
    it('should have correct query keys', () => {
      expect(QUERYKEYPROVIDER.LOGGED_IN_USER).toBe('logged-in-user');
      expect(QUERYKEYPROVIDER.MOVIES_LIST_DATA).toBe('movies-list-data');
      expect(QUERYKEYPROVIDER.MOVIE_DETAILS).toBe('movie-details');
      expect(QUERYKEYPROVIDER.FAVORITES_LIST).toBe('favorites-list');
      expect(QUERYKEYPROVIDER.ADD_FAVORITE).toBe('add-favorite');
      expect(QUERYKEYPROVIDER.REMOVE_FAVORITE).toBe('remove-favorite');
    });

    it('should have all required query keys', () => {
      const requiredKeys = [
        'LOGGED_IN_USER',
        'MOVIES_LIST_DATA',
        'MOVIE_DETAILS',
        'FAVORITES_LIST',
        'ADD_FAVORITE',
        'REMOVE_FAVORITE',
      ];

      requiredKeys.forEach((key) => {
        expect(QUERYKEYPROVIDER).toHaveProperty(key);
        expect(typeof QUERYKEYPROVIDER[key as keyof typeof QUERYKEYPROVIDER]).toBe('string');
      });
    });

    it('should have unique query key values', () => {
      const values = Object.values(QUERYKEYPROVIDER);
      const uniqueValues = new Set(values);
      expect(values.length).toBe(uniqueValues.size);
    });
  });
});
