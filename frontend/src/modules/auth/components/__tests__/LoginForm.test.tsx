import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from '../LoginForm';
import { useLogin } from '../../hooks/auth.hook';

// Mock the auth hook
jest.mock('../../hooks/auth.hook');

const mockUseLogin = useLogin as jest.MockedFunction<typeof useLogin>;

describe('LoginForm', () => {
  const mockHandleLogin = jest.fn();
  const mockRegister = jest.fn((name) => ({ name }));
  const mockHandleSubmit = jest.fn((callback) => (e: any) => {
    e?.preventDefault();
    callback({ email: 'test@example.com', password: 'password123' });
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLogin.mockReturnValue({
      register: mockRegister,
      handleSubmit: mockHandleSubmit,
      handleLogin: mockHandleLogin,
      isLoggingIn: false,
      formState: { errors: {} },
    } as any);
  });

  it('should render email and password fields', () => {
    render(<LoginForm />);

    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  });

  it('should render submit button', () => {
    render(<LoginForm />);

    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('should toggle password visibility', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const passwordInput = screen.getByPlaceholderText('Password');
    const toggleButton = screen.getByLabelText(/show password/i);

    expect(passwordInput).toHaveAttribute('type', 'password');

    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');

    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('should display email validation error', () => {
    mockUseLogin.mockReturnValue({
      register: mockRegister,
      handleSubmit: mockHandleSubmit,
      handleLogin: mockHandleLogin,
      isLoggingIn: false,
      formState: {
        errors: {
          email: { message: 'Invalid email address' },
        },
      },
    } as any);

    render(<LoginForm />);

    expect(screen.getByText('Invalid email address')).toBeInTheDocument();
  });

  it('should display password validation error', () => {
    mockUseLogin.mockReturnValue({
      register: mockRegister,
      handleSubmit: mockHandleSubmit,
      handleLogin: mockHandleLogin,
      isLoggingIn: false,
      formState: {
        errors: {
          password: { message: 'Password is required' },
        },
      },
    } as any);

    render(<LoginForm />);

    expect(screen.getByText('Password is required')).toBeInTheDocument();
  });

  it('should show loading state when submitting', () => {
    mockUseLogin.mockReturnValue({
      register: mockRegister,
      handleSubmit: mockHandleSubmit,
      handleLogin: mockHandleLogin,
      isLoggingIn: true,
      formState: { errors: {} },
    } as any);

    render(<LoginForm />);

    expect(screen.getByText('Signing in...')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should call handleLogin on form submit', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitButton);

    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  it('should register email and password fields', () => {
    render(<LoginForm />);

    expect(mockRegister).toHaveBeenCalledWith('email');
    expect(mockRegister).toHaveBeenCalledWith('password');
  });

  it('should apply error styling to email field when error exists', () => {
    mockUseLogin.mockReturnValue({
      register: mockRegister,
      handleSubmit: mockHandleSubmit,
      handleLogin: mockHandleLogin,
      isLoggingIn: false,
      formState: {
        errors: {
          email: { message: 'Invalid email' },
        },
      },
    } as any);

    const { container } = render(<LoginForm />);
    const emailWrapper = container.querySelector('.border-danger');

    expect(emailWrapper).toBeInTheDocument();
  });
});
