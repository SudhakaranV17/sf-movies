import { renderHook } from '@testing-library/react';
import { useLogin, useRegister } from '../auth.hook';
import { useAuthStore } from '@/shared/store/useAuthStore';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {type ReactNode } from 'react';

// Mock dependencies
jest.mock('react-hot-toast');
jest.mock('@tanstack/react-router', () => ({
  useNavigate: () => jest.fn(),
}));

// Mock auth service
jest.mock('../../service/auth.service', () => ({
  useLoginMutation: () => ({
    mutate: jest.fn(),
    isPending: false,
  }),
  useRegisterMutation: () => ({
    mutate: jest.fn(),
    isPending: false,
  }),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('Auth Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.setState({ user: null, token: null, isAuthenticated: false });
  });

  describe('useLogin', () => {
    it('should initialize with default form values', () => {
      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoggingIn).toBe(false);
      expect(result.current.handleLogin).toBeDefined();
    });

    it('should have form methods', () => {
      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(),
      });

      expect(result.current.register).toBeDefined();
      expect(result.current.handleSubmit).toBeDefined();
      expect(result.current.formState).toBeDefined();
    });
  });

  describe('useRegister', () => {
    it('should initialize with default form values', () => {
      const { result } = renderHook(() => useRegister(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isRegistering).toBe(false);
      expect(result.current.handleRegister).toBeDefined();
    });

    it('should have form methods', () => {
      const { result } = renderHook(() => useRegister(), {
        wrapper: createWrapper(),
      });

      expect(result.current.register).toBeDefined();
      expect(result.current.handleSubmit).toBeDefined();
      expect(result.current.formState).toBeDefined();
    });
  });
});
