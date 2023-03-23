const _ = require('lodash');
const joi = require('joi');
const Chance = require('chance');
const jsonFormmater = require('format-json');
const logger = require('../util/logger').CLILogger;
const request = require('../util/request');
const config = require('../util/config');
const validator = require('../util/validator');

const chance = new Chance();
const pmsHost = config.get('cli.pms.host');

const schema = joi
  .object()
  .keys({
    status: joi
      .string()
      .valid('up', 'down')
      .optional(),
  })
  .unknown();

module.exports = (args, callback) => {
  let status = _.get(args, 'status', null);

  if (status === null) {
    status = config.get('app.pms.status');
    logger.log('PMS Status:', status);
    if (callback && typeof callback === 'function') {
      callback(null);
    }
    return false;
  }

  if (!validator.isValid(args, schema, logger)) {
    if (callback && typeof callback === 'function') {
      callback(null);
    }
    return false;
  }

  config.set('app.pms.status', status);

  const options = {
    uri: `${pmsHost}/commands/events`,
    method: 'post',
    body: {
      type: 'status',
      status: {
        id: chance.integer({ min: 0, max: 32767 }),
        status: status,
      },
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
