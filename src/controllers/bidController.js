const bidService = require('../services/bidService');

exports.create = async (req, res) => {
  try {
    const bid = await bidService.createBid({
      ...req.body,
      contractorId: req.user.sub, 
    });
    return res.status(201).json({ message: 'Bid submitted', bid });
  } catch (error) {
    return res.status(error.status || 400).json({ message: error.message });
  }
};

exports.assign = async (req, res) => {
  try {
    const { projectId, bidId } = req.body;
    const result = await bidService.assignBid({
      projectId,
      bidId,
      ownerId: req.user.sub,
    });
    return res.status(200).json({ message: 'Bid assigned', project: result });
  } catch (error) {
    return res.status(error.status || 400).json({ message: error.message });
  }
};