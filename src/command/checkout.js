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
  })
  .unknown();

module.exports = (args, callback) => {
  const now = new Date();
  const room = _.get(args, 'roomId', '');
  const isSwap = _.get(args, 'isSwap', false);

  if (!validator.isValid(args, schema, logger)) {
    if (callback && typeof callback === 'function') {
      callback(null);
    }
    return false;
  }

  config.delete(`app.room.${room}`);

  const options = {
    uri: `${pmsHost}/commands/events`,
    method: 'post',
    body: {
      type: 'checkout',
      room: room,
      swap: isSwap,
      checkout: {
        room: room,
        guest: null, // FIAS: guest_id, HIS: null
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
