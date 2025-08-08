const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const {cleanProjectResponse} = require('../utils/projectResponseCleaner');

const createProject = async (projectData) => {
    const project = await prisma.project.create({
        data: projectData,
    });
    return cleanProjectResponse(project);

};

const findProjectById = async (id) => {
    const project =  await prisma.project.findUnique({
        where: { id },
    });
    return project ? cleanProjectResponse(project) : null;
};

const findProjectByOwnerId = async(ownerId) => {
    return await prisma.project.findMany({
        where: {ownerId},
    });
}

const updateProject = async ({ id, ...updateData }) => {
    const project = await prisma.project.update({
      where: { id },
      data: updateData,
    });

    return cleanProjectResponse(project);
  };

const updateProjectStatus = async (projectId, status) => {
    const project = await prisma.project.update({
        where: { id: projectId },
        data: { status },
    });
    return cleanProjectResponse(project);
}

const findProjectsByContractorId = async (contractorId) => {
    return await prisma.project.findMany({
      where: { contractorId },
      orderBy: { createdAt: 'desc' },
    });
  };
  


module.exports ={
    createProject,
    findProjectById,
    findProjectByOwnerId,
    updateProject,
    updateProjectStatus,
    findProjectsByContractorId
}