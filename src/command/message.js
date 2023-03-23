const _ = require('lodash');
const joi = require('joi');
const uniqid = require('uniqid');
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
    text: joi.any().required(),
  })
  .unknown();

module.exports = (args, callback) => {
  const now = new Date();
  const room = _.get(args, 'roomId', '');
  const text = _.get(args, 'text', '');

  if (!validator.isValid(args, schema, logger)) {
    if (callback && typeof callback === 'function') {
      callback(null);
    }
    return false;
  }

  const options = {
    uri: `${pmsHost}/commands/events`,
    method: 'post',
    body: {
      id: uniqid(),
      type: 'popup',
      room: room,
      popup: {
        room: room,
        message: text,
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
