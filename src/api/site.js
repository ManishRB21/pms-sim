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
  const site = {
    id: config.get('app.pms.site.id'),
    name: config.get('app.pms.site.name'),
    currency: config.get('app.pms.site.currency'),
  };

  Promise.resolve()
    .then(() => createResponse(res, site))
    .catch(error => next(error));
});

router.post('/', (req, res, next) => {
  logger.debug(req.body);

  try {
    const schema = joi.object().keys({
      id: joi.any().optional(),
      name: joi.any().optional(),
      currency: joi.any().optional(),
    });

    validator.validateRequestBody(req, schema);
  } catch (err) {
    return next(err);
  }

  const siteId = _.get(req.body, 'id', config.get('app.pms.site.id'));
  const siteName = _.get(req.body, 'name', config.get('app.pms.site.name'));
  const currency = _.get(req.body, 'currency', config.get('app.pms.site.currency'));

  config.set('app.pms.site.id', siteId);
  config.set('app.pms.site.name', siteName);
  config.set('app.pms.site.currency', currency);

  const site = {
    id: config.get('app.pms.site.id'),
    name: config.get('app.pms.site.name'),
    currency: config.get('app.pms.site.currency'),
  };

  Promise.resolve()
    .then(() => createResponse(res, site))
    .catch(error => next(error));
});

module.exports = router;
