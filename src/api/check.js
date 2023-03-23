const express = require('express');
const router = express.Router();
const logger = require('../util/logger').AppLogger;
const config = require('../util/config');

function createPostResponse(res, auth) {
  config.set('app.pms.site.id', auth.client_id);
  return res.json({
    status: 'success',
  });
}

function checkStatus(pms) {
  // Checking server connection
  return Promise.resolve(pms);
}

// TODO: pms request body validation
// TODO: 40x client error handling
router.post('/', (req, res, next) => {
  const pms = req.body;
  checkStatus(pms)
    .then(() => createPostResponse(res, JSON.parse(req.headers.auth)))
    .catch(error => next(error));
});

module.exports = router;
