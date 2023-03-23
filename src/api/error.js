/* eslint-disable */
const _ = require('lodash');
const { ClientError } = require('../util/error');

const logger = require('../util/logger').AppLogger;
const { INTERNAL_SERVER_ERROR } = require('../util/constant');

export const clientErrorHandler = (err, req, res, next) => {
  if (err instanceof ClientError) {
    let statusCode = err.statusCode;
    let message = err.message;

    logger.log('ClientError: %s - %s', statusCode, message);

    res.status(statusCode).json({
      status: 'error',
      error: {
        statusCode,
        message,
      },
    });
  } else {
    // if err is not client error then pass it to server error handler
    next(err);
  }
};

export const serverErrorHandler = (err, req, res, next) => {
  let statusCode = _.get(err, 'statusCode', INTERNAL_SERVER_ERROR);
  let message = _.get(err, 'message', 'Internal Server Error');

  logger.error('ServerError: %s - %s', statusCode, message);

  res.status(statusCode).json({
    status: 'error',
    error: {
      statusCode,
      message,
    },
  });
};

export const notFoundErrorHandler = (req, res) => {
  res.status(404).json({
    status: 'error',
    error: {
      statusCode: 404,
      message: 'Not Found',
    },
  });
};
