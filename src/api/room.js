const logger = require('../util/logger').AppLogger;
const express = require('express');
const joi = require('joi');
const _ = require('lodash');
const router = express.Router();

const config = require('../util/config');
const validator = require('../util/validator');

function createGetResponse(res, result) {
  return res.json({
    status: 'success',
    data: result || {},
  });
}

router.get('/', (req, res, next) => {

  const rooms = config.get('app.room');
  const roomIds = _.keys(rooms) || [];

  Promise.resolve()
    .then(() => createGetResponse(res, roomIds.join(', ')))
    .catch(error => next(error));
});

router.get('/:roomid', (req, res, next) => {
  logger.debug(req.params);

  try {
    const schema = joi.object().keys({
      roomid: joi.any().required(),
    });

    validator.validateRequestParams(req, schema);
  } catch (err) {
    return next(err);
  }

  const roomId =  _.get(req.params, 'roomid');

  const room = config.get(`app.room.${roomId}`);

  if (room) {
    createGetResponse(res, {
      id: `${roomId}`,
      guests: [_.omit(room, ['folio'])],
      folios: _.get(room, 'folio', {}),
    });
  } else {
    createGetResponse(res, {
      guests: [],
    });
  }
});

router.use('/:roomid/folios', require('./folio'));
router.use('/:roomid/checkouts', require('./checkout'));
router.use('/:roomid/checkin', require('./checkin'));
router.use('/:roomid/messages', require('./message'));

module.exports = router;
