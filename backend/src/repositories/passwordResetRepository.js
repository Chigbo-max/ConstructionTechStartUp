const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createPasswordResetToken = async (userId, token, expiresAt) => {
  return await prisma.passwordResetToken.create({
    data: {
      userId,
      token,
      expiresAt,
    },
  });
};

const findPasswordResetToken = async (token) => {
  return await prisma.passwordResetToken.findUnique({
    where: { token },
    include: {
      user: {
        select: {
          id: true,
          email: true,
        },
      },
    },
  });
};

const markTokenAsUsed = async (token) => {
  return await prisma.passwordResetToken.update({
    where: { token },
    data: { used: true },
  });
};

const deleteExpiredTokens = async () => {
  return await prisma.passwordResetToken.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });
};

const deleteUserTokens = async (userId) => {
  return await prisma.passwordResetToken.deleteMany({
    where: { userId },
  });
};

module.exports = {
  createPasswordResetToken,
  findPasswordResetToken,
  markTokenAsUsed,
  deleteExpiredTokens,
  deleteUserTokens,
};
