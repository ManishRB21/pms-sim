const express = require('express');
const Chance = require('chance');
const joi = require('joi');
const logger = require('../util/logger').AppLogger;
const validator = require('../util/validator');
const config = require('../util/config');
const router = express.Router();

const chance = new Chance();

function createGetResponse(res, result) {
  return res.json({
    status: 'success',
    data: result || false,
  });
}

function createPostResponse(res) {
  return res.json({
    status: 'success'
  });
}

function getStatuses() {
  // Get PMS server status. Status would be 'up' or 'down'.
  const now = new Date();

  const data = {
    id: chance.integer({ min: 1, max: 1000000 }), // event id
    status: config.get('app.pms.status'),
    created: now.toISOString(),
  };

  return Promise.resolve(data);
}

router.get('/', (req, res, next) => {
  return getStatuses()
    .then(result => createGetResponse(res, result))
    .catch(error => next(error));
});

router.post('/', (req, res, next) => {
  logger.debug(req.body);

  try {
    const schema = joi.object().keys({
      status: joi.string().valid('up', 'down').required(),
      subscriptionId: joi.any().required(),
    });

    validator.validateRequestBody(req, schema);
  } catch (err) {
    return next(err);
  }

  config.set(`app.pcn.${req.body.subscriptionId}.status`, req.body.status);

  Promise.resolve()
    .then(() => createPostResponse(res))
    .catch(error => next(error));
});

module.exports = router;
