const express = require('express');
const router = express.Router();

// User Command -> PMS
router.use('/commands', require('./command'));

// PCS -> PMS
router.use('/api/pms', require('./pms'));

module.exports = router;
