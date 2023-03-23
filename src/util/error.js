const _ = require('lodash');
const util = require('util');

const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  ROOM_UNOCCUPIED,
  INVALID_FOLIO_ID,
  PAYMENT_REJECTED,
  GUEST_NOT_CHECKED_IN,
  FOLIO_TOTAL_NOT_ZERO,
  INVALID_ACCOUNT_NUMBER,
  NO_RESERVATION_FOUND,
} = require('./constant');

// 4xx Client error
function ClientError(statusCode, message) {
  if (Error.captureStackTrace) {
    // required for non-V8 environments
    Error.captureStackTrace(this);
  }
  this.statusCode = statusCode;
  this.message = message;
}

util.inherits(ClientError, Error);

// 400 Bad request error
function BadRequestError(statusCode = BAD_REQUEST, message = 'Bad Request') {
  ClientError.call(this, statusCode, message);
}

util.inherits(BadRequestError, ClientError);

// 404 Not found error
function NotFoundError(statusCode = NOT_FOUND, message = 'Not Found') {
  ClientError.call(this, statusCode, message);
}

util.inherits(NotFoundError, ClientError);

// 400 room is unoccupied
function RoomUnoccupiedError(statusCode = ROOM_UNOCCUPIED,
  message = 'room is unoccupied') {
  ClientError.call(this, statusCode, message);
}

util.inherits(RoomUnoccupiedError, ClientError);

// 400 Invalid Folio ID
function InvalidFolioIdError(statusCode = INVALID_FOLIO_ID,
  message = 'Invalid Folio ID') {
  ClientError.call(this, statusCode, message);
}

util.inherits(InvalidFolioIdError, ClientError);

// 400 Payment Rejected, check balance
function PaymentRejectedError(statusCode = PAYMENT_REJECTED,
  message = 'Payment Rejected, check balance') {
  ClientError.call(this, statusCode, message);
}

util.inherits(PaymentRejectedError, ClientError);

// 400 Guest not checked in
function GuestNotCheckedInError(statusCode = GUEST_NOT_CHECKED_IN,
  message = 'Guest not checked in') {
  ClientError.call(this, statusCode, message);
}

util.inherits(GuestNotCheckedInError, ClientError);

// 400 Folio Total are Not Zero
function FolioTotalIsNotZeroError(statusCode = FOLIO_TOTAL_NOT_ZERO,
  message = 'Folio Total are Not Zero') {
  ClientError.call(this, statusCode, message);
}

util.inherits(FolioTotalIsNotZeroError, ClientError);

// 400 invalid account number for room
function InvalidAccountNumberError(statusCode = INVALID_ACCOUNT_NUMBER,
  message = 'invalid account number for room') {
  ClientError.call(this, statusCode, message);
}

util.inherits(InvalidAccountNumberError, ClientError);

// 400 No reservation found for room
function NoReservationFoundError(statusCode = NO_RESERVATION_FOUND,
  message = 'No reservation found for room') {
  ClientError.call(this, statusCode, message);
}

util.inherits(NoReservationFoundError, ClientError);


const errorObj = {
  [BAD_REQUEST]: BadRequestError,
  [NOT_FOUND]: NotFoundError,
};

function createClientError(statusCode, message) {
  let CustomClientError = _.get(errorObj, statusCode, ClientError);
  return new CustomClientError(statusCode, message);
}

// Server error
function ServerError(statusCode, message) {
  if (Error.captureStackTrace) {
    // required for non-V8 environments
    Error.captureStackTrace(this);
  }
  this.statusCode = statusCode;
  this.message = message;
}

util.inherits(ServerError, Error);

function createServerError(statusCode = INTERNAL_SERVER_ERROR,
  message = 'Internal Server Error') {
  return new ServerError(statusCode, message);
}

module.exports = {
  ClientError,
  ServerError,
  createClientError,
  createServerError,
  BadRequestError,
  NotFoundError,
  RoomUnoccupiedError,
  InvalidFolioIdError,
  PaymentRejectedError,
  GuestNotCheckedInError,
  FolioTotalIsNotZeroError,
  InvalidAccountNumberError,
  NoReservationFoundError,
};
