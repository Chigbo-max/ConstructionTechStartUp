const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const findByJobAndProfessional = (jobId, professionalId) => {
	return prisma.jobApplication.findUnique({ where: { jobId_professionalId: { jobId, professionalId } } });
};

const create = (data) => prisma.jobApplication.create({ data });

const findById = (id) => prisma.jobApplication.findUnique({ where: { id } });

const updateStatus = (id, status) => prisma.jobApplication.update({ where: { id }, data: { status } });

module.exports = {
	findByJobAndProfessional,
	create,
	findById,
	updateStatus
};
