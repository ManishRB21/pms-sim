const _ = require('lodash');
const joi = require('joi');
const logger = require('../util/logger').CLILogger;
const config = require('../util/config');
const validator = require('../util/validator');

const schema = joi
  .object()
  .keys({
    roomId: joi.any().optional(),
  })
  .unknown();

function getRooms() {
  const rooms = config.get('app.room');
  const roomIds = _.keys(rooms) || [];

  logger.log(roomIds.join(', '));

  return Promise.resolve(roomIds);
}

function getRoomInfo(roomId) {
  const room = _.get(config.get('app.room'), roomId);
  const folioItems = _.get(room, 'folio.items', []);

  if (!room) {
    logger.log('Room not found');
    return Promise.resolve(false);
  }

  logger.log(`account: ${room.id}, name: ${_.get(room, 'name.full', '')}`);
  _.forEach(folioItems, item => {
    logger.log(` - item: ${item.description}, amount: ${item.amount}`);
  });

  return Promise.resolve(room);
}

module.exports = (args, callback) => {
  const roomId = _.get(args, 'roomId', '');

  if (!validator.isValid(args, schema, logger)) {
    if (callback && typeof callback === 'function') {
      callback(null);
    }
    return false;
  }

  return Promise.resolve()
    .then(() => {
      if (roomId) {
        return getRoomInfo(roomId);
      } else {
        return getRooms();
      }
    })
    .then(res => {
      if (callback && typeof callback === 'function') {
        callback(null);
      }
      return res;
    })
    .catch(err => callback(err.error));
};
