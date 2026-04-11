import apiClient from '../apiClient';
import { z } from 'zod';
import { useAuthStore } from '../../store/useAuthStore';

jest.mock('axios');

describe('ApiClient', () => {
  const mockSchema = z.object({
    id: z.number(),
    name: z.string(),
  });

  beforeEach(() => {
    jest.clearAllMocks();
    // Clear auth store
    useAuthStore.setState({ user: null, token: null, isAuthenticated: false });
  });

  describe('getInstance', () => {
    it('should return singleton instance', () => {
      const instance1 = apiClient;
      const instance2 = apiClient;
      expect(instance1).toBe(instance2);
    });
  });

  describe('get', () => {
    it('should make GET request and parse array response', async () => {
      const mockData = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
      ];

      const mockAxiosInstance = {
        get: jest.fn().mockResolvedValue({
          status: 200,
          data: mockData,
        }),
        post: jest.fn(),
        patch: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() },
        },
      };

      (apiClient as any).axiosInstance = mockAxiosInstance;

      const result = await apiClient.get('/test', mockSchema, true);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test');
      expect(result).toEqual(mockData);
    });

    it('should make GET request and parse single object response', async () => {
      const mockData = { id: 1, name: 'Item 1' };

      const mockAxiosInstance = {
        get: jest.fn().mockResolvedValue({
          status: 200,
          data: mockData,
        }),
        post: jest.fn(),
        patch: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() },
        },
      };

      (apiClient as any).axiosInstance = mockAxiosInstance;

      const result = await apiClient.get('/test', mockSchema, false);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test');
      expect(result).toEqual(mockData);
    });

    it('should handle 304 status code', async () => {
      const mockData = [{ id: 1, name: 'Item 1' }];

      const mockAxiosInstance = {
        get: jest.fn().mockResolvedValue({
          status: 304,
          data: mockData,
        }),
        post: jest.fn(),
        patch: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() },
        },
      };

      (apiClient as any).axiosInstance = mockAxiosInstance;

      const result = await apiClient.get('/test', mockSchema, true);

      expect(result).toEqual(mockData);
    });

    it('should throw error on parse failure', async () => {
      const mockData = [{ id: 'invalid', name: 'Item 1' }];

      const mockAxiosInstance = {
        get: jest.fn().mockResolvedValue({
          status: 200,
          data: mockData,
        }),
        post: jest.fn(),
        patch: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() },
        },
      };

      (apiClient as any).axiosInstance = mockAxiosInstance;

      await expect(apiClient.get('/test', mockSchema, true)).rejects.toThrow('Parse Error');
    });
  });

  describe('post', () => {
    it('should make POST request and parse response', async () => {
      const mockPayload = { name: 'New Item' };
      const mockResponse = { id: 1, name: 'New Item' };

      const mockAxiosInstance = {
        get: jest.fn(),
        post: jest.fn().mockResolvedValue({
          status: 201,
          data: mockResponse,
        }),
        patch: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() },
        },
      };

      (apiClient as any).axiosInstance = mockAxiosInstance;

      const result = await apiClient.post('/test', mockSchema, mockPayload);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/test', mockPayload);
      expect(result).toEqual(mockResponse);
    });

    it('should handle 200 status code', async () => {
      const mockResponse = { id: 1, name: 'Item' };

      const mockAxiosInstance = {
        get: jest.fn(),
        post: jest.fn().mockResolvedValue({
          status: 200,
          data: mockResponse,
        }),
        patch: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() },
        },
      };

      (apiClient as any).axiosInstance = mockAxiosInstance;

      const result = await apiClient.post('/test', mockSchema, {});

      expect(result).toEqual(mockResponse);
    });
  });

  describe('delete', () => {
    it('should make DELETE request', async () => {
      const mockResponse = { success: true };

      const mockAxiosInstance = {
        get: jest.fn(),
        post: jest.fn(),
        patch: jest.fn(),
        put: jest.fn(),
        delete: jest.fn().mockResolvedValue({
          status: 200,
          data: mockResponse,
        }),
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() },
        },
      };

      (apiClient as any).axiosInstance = mockAxiosInstance;

      const result = await apiClient.delete('/test/1', z.any());

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/test/1');
      expect(result).toEqual({
        status: 200,
        data: mockResponse,
      });
    });

    it('should make DELETE request with payload', async () => {
      const mockPayload = { reason: 'test' };
      const mockResponse = { success: true };

      const mockAxiosInstance = {
        get: jest.fn(),
        post: jest.fn(),
        patch: jest.fn(),
        put: jest.fn(),
        delete: jest.fn().mockResolvedValue({
          status: 200,
          data: mockResponse,
        }),
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() },
        },
      };

      (apiClient as any).axiosInstance = mockAxiosInstance;

      await apiClient.delete('/test/1', z.any(), mockPayload);

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/test/1', { data: mockPayload });
    });
  });
});
