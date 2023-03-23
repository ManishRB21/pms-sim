const express = require('express');
const joi = require('joi');
const _ = require('lodash');
const logger = require('../util/logger').AppLogger;
const validator = require('../util/validator');
const config = require('../util/config');
const router = express.Router();

function createResponse(res, result) {
  result.status = 'success';
  return res.json(result);
}

router.get('/', (req, res, next) => {
  const pcn = [];
  const subscriptions = config.get('app.pcn');
  _.forEach(subscriptions, (subscription) => {
    pcn.push(`${subscription.host}${subscription.prefix}`);
  });
  const pms = {
    pcnHost: pcn,
    pmsHost: config.get('cli.pms.host')
  };

  Promise.resolve()
    .then(() => createResponse(res, pms))
    .catch(error => next(error));
});

router.post('/', (req, res, next) => {
  logger.debug(req.body);

  try {
    const schema = joi.object().keys({
      host: joi.any().required(),
    });

    validator.validateRequestBody(req, schema);
  } catch (err) {
    return next(err);
  }

  const host = _.get(req.body, 'host');

  config.set('cli.pms.host', host);

  const pms = {
    host: config.get('cli.pms.host'),
  };

  Promise.resolve()
    .then(() => createResponse(res, pms))
    .catch(error => next(error));
});

module.exports = router;
