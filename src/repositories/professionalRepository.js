const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const findByUserId = (userId) => {
	return prisma.professional.findUnique({ where: { userId } });
};

const findById = (id) => {
	return prisma.professional.findUnique({ where: { id } });
};

const create = (data) => {
	return prisma.professional.create({ data });
};

const update = (id, data) => {
	return prisma.professional.update({ where: { id }, data });
};

const search = ({ profession, location, availability } = {}) => {
	const where = {};
	if (profession) where.profession = { contains: profession, mode: 'insensitive' };
	if (location) where.location = { contains: location, mode: 'insensitive' };
	if (availability !== undefined) where.availability = availability;
	return prisma.professional.findMany({ where });
};

module.exports = {
	findByUserId,
	findById,
	create,
	update,
	search
};
