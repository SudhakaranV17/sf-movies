# Frontend Testing Guide

## Setup

This project uses Jest with React Testing Library for unit and integration testing.

## Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

## Test Structure

```
src/
├── __tests__/              # Global test utilities
│   ├── test-utils.tsx      # Custom render functions
│   └── README.md           # This file
├── __mocks__/              # Global mocks
│   └── fileMock.ts         # File/asset mocks
├── setupTests.ts           # Jest setup file
└── [module]/
    └── __tests__/          # Module-specific tests
```

## Test Categories

### 1. Store Tests
Tests for Zustand state management stores.

**Location:** `src/[module]/store/__tests__/`

**Examples:**
- `useAuthStore.test.ts` - Authentication state management
- `movies.store.test.ts` - Movies state and filters
- `favorites.store.test.ts` - Favorites state
- `theme.store.test.ts` - Theme preferences

**What to test:**
- Initial state
- State updates via actions
- State persistence (localStorage)
- State reset/clear operations

### 2. Schema/Validation Tests
Tests for Zod schemas and validation logic.

**Location:** `src/[module]/types/__tests__/`

**Examples:**
- `auth.schema.test.ts` - Login/register validation

**What to test:**
- Valid data passes validation
- Invalid data fails with correct error messages
- Edge cases (empty strings, special characters)
- Custom validation rules (password match, etc.)

### 3. Component Tests
Tests for React components using React Testing Library.

**Location:** `src/[module]/components/__tests__/`

**Examples:**
- `LoginForm.test.tsx` - Login form interactions
- `RegisterForm.test.tsx` - Registration form
- `ThemeToggle.test.tsx` - Theme toggle button
- `ErrorBoundary.test.tsx` - Error boundary fallback

**What to test:**
- Component renders correctly
- User interactions (clicks, typing)
- Form validation and submission
- Conditional rendering
- Error states and loading states
- Accessibility (aria labels, roles)

### 4. Hook Tests
Tests for custom React hooks.

**Location:** `src/[module]/hooks/__tests__/`

**Examples:**
- `auth.hook.test.tsx` - Login/register hooks

**What to test:**
- Hook initialization
- Hook return values
- State changes
- Side effects
- Error handling

### 5. Service/API Tests
Tests for API client and service functions.

**Location:** `src/[module]/service/__tests__/`

**Examples:**
- `apiClient.test.ts` - HTTP client methods

**What to test:**
- Request formatting
- Response parsing
- Error handling
- Authentication headers
- Status code handling

### 6. Utility Tests
Tests for helper functions and utilities.

**Location:** `src/shared/utils/__tests__/`

**Examples:**
- `common.utils.test.ts` - Common utility functions

**What to test:**
- Function output for various inputs
- Edge cases and boundary conditions
- Error handling
- Type safety

### 7. Config Tests
Tests for configuration files and constants.

**Location:** `src/config/__tests__/`

**Examples:**
- `constants.test.ts` - API endpoints and query keys
- `env.config.test.ts` - Environment configuration

**What to test:**
- Constants are defined correctly
- Configuration values are valid
- Environment variable handling

## Writing Tests

### Basic Component Test

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('should handle click events', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    
    render(<MyComponent onClick={handleClick} />);
    await user.click(screen.getByRole('button'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Store Test

```typescript
import { renderHook, act } from '@testing-library/react';
import { useMyStore } from '../myStore';

describe('useMyStore', () => {
  beforeEach(() => {
    useMyStore.setState({ count: 0 });
  });

  it('should increment count', () => {
    const { result } = renderHook(() => useMyStore());
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });
});
```

### Schema Validation Test

```typescript
import { MySchema } from '../schema';

describe('MySchema', () => {
  it('should validate correct data', () => {
    const result = MySchema.safeParse({ name: 'John' });
    expect(result.success).toBe(true);
  });

  it('should reject invalid data', () => {
    const result = MySchema.safeParse({ name: '' });
    expect(result.success).toBe(false);
  });
});
```

## Test Coverage Goals

- **Stores:** 100% - All state management logic
- **Schemas:** 100% - All validation rules
- **Utilities:** 90%+ - All helper functions
- **Components:** 80%+ - Critical user interactions
- **Hooks:** 80%+ - Core business logic
- **Services:** 70%+ - API interactions

## Best Practices

1. **Test behavior, not implementation**
   - Focus on what the user sees and does
   - Avoid testing internal state directly

2. **Use descriptive test names**
   - `it('should display error when email is invalid')`
   - Not: `it('test email validation')`

3. **Arrange-Act-Assert pattern**
   ```typescript
   // Arrange
   const user = userEvent.setup();
   render(<Component />);
   
   // Act
   await user.click(screen.getByRole('button'));
   
   // Assert
   expect(screen.getByText('Success')).toBeInTheDocument();
   ```

4. **Clean up after tests**
   ```typescript
   beforeEach(() => {
     jest.clearAllMocks();
     localStorage.clear();
   });
   ```

5. **Mock external dependencies**
   - API calls
   - Router navigation
   - Toast notifications
   - Browser APIs

6. **Test accessibility**
   ```typescript
   expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
   expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
   ```

## Common Testing Patterns

### Testing Forms

```typescript
it('should submit form with valid data', async () => {
  const user = userEvent.setup();
  const onSubmit = jest.fn();
  
  render(<Form onSubmit={onSubmit} />);
  
  await user.type(screen.getByLabelText(/email/i), 'test@example.com');
  await user.type(screen.getByLabelText(/password/i), 'password123');
  await user.click(screen.getByRole('button', { name: /submit/i }));
  
  expect(onSubmit).toHaveBeenCalledWith({
    email: 'test@example.com',
    password: 'password123',
  });
});
```

### Testing Async Operations

```typescript
it('should load data', async () => {
  render(<DataComponent />);
  
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
  
  await waitFor(() => {
    expect(screen.getByText(/data loaded/i)).toBeInTheDocument();
  });
});
```

### Testing Error States

```typescript
it('should display error message', async () => {
  // Mock API to return error
  jest.spyOn(api, 'fetchData').mockRejectedValue(new Error('Failed'));
  
  render(<Component />);
  
  await waitFor(() => {
    expect(screen.getByText(/error occurred/i)).toBeInTheDocument();
  });
});
```

## Using Custom Render

For components that need providers (QueryClient, Router, etc.):

```typescript
import { render } from '@/__tests__/test-utils';
import MyComponent from '../MyComponent';

it('renders with providers', () => {
  render(<MyComponent />);
  // Test your component
});
```

## Coverage Thresholds

- Branches: 70%
- Functions: 70%
- Lines: 70%
- Statements: 70%

## Troubleshooting

### Tests timing out
- Increase timeout: `jest.setTimeout(10000)`
- Check for missing `await` on async operations
- Ensure mocks are properly configured

### "Not wrapped in act(...)" warnings
- Use `renderHook` from `@testing-library/react`
- Wrap state updates in `act()`
- Use `waitFor` for async updates

### Module not found errors
- Check Jest moduleNameMapper in `jest.config.ts`
- Verify import paths match tsconfig paths
- Ensure mocks are in correct location

## Resources

- [React Testing Library Docs](https://testing-library.com/react)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
