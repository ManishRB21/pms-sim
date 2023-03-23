const logger = require('../util/logger').AppLogger;
const express = require('express');
const joi = require('joi');
const _ = require('lodash');
const router = express.Router({ mergeParams: true });

const request = require('../util/request');
const config = require('../util/config');
const validator = require('../util/validator');

const pmsHost = config.get('cli.pms.host');

function createPostResponse(res) {
  return res.json({
    status: 'success',
  });
}

function sendCheckinEvent(roomId, isSwap) {
  const now = new Date();

  const options = {
    uri: `${pmsHost}/commands/events`,
    method: 'post',
    body: {
      type: 'checkin',
      room: roomId,
      checkin: {
        room: roomId,
        guest: null, // FIAS: guest object, HIS: null
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

function requestRoomCheckin(roomId, guest) {
  config.set(`app.room.${roomId}`, guest);

  return Promise.resolve(true);
}

const parseGuestName = guestName => {
  const name = {
    full: guestName,
    prefix: null,
    first: null,
    last: null,
  };
  const slicedName = guestName.split(' ') || [];

  if (slicedName.length === 1) {
    name.last = slicedName[0];
  } else if (slicedName.length === 2) {
    name.first = slicedName[0];
    name.last = slicedName[1];
  } else if (slicedName.length === 3) {
    name.prefix = slicedName[0];
    name.first = slicedName[1];
    name.last = slicedName[2];
  }

  return name;
};

const generateGuest = (roomId, guestName, language, email, checkout, phone) => {
  const guestId = `${roomId}-1`;
  const name = parseGuestName(guestName);

  return {
    name: {
      prefix: name.prefix,
      first: name.first,
      middle: null,
      last: name.last,
      suffix: null,
      full: name.full,
    },
    balance: null,
    language: language || null,
    'e-mail': email || null,    // not email
    no_post: null,
    vip_status: null,
    id: guestId,
    phone: phone,
    checkout: _.toString(checkout) || null,
    option: null,
    channel_preference: null,
    folio: {},
  };
};

router.post('/', (req, res, next) => {
  logger.debug(req.params);
  logger.debug(req.body);

  try {
    const paramSchema = joi.object().keys({
      roomid: joi.any().required(),
    });
    const bodySchema = joi.object().keys({
      name: joi.any().required(),
      isSwap: joi.boolean().truthy('true').falsy('false').optional(),
      language: joi.string().length(2).optional(),
      email: joi.string().email().optional(),
      checkout: joi.string().optional(),
      phone: joi.string().optional(),
    });

    validator.validateRequestParams(req, paramSchema);
    validator.validateRequestBody(req, bodySchema);
  } catch (err) {
    return next(err);
  }

  const roomId =  _.get(req.params, 'roomid');
  const guestName = _.get(req.body, 'name');
  const language = _.get(req.body, 'language');
  const email = _.get(req.body, 'email');
  const checkout = _.get(req.body, 'checkout');
  const phone = _.get(req.body, 'phone');
  const isSwap = _.get(req.body, 'isSwap', false);
  const guest = generateGuest(roomId, guestName, language, email, checkout, phone);

  config.set(`app.room.${roomId}`, guest);
  sendCheckinEvent(roomId, isSwap)
    .then(() => createPostResponse(res))
    .catch(error => next(error));
});

module.exports = router;
