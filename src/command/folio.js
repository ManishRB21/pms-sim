const _ = require('lodash');
const joi = require('joi');
const logger = require('../util/logger').CLILogger;
const config = require('../util/config');
const validator = require('../util/validator');

const schema = joi
  .object()
  .keys({
    roomId: joi.any().required(),
    account: joi.string().required(),
    amount: joi.number().precision(2).required(),
    desc: joi.string().required(),
  })
  .unknown();

function addFolioItem(roomId, guestId, item) {
  const room = _.get(config.get('app.room'), roomId);
  const folio = _.get(room, 'folio');
  const items = _.get(folio, 'items', []);

  if (!room) {
    logger.log('Error: unknown room number');
    return Promise.resolve(false);
  }

  if (guestId !== room.id) {
    logger.log('Error: unknown account number');
    return Promise.resolve(false);
  }

  item.id = items.length + 1;

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

module.exports = (args, callback) => {
  const now = new Date();
  const roomId = _.get(args, 'roomId', '');
  const account = _.get(args, 'account', '');
  const amount = _.get(args, 'amount', 0);
  const desc = _.get(args, 'desc', '');

  if (!validator.isValid(args, schema, logger)) {
    if (callback && typeof callback === 'function') {
      callback(null);
    }
    return false;
  }

  const item = {
    amount,
    description: desc,
    created: now.toISOString(),
    display: true,
  };

  return addFolioItem(roomId, account, item)
    .then(res => {
      if (callback && typeof callback === 'function') {
        callback(null);
      }
      return res;
    })
    .catch(err => callback(err.error));
};
