import { useThemeStore } from '../theme.store';

describe('useThemeStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useThemeStore.setState({ theme: 'dark' });
    
    // Mock document.documentElement.setAttribute
    document.documentElement.setAttribute = jest.fn();
  });

  it('initializes with dark theme', () => {
    const { theme } = useThemeStore.getState();
    expect(theme).toBe('dark');
  });

  it('toggles from dark to light', () => {
    const { toggleTheme } = useThemeStore.getState();
    
    toggleTheme();
    
    const { theme } = useThemeStore.getState();
    expect(theme).toBe('light');
    expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'light');
  });

  it('toggles from light to dark', () => {
    const { setTheme, toggleTheme } = useThemeStore.getState();
    
    // Set to light first
    setTheme('light');
    
    // Then toggle
    toggleTheme();
    
    const { theme } = useThemeStore.getState();
    expect(theme).toBe('dark');
    expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'dark');
  });

  it('sets theme directly', () => {
    const { setTheme } = useThemeStore.getState();
    
    setTheme('light');
    
    const { theme } = useThemeStore.getState();
    expect(theme).toBe('light');
    expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'light');
  });

  it('updates document attribute when theme changes', () => {
    const { setTheme } = useThemeStore.getState();
    
    setTheme('dark');
    expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'dark');
    
    setTheme('light');
    expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'light');
  });
});
