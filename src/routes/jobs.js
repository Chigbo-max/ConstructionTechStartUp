const express = require('express');
const contractorJobService = require('../services/contractorJobService');
const professionalRepository = require('../repositories/professionalRepository');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticateToken, requireRole(['CONTRACTOR']), async (req, res) => {
  try {
    const contractorId = req.user.sub;
    const jobData = req.body;
    
    const job = await contractorJobService.postJob(contractorId, jobData);
    
    res.status(201).json({ job });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/:jobId/apply', authenticateToken, requireRole(['OTHER', 'CONTRACTOR']), async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.sub;
    const applicationData = req.body;
    
    // First, find the professional profile for this user
    const professional = await professionalRepository.findByUserId(userId);
    if (!professional) {
      return res.status(400).json({ message: 'Professional profile not found. Please create a professional profile first.' });
    }
    
    const application = await contractorJobService.applyForJob({
      jobId,
      professionalId: professional.id,
      ...applicationData
    });
    
    res.status(201).json({ application });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch('/applications/:applicationId/decision', authenticateToken, requireRole(['CONTRACTOR']), async (req, res) => {
  try {
    const { applicationId } = req.params;
    const contractorId = req.user.sub;
    const { decision } = req.body;
    
    const application = await contractorJobService.decideOnApplication({
      applicationId,
      contractorId,
      decision
    });
    
    res.json({ application });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
