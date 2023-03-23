const { expect } = require('chai');
const SuperTest = require('supertest');

const app = require('../app');
const request = SuperTest.agent(app);

describe('api::check', () => {
  describe('test check api', () => {
    it('get check will return success', () => {
      return request.post('/api/pms/v2/check')
        .expect(200)
        .then(res => {
          expect(res.body.status).to.equal('success');
          return Promise.resolve();
        });
    });
  });
});
