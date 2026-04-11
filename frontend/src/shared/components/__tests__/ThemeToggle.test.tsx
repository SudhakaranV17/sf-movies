import { render, screen, fireEvent } from '@testing-library/react';
import ThemeToggle from '../ThemeToggle';
import { useThemeStore } from '@/shared/store/theme.store';

// Mock the theme store
jest.mock('@/shared/store/theme.store');

describe('ThemeToggle', () => {
  const mockToggleTheme = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders sun icon when theme is dark', () => {
    (useThemeStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({ theme: 'dark', toggleTheme: mockToggleTheme })
    );

    render(<ThemeToggle />);
    
    const button = screen.getByRole('button', { name: /toggle theme/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('title', 'Switch to light mode');
    
    const icon = button.querySelector('.pi-sun');
    expect(icon).toBeInTheDocument();
  });

  it('renders moon icon when theme is light', () => {
    (useThemeStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({ theme: 'light', toggleTheme: mockToggleTheme })
    );

    render(<ThemeToggle />);
    
    const button = screen.getByRole('button', { name: /toggle theme/i });
    expect(button).toHaveAttribute('title', 'Switch to dark mode');
    
    const icon = button.querySelector('.pi-moon');
    expect(icon).toBeInTheDocument();
  });

  it('calls toggleTheme when clicked', () => {
    (useThemeStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({ theme: 'dark', toggleTheme: mockToggleTheme })
    );

    render(<ThemeToggle />);
    
    const button = screen.getByRole('button', { name: /toggle theme/i });
    fireEvent.click(button);
    
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  it('has correct styling classes', () => {
    (useThemeStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({ theme: 'dark', toggleTheme: mockToggleTheme })
    );

    render(<ThemeToggle />);
    
    const button = screen.getByRole('button', { name: /toggle theme/i });
    expect(button).toHaveClass('flex', 'items-center', 'justify-center');
    expect(button).toHaveClass('w-9', 'h-9', 'rounded-[5px]');
  });
});
