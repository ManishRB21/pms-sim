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
    fromRoomId: joi.any().required(),
    toRoomId: joi.any().required(),
  })
  .unknown();

module.exports = (args, callback) => {
  const fromRoomId = _.get(args, 'fromRoomId', '');
  const toRoomId = _.get(args, 'toRoomId', '');
  const fromRoomInfo = config.get(`app.room.${fromRoomId}`);
  const toRoomInfo = config.get(`app.room.${toRoomId}`);
  const now = new Date();

  if (!validator.isValid(args, schema, logger) || !fromRoomInfo || toRoomInfo) {
    if (!fromRoomInfo) {
      logger.log(`Cannot change room :: Room ${fromRoomId} is empty.`);
    }
    if (toRoomInfo) {
      logger.log(`Cannot change room :: Room ${toRoomId} already checked in.`)
    }
    if (callback && typeof callback === 'function') {
      callback(null);
    }
    return false;
  }

  const guestId = fromRoomInfo.id;
  config.set(`app.room.${toRoomId}`, fromRoomInfo);
  config.delete(`app.room.${fromRoomId}`);

  const options = {
    uri: `${pmsHost}/commands/events`,
    method: 'post',
    body: {
      type: 'move',
      move: {
        guest: guestId,
        room: {
          from: fromRoomId,
          to: toRoomId,
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
