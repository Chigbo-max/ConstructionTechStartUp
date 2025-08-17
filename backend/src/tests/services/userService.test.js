const userService = require('../../services/userService');
const userRepository = require('../../repositories/userRepository');
const passwordResetRepository = require('../../repositories/passwordResetRepository');
const emailService = require('../../services/emailService');
const bcrypt = require('bcrypt');

jest.mock('../../repositories/userRepository');
jest.mock('../../repositories/passwordResetRepository');
jest.mock('../../services/emailService');
jest.mock('bcrypt');
jest.mock('../../utils/userProfileResponseCleaner', () => ({
  cleanProfileResponse: jest.fn((user) => user)
}));

describe('User Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    const validUserData = {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
      roles: ['HOMEOWNER'],
      professionDescription: null
    };

    test('should register a new user successfully', async () => {
      userRepository.findUserByEmail.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashedPassword123');
      userRepository.createUser.mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
        name: 'John Doe',
        roles: ['HOMEOWNER']
      });

      const result = await userService.registerUser(validUserData);

      expect(userRepository.findUserByEmail).toHaveBeenCalledWith('test@example.com');
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(userRepository.createUser).toHaveBeenCalledWith({
        email: 'test@example.com',
        passwordHash: 'hashedPassword123',
        name: 'John Doe',
        roles: ['HOMEOWNER']
      });
      expect(result).toHaveProperty('id', 'user-1');
    });

    test('should register user with OTHER role and profession description', async () => {
      const otherRoleData = {
        ...validUserData,
        roles: ['OTHER'],
        professionDescription: 'Interior Designer'
      };

      userRepository.findUserByEmail.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashedPassword123');
      userRepository.createUser.mockResolvedValue({
        id: 'user-1',
        ...otherRoleData,
        professionDescription: 'Interior Designer'
      });

      const result = await userService.registerUser(otherRoleData);

      expect(userRepository.createUser).toHaveBeenCalledWith({
        email: 'test@example.com',
        passwordHash: 'hashedPassword123',
        name: 'John Doe',
        roles: ['OTHER'],
        professionDescription: 'Interior Designer'
      });
    });

    test('should update existing user with new roles', async () => {
      const existingUser = {
        id: 'user-1',
        email: 'test@example.com',
        roles: ['HOMEOWNER']
      };

      userRepository.findUserByEmail.mockResolvedValue(existingUser);
      userRepository.updateUserRoles.mockResolvedValue({
        ...existingUser,
        roles: ['HOMEOWNER', 'CONTRACTOR']
      });

      const result = await userService.registerUser({
        ...validUserData,
        roles: ['CONTRACTOR']
      });

      expect(userRepository.updateUserRoles).toHaveBeenCalledWith('user-1', ['HOMEOWNER', 'CONTRACTOR']);
      expect(result.roles).toContain('HOMEOWNER');
      expect(result.roles).toContain('CONTRACTOR');
    });

    test('should reject registration when email is missing', async () => {
      const invalidData = { ...validUserData };
      delete invalidData.email;

      await expect(userService.registerUser(invalidData)).rejects.toThrow('All fields are required');
    });

    test('should reject registration when password is missing', async () => {
      const invalidData = { ...validUserData };
      delete invalidData.password;

      await expect(userService.registerUser(invalidData)).rejects.toThrow('All fields are required');
    });

    test('should reject registration when firstName is missing', async () => {
      const invalidData = { ...validUserData };
      delete invalidData.firstName;

      await expect(userService.registerUser(invalidData)).rejects.toThrow('All fields are required');
    });

    test('should reject registration when lastName is missing', async () => {
      const invalidData = { ...validUserData };
      delete invalidData.lastName;

      await expect(userService.registerUser(invalidData)).rejects.toThrow('All fields are required');
    });

    test('should reject registration when roles are missing', async () => {
      const invalidData = { ...validUserData };
      delete invalidData.roles;

      await expect(userService.registerUser(invalidData)).rejects.toThrow('All fields are required');
    });

    test('should reject registration with invalid email format', async () => {
      const invalidData = { ...validUserData, email: 'invalid-email' };

      await expect(userService.registerUser(invalidData)).rejects.toThrow('Invalid email address');
    });

    test('should reject registration with empty roles array', async () => {
      userRepository.findUserByEmail.mockResolvedValue(null);
      const invalidData = { ...validUserData, roles: [] };

      await expect(userService.registerUser(invalidData)).rejects.toThrow('At least one role is required');
    });

    test('should reject registration with invalid role', async () => {
      const invalidData = { ...validUserData, roles: ['INVALID_ROLE'] };

      await expect(userService.registerUser(invalidData)).rejects.toThrow('Role must be one of: HOMEOWNER, CONTRACTOR, OTHER');
    });

    test('should reject registration with OTHER role but no profession description', async () => {
      const invalidData = { ...validUserData, roles: ['OTHER'], professionDescription: null };

      await expect(userService.registerUser(invalidData)).rejects.toThrow('Please specify your profession for role OTHER');
    });

    test('should reject registration with OTHER role and empty profession description', async () => {
      userRepository.findUserByEmail.mockResolvedValue(null);
      const invalidData = { ...validUserData, roles: ['OTHER'], professionDescription: '' };

      await expect(userService.registerUser(invalidData)).rejects.toThrow('Please specify your profession for role OTHER');
    });

    test('should reject registration with OTHER role and dots-only profession description', async () => {
      const invalidData = { ...validUserData, roles: ['OTHER'], professionDescription: '...' };

      await expect(userService.registerUser(invalidData)).rejects.toThrow('Profession description cannot be empty or just dots');
    });

    test('should reject registration with password too short', async () => {
      userRepository.findUserByEmail.mockResolvedValue(null);
      const invalidData = { ...validUserData, password: '123' };

      await expect(userService.registerUser(invalidData)).rejects.toThrow('Password must be at least 8 characters long');
    });

    test('should reject registration with password too long', async () => {
      userRepository.findUserByEmail.mockResolvedValue(null);
      const invalidData = { ...validUserData, password: 'a'.repeat(51) };

      await expect(userService.registerUser(invalidData)).rejects.toThrow('Password must be less than 50 characters long');
    });
  });

  describe('findUserById', () => {
    test('should find user by ID successfully', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        name: 'John Doe',
        roles: ['HOMEOWNER']
      };

      userRepository.findUserById.mockResolvedValue(mockUser);

      const result = await userService.findUserById('user-1');

      expect(userRepository.findUserById).toHaveBeenCalledWith('user-1');
      expect(result).toEqual(mockUser);
    });

    test('should return null when user not found', async () => {
      userRepository.findUserById.mockResolvedValue(null);

      const result = await userService.findUserById('nonexistent-user');

      expect(result).toBeNull();
    });
  });

  describe('findUserByEmail', () => {
    test('should find user by email successfully', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        name: 'John Doe',
        roles: ['HOMEOWNER']
      };

      userRepository.findUserByEmail.mockResolvedValue(mockUser);

      const result = await userService.findUserByEmail('test@example.com');

      expect(userRepository.findUserByEmail).toHaveBeenCalledWith('test@example.com');
      expect(result).toEqual(mockUser);
    });
  });

  describe('updateUser', () => {
    const updateData = {
      name: 'Updated Name',
      professionDescription: 'Updated Profession'
    };

    test('should update user successfully', async () => {
      const updatedUser = {
        id: 'user-1',
        name: 'Updated Name',
        professionDescription: 'Updated Profession'
      };

      userRepository.updateUser.mockResolvedValue(updatedUser);

      const result = await userService.updateUser('user-1', updateData);

      expect(userRepository.updateUser).toHaveBeenCalledWith('user-1', updateData);
      expect(result).toEqual(updatedUser);
    });

    test('should filter out non-allowed fields', async () => {
      const updateDataWithExtraFields = {
        ...updateData,
        email: 'newemail@example.com',
        roles: ['CONTRACTOR'],
        password: 'newpassword'
      };

      const updatedUser = {
        id: 'user-1',
        name: 'Updated Name',
        professionDescription: 'Updated Profession'
      };

      userRepository.updateUser.mockResolvedValue(updatedUser);

      const result = await userService.updateUser('user-1', updateDataWithExtraFields);

      expect(userRepository.updateUser).toHaveBeenCalledWith('user-1', {
        name: 'Updated Name',
        professionDescription: 'Updated Profession'
      });
      expect(result).toEqual(updatedUser);
    });

    test('should handle partial updates', async () => {
      const partialUpdateData = { name: 'Updated Name' };

      const updatedUser = {
        id: 'user-1',
        name: 'Updated Name'
      };

      userRepository.updateUser.mockResolvedValue(updatedUser);

      const result = await userService.updateUser('user-1', partialUpdateData);

      expect(userRepository.updateUser).toHaveBeenCalledWith('user-1', { name: 'Updated Name' });
      expect(result).toEqual(updatedUser);
    });
  });

  describe('requestPasswordReset', () => {
    beforeEach(() => {
      // Mock crypto.randomBytes
      jest.spyOn(require('crypto'), 'randomBytes').mockReturnValue({
        toString: jest.fn().mockReturnValue('mock-token-123')
      });
      
      // Mock process.env
      process.env.FRONTEND_URL = 'http://localhost:3000';
    });

    test('should create password reset token and send email for existing user', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        name: 'John Doe'
      };

      userRepository.findUserByEmail.mockResolvedValue(mockUser);
      passwordResetRepository.deleteUserTokens.mockResolvedValue();
      passwordResetRepository.createPasswordResetToken.mockResolvedValue({ id: 'token-1' });
      emailService.sendPasswordResetEmail.mockResolvedValue();

      const result = await userService.requestPasswordReset('test@example.com');

      expect(userRepository.findUserByEmail).toHaveBeenCalledWith('test@example.com');
      expect(passwordResetRepository.deleteUserTokens).toHaveBeenCalledWith('user-1');
      expect(passwordResetRepository.createPasswordResetToken).toHaveBeenCalledWith(
        'user-1', 
        'mock-token-123', 
        expect.any(Date)
      );
      expect(emailService.sendPasswordResetEmail).toHaveBeenCalledWith({
        userEmail: 'test@example.com',
        userName: 'John Doe',
        resetToken: 'mock-token-123',
        resetUrl: 'http://localhost:3000/reset-password?token=mock-token-123'
      });
      expect(result.message).toBe('If an account with that email exists, a password reset link has been sent.');
      expect(result.userId).toBe('user-1');
    });

    test('should return success message even for non-existent user (security)', async () => {
      userRepository.findUserByEmail.mockResolvedValue(null);

      const result = await userService.requestPasswordReset('nonexistent@example.com');

      expect(result.message).toBe('If an account with that email exists, a password reset link has been sent.');
      expect(result.userId).toBeUndefined();
    });

    test('should handle email service failure gracefully', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        name: 'John Doe'
      };

      userRepository.findUserByEmail.mockResolvedValue(mockUser);
      passwordResetRepository.deleteUserTokens.mockResolvedValue();
      passwordResetRepository.createPasswordResetToken.mockResolvedValue({ id: 'token-1' });
      emailService.sendPasswordResetEmail.mockRejectedValue(new Error('Email service down'));

      const result = await userService.requestPasswordReset('test@example.com');

      expect(result.message).toBe('If an account with that email exists, a password reset link has been sent.');
      expect(result.userId).toBe('user-1');
    });
  });

  describe('resetPassword', () => {
    test('should reset password successfully with valid token', async () => {
      const mockResetToken = {
        id: 'token-1',
        userId: 'user-1',
        expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
        used: false,
        user: {
          id: 'user-1',
          email: 'test@example.com'
        }
      };

      passwordResetRepository.findPasswordResetToken.mockResolvedValue(mockResetToken);
      bcrypt.hash.mockResolvedValue('new-hashed-password');
      userRepository.updateUserPassword.mockResolvedValue();
      passwordResetRepository.markTokenAsUsed.mockResolvedValue();
      passwordResetRepository.deleteUserTokens.mockResolvedValue();

      const result = await userService.resetPassword('valid-token', 'newPassword123');

      expect(passwordResetRepository.findPasswordResetToken).toHaveBeenCalledWith('valid-token');
      expect(bcrypt.hash).toHaveBeenCalledWith('newPassword123', 10);
      expect(userRepository.updateUserPassword).toHaveBeenCalledWith('user-1', 'new-hashed-password');
      expect(passwordResetRepository.markTokenAsUsed).toHaveBeenCalledWith('valid-token');
      expect(passwordResetRepository.deleteUserTokens).toHaveBeenCalledWith('user-1');
      expect(result.message).toBe('Password has been reset successfully');
    });

    test('should reject password reset with invalid token', async () => {
      passwordResetRepository.findPasswordResetToken.mockResolvedValue(null);

      await expect(userService.resetPassword('invalid-token', 'newPassword123'))
        .rejects.toThrow('Invalid or expired reset token');
    });

    test('should reject password reset with used token', async () => {
      const mockResetToken = {
        id: 'token-1',
        userId: 'user-1',
        expiresAt: new Date(Date.now() + 3600000),
        used: true,
        user: { id: 'user-1', email: 'test@example.com' }
      };

      passwordResetRepository.findPasswordResetToken.mockResolvedValue(mockResetToken);

      await expect(userService.resetPassword('used-token', 'newPassword123'))
        .rejects.toThrow('Reset token has already been used');
    });

    test('should reject password reset with expired token', async () => {
      const mockResetToken = {
        id: 'token-1',
        userId: 'user-1',
        expiresAt: new Date(Date.now() - 3600000), // 1 hour ago
        used: false,
        user: { id: 'user-1', email: 'test@example.com' }
      };

      passwordResetRepository.findPasswordResetToken.mockResolvedValue(mockResetToken);

      await expect(userService.resetPassword('expired-token', 'newPassword123'))
        .rejects.toThrow('Reset token has expired');
    });

    test('should reject password reset with short password', async () => {
      await expect(userService.resetPassword('valid-token', 'short'))
        .rejects.toThrow('Password must be at least 8 characters long');
    });

    test('should reject password reset with long password', async () => {
      const longPassword = 'a'.repeat(51);
      await expect(userService.resetPassword('valid-token', longPassword))
        .rejects.toThrow('Password must be less than 50 characters long');
    });

    test('should reject password reset with missing parameters', async () => {
      await expect(userService.resetPassword('', 'newPassword123'))
        .rejects.toThrow('Token and new password are required');
      
      await expect(userService.resetPassword('valid-token', ''))
        .rejects.toThrow('Token and new password are required');
    });
  });
});
