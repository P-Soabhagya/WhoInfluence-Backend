const express = require('express');
const router = express.Router();
const campaigns = require('../data/campaigns.json');

router.get('/', (req, res) => {
  res.json({ success: true, data: campaigns });
});

router.get('/:id', (req, res) => {
  const campaign = campaigns.find(c => c.id === parseInt(req.params.id));
  if (!campaign) return res.status(404).json({ success: false, message: 'Campaign not found' });
  res.json({ success: true, data: campaign });
});

module.exports = router;
