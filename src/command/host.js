const _ = require('lodash');
const logger = require('../util/logger').CLILogger;
const config = require('../util/config');

module.exports = (args, callback) => {
  const pcn = [];
  const subscriptions = config.get('app.pcn');
  const fromHost = _.get(args, 'fromHost', '');
  const toHost = _.get(args, 'toHost', '');

  _.forEach(subscriptions, (subscription, subscriptionId) => {
    if(fromHost !== '' && toHost !== '') {
      if(subscription.host === fromHost) {
        config.set(`app.pcn.${subscriptionId}.host`, toHost);
        subscription.host = toHost;
      }
    }
    pcn.push(`${subscription.host}${subscription.prefix}`);
  });
  const pms = config.get('cli.pms.host');
  const host = {
    pcn,
    pms,
  };

  logger.log('PCN URI:', host.pcn);
  logger.log('PMS URI:', host.pms);

  if (callback && typeof callback === 'function') {
    callback(null);
  }

  return host;
};
