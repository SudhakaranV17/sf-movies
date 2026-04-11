import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegisterForm from '../RegisterForm';
import { useRegister } from '../../hooks/auth.hook';

// Mock the auth hook
jest.mock('../../hooks/auth.hook');

const mockUseRegister = useRegister as jest.MockedFunction<typeof useRegister>;

describe('RegisterForm', () => {
  const mockHandleRegister = jest.fn();
  const mockRegister = jest.fn((name) => ({ name }));
  const mockHandleSubmit = jest.fn((callback) => (e: any) => {
    e?.preventDefault();
    callback({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRegister.mockReturnValue({
      register: mockRegister,
      handleSubmit: mockHandleSubmit,
      handleRegister: mockHandleRegister,
      isRegistering: false,
      formState: { errors: {} },
    } as any);
  });

  it('should render all form fields', () => {
    render(<RegisterForm />);

    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password (min 6 characters)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm password')).toBeInTheDocument();
  });

  it('should render submit button', () => {
    render(<RegisterForm />);

    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  it('should toggle password visibility for both password fields', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    const passwordInput = screen.getByPlaceholderText('Password (min 6 characters)');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm password');
    const toggleButton = screen.getByLabelText(/show password/i);

    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');

    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    expect(confirmPasswordInput).toHaveAttribute('type', 'text');

    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');
  });

  it('should display username validation error', () => {
    mockUseRegister.mockReturnValue({
      register: mockRegister,
      handleSubmit: mockHandleSubmit,
      handleRegister: mockHandleRegister,
      isRegistering: false,
      formState: {
        errors: {
          username: { message: 'Username is required' },
        },
      },
    } as any);

    render(<RegisterForm />);

    expect(screen.getByText('Username is required')).toBeInTheDocument();
  });

  it('should display email validation error', () => {
    mockUseRegister.mockReturnValue({
      register: mockRegister,
      handleSubmit: mockHandleSubmit,
      handleRegister: mockHandleRegister,
      isRegistering: false,
      formState: {
        errors: {
          email: { message: 'Invalid email address' },
        },
      },
    } as any);

    render(<RegisterForm />);

    expect(screen.getByText('Invalid email address')).toBeInTheDocument();
  });

  it('should display password validation error', () => {
    mockUseRegister.mockReturnValue({
      register: mockRegister,
      handleSubmit: mockHandleSubmit,
      handleRegister: mockHandleRegister,
      isRegistering: false,
      formState: {
        errors: {
          password: { message: 'Password must be at least 6 characters' },
        },
      },
    } as any);

    render(<RegisterForm />);

    expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
  });

  it('should display confirm password validation error', () => {
    mockUseRegister.mockReturnValue({
      register: mockRegister,
      handleSubmit: mockHandleSubmit,
      handleRegister: mockHandleRegister,
      isRegistering: false,
      formState: {
        errors: {
          confirmPassword: { message: 'Passwords do not match' },
        },
      },
    } as any);

    render(<RegisterForm />);

    expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
  });

  it('should show loading state when submitting', () => {
    mockUseRegister.mockReturnValue({
      register: mockRegister,
      handleSubmit: mockHandleSubmit,
      handleRegister: mockHandleRegister,
      isRegistering: true,
      formState: { errors: {} },
    } as any);

    render(<RegisterForm />);

    expect(screen.getByText('Creating account...')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should call handleRegister on form submit', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    const submitButton = screen.getByRole('button', { name: /create account/i });
    await user.click(submitButton);

    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  it('should register all form fields', () => {
    render(<RegisterForm />);

    expect(mockRegister).toHaveBeenCalledWith('username');
    expect(mockRegister).toHaveBeenCalledWith('email');
    expect(mockRegister).toHaveBeenCalledWith('password');
    expect(mockRegister).toHaveBeenCalledWith('confirmPassword');
  });

  it('should apply error styling when field has error', () => {
    mockUseRegister.mockReturnValue({
      register: mockRegister,
      handleSubmit: mockHandleSubmit,
      handleRegister: mockHandleRegister,
      isRegistering: false,
      formState: {
        errors: {
          username: { message: 'Username is required' },
          email: { message: 'Invalid email' },
        },
      },
    } as any);

    const { container } = render(<RegisterForm />);
    const errorFields = container.querySelectorAll('.border-danger');

    expect(errorFields.length).toBeGreaterThan(0);
  });
});
