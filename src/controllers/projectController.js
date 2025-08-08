// src/controllers/projectController.js
const projectService = require('../services/projectService');

exports.create = async (req, res) => {
  try {
    const project = await projectService.createProject({
      ...req.body,
      ownerId: req.user.sub,
    });
    return res.status(201).json({ message: 'Project created', project });
  } catch (error) {
    return res.status(error.status || 400).json({ message: error.message });
  }
};

exports.publish = async (req, res) => {
  try {
    const { projectId, bidsCloseAt } = req.body;
    const updated = await projectService.publishProject({
      projectId,
      bidsCloseAt,
      ownerId: req.user.sub,
    });
    return res.status(200).json({ message: 'Project published', project: updated });
  } catch (error) {
    return res.status(error.status || 400).json({ message: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { projectId, newStatus } = req.body;
    const updated = await projectService.updateProjectStatus({
      projectId,
      newStatus,
      actorUserId: req.user.sub,
    });
    return res.status(200).json({ message: 'Project status updated', project: updated });
  } catch (error) {
    return res.status(error.status || 400).json({ message: error.message });
  }
};