import { LoginSchema, RegisterSchema, AuthResponseSchema } from '../auth.schema';

describe('Auth Schemas', () => {
  describe('LoginSchema', () => {
    it('should validate correct login data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const result = LoginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'password123',
      };

      const result = LoginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Invalid email address');
      }
    });

    it('should reject short password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: '12345',
      };

      const result = LoginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Password must be at least 6 characters');
      }
    });

    it('should reject missing email', () => {
      const invalidData = {
        password: 'password123',
      };

      const result = LoginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject missing password', () => {
      const invalidData = {
        email: 'test@example.com',
      };

      const result = LoginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('RegisterSchema', () => {
    it('should validate correct registration data', () => {
      const validData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      };

      const result = RegisterSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject short username', () => {
      const invalidData = {
        username: 'ab',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      };

      const result = RegisterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Username must be at least 3 characters');
      }
    });

    it('should reject invalid email', () => {
      const invalidData = {
        username: 'testuser',
        email: 'invalid-email',
        password: 'password123',
        confirmPassword: 'password123',
      };

      const result = RegisterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Invalid email address');
      }
    });

    it('should reject short password', () => {
      const invalidData = {
        username: 'testuser',
        email: 'test@example.com',
        password: '12345',
        confirmPassword: '12345',
      };

      const result = RegisterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Password must be at least 6 characters');
      }
    });

    it('should reject mismatched passwords', () => {
      const invalidData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'different123',
      };

      const result = RegisterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Passwords don't match");
        expect(result.error.issues[0].path).toContain('confirmPassword');
      }
    });

    it('should reject missing fields', () => {
      const invalidData = {
        username: 'testuser',
      };

      const result = RegisterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('AuthResponseSchema', () => {
    it('should validate correct auth response', () => {
      const validData = {
        user: {
          id: 1,
          email: 'test@example.com',
        },
        access_token: 'jwt-token-here',
        token_type: 'bearer',
      };

      const result = AuthResponseSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject response without user', () => {
      const invalidData = {
        access_token: 'jwt-token-here',
        token_type: 'bearer',
      };

      const result = AuthResponseSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject response without access_token', () => {
      const invalidData = {
        user: {
          id: 1,
          email: 'test@example.com',
        },
        token_type: 'bearer',
      };

      const result = AuthResponseSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject invalid user email', () => {
      const invalidData = {
        user: {
          id: 1,
          email: 'invalid-email',
        },
        access_token: 'jwt-token-here',
        token_type: 'bearer',
      };

      const result = AuthResponseSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject non-number user id', () => {
      const invalidData = {
        user: {
          id: '1',
          email: 'test@example.com',
        },
        access_token: 'jwt-token-here',
        token_type: 'bearer',
      };

      const result = AuthResponseSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});
