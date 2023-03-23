const logger = require('../util/logger').AppLogger;
const express = require('express');
const joi = require('joi');
const _ = require('lodash');
const router = express.Router({ mergeParams: true });

const request = require('../util/request');
const config = require('../util/config');
const validator = require('../util/validator');
const error = require('../util/error');

const pmsHost = config.get('cli.pms.host');

function createPostResponse(res) {
  return res.json({
    status: 'success',
  });
}

function sendCheckoutEvent(roomId, isSwap = false) {
  const now = new Date();

  const options = {
    uri: `${pmsHost}/commands/events`,
    method: 'post',
    body: {
      type: 'checkout',
      room: roomId,
      swap: isSwap,
      checkout: {
        room: roomId,
        guest: null, // FIAS: guest_id, HIS: null
        source: {
          type: (isSwap) ? 'swap' : 'live',
        },
      },
      created: now.toISOString(),
    },
  };

  return request(options)
    .catch(err => logger.log(err.error));
}

function requestRoomCheckout(roomId) {
  // Checkout all guests in a room.
  const room = config.get(`app.room.${roomId}`);

  if (!room) {
    return Promise.reject(new error.GuestNotCheckedInError());
  }

  config.delete(`app.room.${roomId}`);

  return Promise.resolve(true);
}

function requestGuestCheckout(roomId, guestId, balance) {
  // In case of there's multiple guests in a room.
  const room = config.get(`app.room.${roomId}`);

  if (!balance || !_.parseInt(balance)) {
    balance = 0;
  }

  if (!room) {
    throw new error.GuestNotCheckedInError();
  }

  const folio = _.get(room, 'folio');

  if (!folio) {
    throw new error.InvalidFolioIdError();
  }

  if(!_.isEmpty(folio)) {
    if (guestId !== _.get(folio, 'id')) {
      throw new error.InvalidAccountNumberError();
    }

    if (balance === 0 && _.get(folio, 'balance', -1) !== 0) {
      throw new error.FolioTotalIsNotZeroError();
    }

    if (balance !== _.get(folio, 'balance')) {
      throw new error.PaymentRejectedError();
    }
  }

  config.delete(`app.room.${roomId}`);

  return Promise.resolve(true);
}

router.post('/', (req, res, next) => {
  logger.debug(req.params);
  const { roomid } = req.params;
  const isSwap = _.get(req.body, 'isSwap', false);

  try {
    const schema = joi.object().keys({
      roomid: joi.any().required(),
    });

    validator.validateRequestParams(req, schema);
  } catch (err) {
    return next(err);
  }

  requestRoomCheckout(roomid)
    .then(() => sendCheckoutEvent(roomid, isSwap))
    .then(() => createPostResponse(res))
    .catch(error => next(error));
});

router.post('/:guestid', (req, res, next) => {
  logger.debug(req.params);
  const { roomid, guestid } = req.params;
  const { balance } = req.body;

  try {
    const schema = joi.object().keys({
      roomid: joi.any().required(),
      guestid: joi.any().required(),
      balance: joi.number().precision(2).required(),
    });

    validator.validateRequestMergedParams(req, schema);
  } catch (err) {
    return next(err);
  }

  requestGuestCheckout(roomid, guestid, balance)
    .then(() => sendCheckoutEvent(roomid))
    .then(() => createPostResponse(res))
    .catch(error => next(error));
});

module.exports = router;
