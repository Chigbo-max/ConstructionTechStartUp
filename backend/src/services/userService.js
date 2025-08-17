const userRepository =  require('../repositories/userRepository');
const passwordResetRepository = require('../repositories/passwordResetRepository');
const emailService = require('./emailService');
const bcrypt = require('bcrypt');
const {cleanProfileResponse} = require('../utils/userProfileResponseCleaner')

const registerUser = async({email, password, firstName, lastName, roles, professionDescription}) => {
    if(!email || !password || !firstName || !lastName || !roles) {
        throw new Error('All fields are required');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new Error('Invalid email address');
    }

    const validRoles = ['HOMEOWNER', 'CONTRACTOR', 'OTHER'];

    if(!roles || !Array.isArray(roles) || roles.length === 0){
        throw new Error('At least one role is required');
    }

    for(const role of roles){
    if(!validRoles.includes(role)) {
        throw new Error(`Role must be one of: ${validRoles.join(', ')}`);
        }
    }

    if(roles.includes('OTHER') && !professionDescription ) {
        throw new Error('Please specify your profession for role OTHER');
    }

    if (professionDescription) {
        const trimmedProfDesc = professionDescription.trim();
    
        if (trimmedProfDesc === '' || /^\.{1,}$/.test(trimmedProfDesc)) {
            throw new Error('Profession description cannot be empty or just dots');
        }
    }

    const existingUser = await userRepository.findUserByEmail(email);
    if (existingUser) {
        const updatedRoles = [...new Set([...existingUser.roles, ...roles])];
        
        const updatedUser = await userRepository.updateUserRoles(existingUser.id, updatedRoles);
        
        return cleanProfileResponse(updatedUser);
      }
    
    const name = `${firstName} ${lastName}`;
   
    if(password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
    }
 
    if(password.length > 50) {
        throw new Error('Password must be less than 50 characters long');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUserData = {
        email,
        passwordHash,
        name,
        roles,
    }

    if(roles.includes('OTHER') && professionDescription){
        newUserData.professionDescription = professionDescription;
    }

    const newUser = await userRepository.createUser(newUserData);
    return cleanProfileResponse(newUser);
};

const findUserById = async (id) => {
    const user = await userRepository.findUserById(id);
    if (!user) return null;
    
    return cleanProfileResponse(user);
  };

const findUserByEmail = async (email) => {
    return await userRepository.findUserByEmail(email);
  };
  
const updateUser = async (userId, updateData) => {
    const allowedFields = ['name', 'professionDescription'];
    const filteredData = {};
    
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        filteredData[field] = updateData[field];
      }
    }
    
    const updatedUser = await userRepository.updateUser(userId, filteredData);
    
    return cleanProfileResponse(updatedUser);
};

const requestPasswordReset = async (email) => {
  const user = await userRepository.findUserByEmail(email);
  if (!user) {
    // Don't reveal if user exists or not for security
    return { message: 'If an account with that email exists, a password reset link has been sent.' };
  }

  // Generate a secure random token
  const crypto = require('crypto');
  const token = crypto.randomBytes(32).toString('hex');
  
  // Token expires in 1 hour
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
  
  // Delete any existing tokens for this user
  await passwordResetRepository.deleteUserTokens(user.id);
  
  // Create new token
  await passwordResetRepository.createPasswordResetToken(user.id, token, expiresAt);
  
  // Send password reset email
  const resetUrl = `$process.env.FRONTEND_URL/reset-password?token=${token}`;
  
  try {
    await emailService.sendPasswordResetEmail({
      userEmail: user.email,
      userName: user.name,
      resetToken: token,
      resetUrl: resetUrl
    });
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    // Don't fail the request if email fails, but log it
  }
  
  return {
    message: 'If an account with that email exists, a password reset link has been sent.',
    userId: user.id
  };
};

const resetPassword = async (token, newPassword) => {
  if (!token || !newPassword) {
    throw new Error('Token and new password are required');
  }

  if (newPassword.length < 8) {
    throw new Error('Password must be at least 8 characters long');
  }

  if (newPassword.length > 50) {
    throw new Error('Password must be less than 50 characters long');
  }

  const resetToken = await passwordResetRepository.findPasswordResetToken(token);
  if (!resetToken) {
    throw new Error('Invalid or expired reset token');
  }

  if (resetToken.used) {
    throw new Error('Reset token has already been used');
  }

  if (resetToken.expiresAt < new Date()) {
    throw new Error('Reset token has expired');
  }

  // Hash the new password
  const passwordHash = await bcrypt.hash(newPassword, 10);
  
  // Update user password
  await userRepository.updateUserPassword(resetToken.user.id, passwordHash);
  
  // Mark token as used
  await passwordResetRepository.markTokenAsUsed(token);
  
  // Delete all tokens for this user
  await passwordResetRepository.deleteUserTokens(resetToken.user.id);
  
  return { message: 'Password has been reset successfully' };
};

module.exports = {
    registerUser,
    findUserById,
    findUserByEmail,
    updateUser,
    requestPasswordReset,
    resetPassword
};
