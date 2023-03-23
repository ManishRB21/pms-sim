const expect = require('chai').expect;
const nock = require('nock');
const request = require('./request');

const mockUri = 'http://mockservice.com';

describe('util::request', () => {
  describe('call request function', () => {
    it('should return "success message" when call request with string param', () => {
      nock(mockUri)
        .get('/')
        .reply(200, 'success message');

      return request(mockUri).then(res =>
        expect(res.body).to.equal('success message'),
      );
    });

    it('should return "success message" when call request with option param', () => {
      nock(mockUri)
        .get('/')
        .reply(200, 'success message');

      return request({
        method: 'get',
        uri: mockUri,
      }).then(res => expect(res.body).to.equal('success message'));
    });

    it('should return "res object" when response body is JSON type', () => {
      let body = {
        status: 'success',
      };
      nock(mockUri)
        .get('/')
        .reply(200, JSON.stringify(body));

      return request({
        method: 'get',
        uri: mockUri,
      }).then(res => expect(res.body).to.deep.equal(body));
    });

    it('should return error object when throw error', () => {
      let message = `connect ECONNREFUSED ${mockUri}`;
      let error = {
        status: 'error',
        error: {
          statusCode: 500,
          message: `Error: ${message}`,
        },
      };

      nock(mockUri)
        .get('/')
        .replyWithError(new Error(message));

      return request({
        method: 'get',
        uri: mockUri,
      }).catch(err => {
        expect(err.statusCode).to.equal(error.error.statusCode);
        expect(err.error).to.deep.equal(error);
      });
    });
  });
});
