const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createProject = async (projectData) => {
    return await prisma.project.create({
        data: projectData,
    });
};

const findProjectById = async (id) => {
    return await prisma.project.findUnique({
        where: { id },
    });
};

const findProjectByOwnerId = async(ownerId) => {
    return await prisma.project.findMany({
        where: {ownerId},
    });
}

const updateProjectStatus = async (projectId, status) => {
    return await prisma.project.update({
        where: { id: projectId },
        data: { status },
    });
}


module.exports ={
    createProject,
    findProjectById,
    findProjectByOwnerId,
    updateProjectStatus,
}