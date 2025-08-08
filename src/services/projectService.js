const projectRepository = require('../repositories/projectRepository');
const userRepository = require('../repositories/userRepository');

async function geocodeAddress(address) {
  const url = new URL('https://nominatim.openstreetmap.org/search');
  url.searchParams.set('q', address);
  url.searchParams.set('format', 'json');
  url.searchParams.set('limit', '1');
  const response = await fetch(url, {
    headers: { 'User-Agent': 'construction-tech-start-up/1.0' },
  });
  if (!response.ok) {
    throw new Error('Geocoding failed');
  }
  const results = await response.json();
  if (!Array.isArray(results) || results.length === 0) {
    throw new Error('Address not found');
  }
  return {
    latitude: parseFloat(results[0].lat),
    longitude: parseFloat(results[0].lon),
  };
}

const createProject = async ({
  ownerId,
  title,
  description,
  budget,
  startDate,
  endDate,
  address,
  latitude,
  longitude,
}) => {

  if (
    !title || !description || budget == null ||
    !startDate || !endDate || !address
  ) {
    throw new Error('All project fields are required');
  }

  const owner = await userRepository.findUserById(ownerId);
  if (!owner) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }
  if (owner.role !== 'HOMEOWNER') {
    const err = new Error('Only homeowners can create projects');
    err.status = 403;
    throw err;
  }

  const numericBudget = Number(budget);
  if (!Number.isFinite(numericBudget) || numericBudget <= 0) {
    throw new Error('Budget must be a positive number');
  }

  let latNum = latitude != null ? Number(latitude) : null;
  let lngNum = longitude != null ? Number(longitude) : null;
  if (latNum == null || lngNum == null) {
    const coords = await geocodeAddress(address);
    latNum = coords.latitude;
    lngNum = coords.longitude;
  }
 

  const start = new Date(startDate);
  const end = new Date(endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    throw new Error('Invalid startDate or endDate');
  }
  if (start > end) {
    throw new Error('startDate must be before or equal to endDate');
  }

  const projectData = {
    title,
    description,
    ownerId,
    budget: numericBudget,
    startDate: start,
    endDate: end,
    address,
    latitude: latNum,
    longitude: lngNum,
  };

  const project = await projectRepository.createProject(projectData);
  return project;
};



const publishProject = async ({ projectId, bidsCloseAt, ownerId }) => {
    const project = await projectRepository.findProjectById(projectId);
    if (!project) {
      const err = new Error('Project not found');
      err.status = 404;
      throw err;
    }
    if (project.ownerId !== ownerId) {
      const err = new Error('Not authorized to publish this project');
      err.status = 403;
      throw err;
    }
    if (project.status !== 'DRAFT') {
      const err = new Error('Only draft projects can be published');
      err.status = 400;
      throw err;
    }
  
    const closeDate = new Date(bidsCloseAt);
    if (Number.isNaN(closeDate.getTime()) || closeDate <= new Date()) {
      throw new Error('Bids close date must be in the future');
    }
  
    const updated = await projectRepository.updateProject({
      id: projectId,
      status: 'OPEN_FOR_BIDS',
      bidsCloseAt: closeDate,
    });
    return updated;
  };


const allowedTransitions = {
  DRAFT: new Set(['PUBLISHED', 'OPEN_FOR_BIDS', 'CANCELLED']),
  PUBLISHED: new Set(['OPEN_FOR_BIDS', 'CANCELLED']),
  OPEN_FOR_BIDS: new Set(['ACTIVE', 'CANCELLED']),
  ACTIVE: new Set(['COMPLETED', 'CANCELLED']),
  COMPLETED: new Set([]),
  CANCELLED: new Set([]),
};


const updateProjectStatus = async ({ projectId, newStatus, actorUserId }) => {
  if (!projectId || !newStatus || !actorUserId) {
    throw new Error('projectId, newStatus and actorUserId are required');
  }
  const project = await projectRepository.findProjectById(projectId);
  if (!project) {
    const err = new Error('Project not found');
    err.status = 404;
    throw err;
  }
  
  if (project.ownerId !== actorUserId) {
    const err = new Error('Not authorized to update status');
    err.status = 403;
    throw err;
  }
  const allowedNext = allowedTransitions[project.status] || new Set();
  if (!allowedNext.has(newStatus)) {
    const err = new Error(`Invalid status transition from ${project.status} to ${newStatus}`);
    err.status = 400;
    throw err;
  }
  const updated = await projectRepository.updateProjectStatus(projectId, newStatus);
  return updated;
};

module.exports = {
     createProject,
     updateProjectStatus,
     publishProject
     };