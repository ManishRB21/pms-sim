const logger = require('../util/logger').AppLogger;
const express = require('express');
const joi = require('joi');
const _ = require('lodash');
const uniqid = require('uniqid');
const router = express.Router({ mergeParams: true });

const request = require('../util/request');
const config = require('../util/config');
const validator = require('../util/validator');

const pmsHost = config.get('cli.pms.host');

function createPostResponse(res, result) {
  result.body.status = 'success';
  return res.json(result.body);
}

function sendMessageEvent(roomId, text) {
  const now = new Date();

  const options = {
    uri: `${pmsHost}/commands/events`,
    method: 'post',
    body: {
      id: uniqid(),
      type: 'popup',
      room: roomId,
      popup: {
        room: roomId,
        message: text,
      },
      created: now.toISOString(),
    },
  };

  return request(options)
    .catch(err => logger.log(err.error));
}

router.post('/', (req, res, next) => {
  logger.debug(req.params);
  logger.debug(req.body);

  try {
    const paramSchema = joi.object().keys({
      roomid: joi.any().required(),
    });
    const bodySchema = joi.object().keys({
      text: joi.string().required(),
    });

    validator.validateRequestParams(req, paramSchema);
    validator.validateRequestBody(req, bodySchema);
  } catch (err) {
    return next(err);
  }

  const roomId =  _.get(req.params, 'roomid');
  const text = _.get(req.body, 'text');

  sendMessageEvent(roomId, text)
    .then(result => createPostResponse(res, result))
    .catch(error => next(error));
});

router.put('/:messageid', (req, res, next) => {
  const { roomid, messageid } = req.params;
  const { guest } = req.body;
  logger.log(`PUT api/v2/rooms/${roomid}/messages/${messageid}`);
  res.json({status: 'success'});
})

module.exports = router;
