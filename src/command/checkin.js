const _ = require('lodash');
const joi = require('joi');
const jsonFormmater = require('format-json');
const logger = require('../util/logger').CLILogger;
const request = require('../util/request');
const config = require('../util/config');
const validator = require('../util/validator');

const pmsHost = config.get('cli.pms.host');

const schema = joi
  .object()
  .keys({
    roomId: joi.any().required(),
    isSwap: joi
      .boolean()
      .truthy('true')
      .falsy('false')
      .optional(),
    lang_nationality: joi.string().regex(/^[a-z]{2}_[a-zA-Z]{2}$/).optional(),
    email: joi.string().email().optional(),
    checkout: joi.string().optional(),
    phone: joi.string().optional(),
  })
  .unknown();

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

const generateGuest = (roomId, guestName, code, email, checkout, phone) => {
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
    language: code || null,
    'e-mail': email || null,    //not email
    phone: phone || null,
    no_post: null,
    vip_status: null,
    id: guestId,
    checkout: _.toString(checkout) || null,
    option: null,
    channel_preference: null,
    folio: {},
  };
};

module.exports = (args, callback) => {
  const now = new Date();
  const roomId = _.get(args, 'roomId', '');
  const guestName = _.get(args, 'name', '');
  const code = _.get(args, 'lang_nationality', '');
  const email = _.get(args, 'email', '');
  const checkout = _.get(args, 'checkout_date', '');
  const phone = _.get(args, 'phone', '');
  const isSwap = _.get(args, 'isSwap', false);
  const guest = generateGuest(roomId, guestName, code, email, checkout, phone);

  if (!validator.isValid(args, schema, logger)) {
    if (callback && typeof callback === 'function') {
      callback(null);
    }
    return false;
  }

  config.set(`app.room.${roomId}`, guest);

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
    .then(res => {
      logger.log(jsonFormmater.plain(res.body));

      if (callback && typeof callback === 'function') {
        callback(null);
      }
      return res;
    })
    .catch(err => callback(err.error));
};
