const express = require('express');
const router = express.Router();
const config = require('../util/config');
const logger = require('../util/logger').AppLogger;
function createResponse(res, result) {
  result.status = 'success';
  return res.json(result);
}

// api/pms/v2/init
router.post('/', (req, res, next) => {
  logger.debug(req.body);
  config.set('app.pcn', {});
  config.set('app.pms.site.id', '1234567');
  config.set('app.pms.site.name', 'lg_pms');
  config.set('app.pms.site.currency', 'USD');
  config.set('app.pms.status', 'up');
  config.set('app.pms.subscriptionId', 1);
  config.set('app.room', {});
  config.set('cli.pms.host', 'http://127.0.0.1:9890');
  let result = { status: '' };
  Promise.resolve()
    .then(() => createResponse(res, result))
    .catch(error => next(error));
});

module.exports = router;
