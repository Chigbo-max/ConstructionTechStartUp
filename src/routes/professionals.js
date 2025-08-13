const express = require('express');
const professionalService = require('../services/professionalService');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

router.post('/profile', authenticateToken, requireRole(['OTHER', 'CONTRACTOR']), async (req, res) => {
  try {
    const userId = req.user.sub;
    const profileData = req.body;
    
    const profile = await professionalService.registerOrUpdateProfessionalProfile(userId, profileData);
    
    res.status(201).json({ profile });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/search', async (req, res) => {
  try {
    const { profession, location, availability } = req.query;
    const filters = {};
    
    if (profession) filters.profession = profession;
    if (location) filters.location = location;
    if (availability !== undefined) filters.availability = availability === 'true';
    
    const professionals = await professionalService.searchProfessionals(filters);
    
    res.json({ professionals });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
