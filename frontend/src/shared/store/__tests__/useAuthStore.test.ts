import { renderHook, act } from '@testing-library/react';
import { useAuthStore } from '../useAuthStore';

describe('useAuthStore', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Reset store state
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useAuthStore());

    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should set auth state when setAuth is called', () => {
    const { result } = renderHook(() => useAuthStore());
    const mockUser = { id: 1, email: 'test@example.com' };
    const mockToken = 'mock-jwt-token';

    act(() => {
      result.current.setAuth(mockUser, mockToken);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.token).toBe(mockToken);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should clear auth state when logout is called', () => {
    const { result } = renderHook(() => useAuthStore());
    const mockUser = { id: 1, email: 'test@example.com' };
    const mockToken = 'mock-jwt-token';

    // First set auth
    act(() => {
      result.current.setAuth(mockUser, mockToken);
    });

    // Then logout
    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should persist auth state to localStorage', () => {
    const { result } = renderHook(() => useAuthStore());
    const mockUser = { id: 1, email: 'test@example.com' };
    const mockToken = 'mock-jwt-token';

    act(() => {
      result.current.setAuth(mockUser, mockToken);
    });

    const stored = localStorage.getItem('auth-storage');
    expect(stored).toBeTruthy();
    
    const parsed = JSON.parse(stored!);
    expect(parsed.state.user).toEqual(mockUser);
    expect(parsed.state.token).toBe(mockToken);
    expect(parsed.state.isAuthenticated).toBe(true);
  });

  it('should restore auth state from localStorage', () => {
    const mockUser = { id: 1, email: 'test@example.com' };
    const mockToken = 'mock-jwt-token';

    // Manually set localStorage
    localStorage.setItem(
      'auth-storage',
      JSON.stringify({
        state: {
          user: mockUser,
          token: mockToken,
          isAuthenticated: true,
        },
        version: 0,
      })
    );

    // Force store to rehydrate from localStorage
    useAuthStore.persist.rehydrate();

    // Create new hook instance
    const { result } = renderHook(() => useAuthStore());

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.token).toBe(mockToken);
    expect(result.current.isAuthenticated).toBe(true);
  });
});
