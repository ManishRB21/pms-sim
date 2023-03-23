const express = require('express');
const router = express.Router();
const config = require('../util/config');

function createGetResponse(res, result) {
  return res.json({
    status: 'success',
    data: result || {},
  });
}

function getDetails() {
  // Retrieve site (hotel or property) information
  const now = new Date();
  const detail = {
    id: config.get('app.pms.site.id'),
    name: config.get('app.pms.site.name'),
    timestamp: now.toISOString(),
  };

  return Promise.resolve(detail);
}

router.get('/', (req, res, next) => {
  return getDetails()
    .then(result => createGetResponse(res, result))
    .catch(error => next(error));
});

module.exports = router;
