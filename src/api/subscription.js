const logger = require('../util/logger').AppLogger;
const express = require('express');
const _ = require('lodash');
const joi = require('joi');
const URL = require('url-parse');
const router = express.Router();

const config = require('../util/config');
const error = require('../util/error');
const validator = require('../util/validator');
const { OK, CREATED } = require('../util/constant');

const DEFAULT_PCN_NAME = 'pcn';
const DEFAULT_PCN_HOST = 'https://127.0.0.1:60080';
const DEFAULT_PCN_PREFIX = '/api/v2/events/pms';

function createResponse(res, code, body) {
  logger.debug(body);
  return res.status(code).set('Cache-Control', 'no-cache').json({
    status: 'success',
    data: body || {},
  });
}

function getSubscriptionId() {
  let subscriptionId = config.get('app.pms.subscriptionId');
  config.set('app.pms.subscriptionId', subscriptionId+1);

  return subscriptionId;
}

function createSubscription(data, client, remoteAddress) {
  // Create new event subscription
  const now = new Date();
  const subscription = {};

  const callbackUri = data.callbackUri || '';
  const url = new URL(callbackUri);

  if (!url) {
    return Promise.reject(new error.BadRequestError());
  }

  subscription.name = data.name || DEFAULT_PCN_NAME;

  if (!url.origin || url.origin === 'null') {
    subscription.host = DEFAULT_PCN_HOST;
  } else {
    let str = url.origin;
    subscription.host = str.substring(0, str.indexOf('//')+2) + remoteAddress + str.substring(str.lastIndexOf(':'));
    logger.debug(subscription.host);
  }

  if (!url.pathname || url.pathname === '') {
    subscription.prefix = DEFAULT_PCN_PREFIX;
  } else {
    subscription.prefix = url.pathname;
  }

  const subscriptionId = getSubscriptionId();
  subscription.id = subscriptionId;
  subscription.status = 'up';
  subscription.created = now.toISOString();
  subscription.updated = now.toISOString();

  config.set(`app.pcn.${subscriptionId}`, subscription);
  config.set(`app.pcn.${subscriptionId}.client_id`, client.client_id || 'PMS_ID');
  config.set(`app.pcn.${subscriptionId}.client_secret`, client.client_secret || 'PMS_SECRET');
  return Promise.resolve(subscription);
}

function readSubscription(subscriptionId) {
  // Retrieve event subscription
  const subscription = config.get(`app.pcn.${subscriptionId}`);

  return Promise.resolve(subscription);
}

function updateSubscription(subscriptionId, data, client, remoteAddress) {
  // Update a event subscription
  const now = new Date();
  const subscription = config.get(`app.pcn.${subscriptionId}`) || {};

  const callbackUri = data.callbackUri || '';
  const url = new URL(callbackUri);

  if (!url) {
    return Promise.reject(new error.BadRequestError());
  }

  subscription.name = data.name || DEFAULT_PCN_NAME;

  if (!url.origin || url.origin === 'null') {
    subscription.host = DEFAULT_PCN_HOST;
  } else {
    let str = url.origin;
    subscription.host = str.substring(0, str.indexOf('//')+2) + remoteAddress + str.substring(str.lastIndexOf(':'));
    logger.debug(subscription.host);
  }

  if (!url.pathname || url.pathname === '') {
    subscription.prefix = DEFAULT_PCN_PREFIX;
  } else {
    subscription.prefix = url.pathname;
  }

  subscription.id = parseInt(subscriptionId);
  subscription.status = 'up';
  subscription.created = now.toISOString();
  subscription.updated = now.toISOString();

  config.set(`app.pcn.${subscriptionId}`, subscription);
  config.set(`app.pcn.${subscriptionId}.client_id`, client.client_id);
  config.set(`app.pcn.${subscriptionId}.client_secret`, client.client_secret);
  return Promise.resolve(subscription);
}

function deleteSubscription(subscriptionId) {
  // Delete a event subscription
  config.delete(`app.pcn.${subscriptionId}`);

  return Promise.resolve(subscriptionId);
}

function validateRequestParams(req) {
  logger.debug(req.params);
  const schema = joi.object().keys({
    subscriptionid: joi.number().required(),
  });
  return validator.validateRequestParams(req, schema);
}

function validateRequestBody(req) {
  logger.debug(req.body);
  const schema = joi.object()
    .keys({
      callbackUri: joi.string().uri({ allowRelative: true }).required(),
    })
    .unknown()
    .required();
  return validator.validateRequestBody(req, schema);
}

router.post('/', (req, res, next) => {
  const data = req.body;
  const client =  {
    client_id: req.headers.client_id,
    client_secret: req.headers.client_secret
  };
  let remoteAddress = req.headers["X-Forwarded-For"] || req.connection.remoteAddress;
  if (remoteAddress.substr(0, 7) === '::ffff:') {
    remoteAddress = remoteAddress.substr(7);
  }

  Promise.resolve()
    .then(() => validateRequestBody(req))
    .then(() => createSubscription(data, client, remoteAddress))
    .then(result => createResponse(res, CREATED, result))
    .catch(error => next(error));
});

router.get('/:subscriptionid', (req, res, next) => {
  const { subscriptionid: id } = req.params;

  Promise.resolve()
    .then(() => validateRequestParams(req))
    .then(() => readSubscription(id))
    .then(result => createResponse(res, OK, result))
    .catch(error => next(error));
});

router.put('/:subscriptionid', (req, res, next) => {
  let remoteAddress = req.headers["X-Forwarded-For"] || req.connection.remoteAddress;
  if (remoteAddress.substr(0, 7) === '::ffff:') {
    remoteAddress = remoteAddress.substr(7);
  }
  const client =  {
    client_id: req.headers.client_id,
    client_secret: req.headers.client_secret
  };

  Promise.resolve()
    .then(() => {
      let ps = [validateRequestParams(req), validateRequestBody(req)];
      return Promise.all(ps);
    })
    .then(result => updateSubscription(result[0].subscriptionid, result[1], client, remoteAddress))
    .then(result => createResponse(res, OK, result))
    .catch(error => next(error));
});

router.delete('/:subscriptionid', (req, res, next) => {
  Promise.resolve()
    .then(() => validateRequestParams(req))
    .then(result => deleteSubscription(result.subscriptionid))
    .then(result => createResponse(res, OK, result))
    .catch(err => next(err));
});

module.exports = router;
