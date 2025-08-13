const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const create = (data) => prisma.contractorJob.create({ data });
const findById = (id) => prisma.contractorJob.findUnique({ where: { id } });

module.exports = { create, findById };
