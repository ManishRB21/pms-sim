const _ = require('lodash');
const joi = require('joi');
const logger = require('../util/logger').CLILogger;
const config = require('../util/config');
const validator = require('../util/validator');

const schema = joi
  .object()
  .keys({
    id: joi
      .string()
      .optional(),
    name: joi
      .string()
      .optional(),
    currency: joi
      .string()
      .optional(),
  })
  .unknown();

module.exports = (args, callback) => {
  if (validator.isValid(args, schema, logger) && args.id && args.name && args.currency) {
    const siteId = _.get(args, 'id', config.get('app.pms.site.id'));
    config.set('app.pms.site.id', siteId);
    const siteName = _.get(args, 'name', config.get('app.pms.site.name'));
    config.set('app.pms.site.name', siteName);
    const currency = _.get(args, 'currency', config.get('app.pms.site.currency'));
    config.set('app.pms.site.currency', currency);

    logger.log('To apply configuration, you should restart simulator.\n');
  }

  const site = {
    id: config.get('app.pms.site.id'),
    name: config.get('app.pms.site.name'),
    currency: config.get('app.pms.site.currency'),
  };

  logger.log('Site ID:', site.id);
  logger.log('Site Name:', site.name);
  logger.log('Currency:', site.currency);

  if (callback && typeof callback === 'function') {
    callback(null);
  }

  return site;
};
