const logger = require('../util/logger').AppLogger;
const express = require('express');
const _ = require('lodash');
const router = express.Router({ mergeParams: true });

const config = require('../util/config');
const error = require('../util/error');

function createGetResponse(res, result) {
  return res.json({
    status: 'success',
    data: result || {},
  });
}

function getFolio(roomId, guestId) {
  // Retrieve folio information of the guest
  const room = _.get(config.get('app.room'), roomId);
  const folio = _.get(room, 'folio');

  if (!room) {
    return Promise.reject(new error.GuestNotCheckedInError());
  }

  if (guestId !== room.id) {
    return Promise.reject(new error.InvalidAccountNumberError());
  }

  return Promise.resolve(folio);
}

router.get('/:guestid', (req, res, next) => {
  logger.debug(req.params);
  const { roomid, guestid } = req.params;
  getFolio(roomid, guestid)
    .then(result => createGetResponse(res, result))
    .catch(error => next(error));
});

router.use('/:guestid/folio-items', require('./folio-item'));

module.exports = router;
