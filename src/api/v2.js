const express = require('express');
const router = express.Router();

router.use('/check', require('./check'));
router.use('/details', require('./detail'));
router.use('/host', require('./host'));
router.use('/site', require('./site'));
router.use('/statuses', require('./status'));
router.use('/rooms', require('./room'));
router.use('/subscriptions', require('./subscription'));
router.use('/init', require('./init'));
module.exports = router;
