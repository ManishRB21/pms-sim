const { expect } = require('chai');
const SuperTest = require('supertest');
const config = require('../util/config');

const app = require('../app');
const request = SuperTest.agent(app);

describe('api::statuses', () => {
  describe('test statuses api', () => {
    before(() => {
      config.set('app.pms.status', 'on');
    });

    it('get statuses will return "on"', () => {
      return request.get('/api/pms/v2/statuses')
        .expect(200)
        .then(res => {
          expect(res.body.status).to.equal('success');
          expect(res.body.data.status).to.equal('up');
          return Promise.resolve();
        });
    });

    it('change status and get statuses will return "down"', () => {
      config.set('app.pms.status', 'off');

      return request.get('/api/pms/v2/statuses')
        .expect(200)
        .then(res => {
          expect(res.body.status).to.equal('success');
          expect(res.body.data.status).to.equal('down');
          return Promise.resolve();
        });
    });

    after(() => {
      config.delete('app.pms.status');
    });
  });
});
