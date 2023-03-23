const logger = require('../util/logger').AppLogger;
const express = require('express');
const joi = require('joi');
const _ = require('lodash');
const router = express.Router({ mergeParams: true });

const config = require('../util/config');
const error = require('../util/error');
const validator = require('../util/validator');
const { NO_CONTENT } = require('../util/constant');

function createResponse(res, code, result) {
  return res.json({
    status: 'success',
    data: result || {},
  });
}

function createFolioItem(roomId, guestId, item) {
  const room = _.get(config.get('app.room'), roomId);
  const folio = _.get(room, 'folio');
  const items = _.get(folio, 'items', []);
  const now = new Date();
  if (!room) {
    return Promise.reject(new error.GuestNotCheckedInError());
  }

  if (guestId !== room.id) {
    return Promise.reject(new error.InvalidAccountNumberError());
  }

  item.id = items.length + 1;
  item.created = now.toISOString();
  items.push(item);

  const balance = items.reduce((total, item) => total + item.amount, 0);

  folio.id = guestId;
  folio.status = 'open';
  folio.items = items;
  folio.balance = room.balance = balance;

  room.folio = folio;
  config.set(`app.room.${roomId}`, room);

  return Promise.resolve(true);
}

function validateRequestParams(req) {
  logger.debug(req.params);
  const schema = joi.object().keys({
    roomid: joi.string().alphanum().required(),
    guestid: joi.any().required(),
  });
  return validator.validateRequestParams(req, schema);
}

function validateRequestBody(req) {
  logger.debug(req.body);
  /**
   item object
   **
   {
     amount: 19, // total charge
     description: 'Movies', // Item desc.
     purchase_id: 'MOVIE', // Item code
     revenue_code: '1', // rev code
     subtotal: { '1': 18 }, // price of item
     tax: { '1': 1 } // tax of item
   }
   */
  const schema = joi.object()
    .keys({
      amount: joi.number().precision(2).required(),
      description: joi.string().required(),
      purchase_id: joi.string().optional(),
      revenue_code: joi.string().optional(),
      subtotal: joi.any().optional(),
      tax: joi.any().optional(),
    })
    .unknown()
    .required();
  return validator.validateRequestBody(req, schema);
}

router.post('/', (req, res, next) => {
  logger.debug(req.params);
  logger.debug(req.body);
  const { roomid, guestid } = req.params;
  const item = req.body;

  Promise.resolve()
    .then(() => {
      let ps = [validateRequestParams(req), validateRequestBody(req)];
      return Promise.all(ps);
    })
    .then(() => createFolioItem(roomid, guestid, item))
    .then(result => createResponse(res, NO_CONTENT, result))
    .catch(error => next(error));
});

module.exports = router;
