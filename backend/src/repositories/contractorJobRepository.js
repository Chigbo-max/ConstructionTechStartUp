const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const create = (data) => prisma.contractorJob.create({ data });
const findById = (id) => prisma.contractorJob.findUnique({ where: { id } });
const findAll = (filters = {}) => {
  const where = {};
  
  if (filters.status) {
    where.status = filters.status;
  }
  
  if (filters.requiredProfession) {
    where.requiredProfession = filters.requiredProfession;
  }
  
  if (filters.contractorId) {
    where.contractorId = filters.contractorId;
  }
  
  return prisma.contractorJob.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      contractor: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });
};

module.exports = { create, findById, findAll };
