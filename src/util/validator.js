const _ = require('lodash');
const joi = require('joi');
const error = require('./error');

function validateRequest(req, schema, extractFn) {
  let result = joi.validate(extractFn(req), schema);
  if (!result || result.error !== null) {
    throw new error.BadRequestError();
  } else {
    return result.value;
  }
}

function validateRequestMergedParams(req, schema) {
  return validateRequest(req, schema, _.property(['body', 'params']));
}

function validateRequestParams(req, schema) {
  return validateRequest(req, schema, _.property('params'));
}

function validateRequestBody(req, schema) {
  return validateRequest(req, schema, _.property('body'));
}

function isValid(args, schema, logger) {
  const result = joi.validate(args, schema);
  const message = _.get(result, 'error.details[0].message', null);
  if (message && logger) {
    logger.log(`Invalid: ${message}`);
  }
  return result && result.error === null;
}

module.exports = {
  validateRequestMergedParams,
  validateRequestParams,
  validateRequestBody,
  isValid,
};
