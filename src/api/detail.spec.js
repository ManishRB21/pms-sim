const { expect } = require('chai');
const SuperTest = require('supertest');
const config = require('../util/config');

const app = require('../app');
const request = SuperTest.agent(app);

const siteMock = {
  id: 'TEST_SITE_ID',
  name: 'TEST_SITE_NAME',
};

describe('api::details', () => {
  describe('test details api', () => {
    before(() => {
      config.set('app.pms.site', siteMock);
    });

    it('get details will return site id and name', () => {
      return request.get('/api/pms/v2/details')
        .expect(200)
        .then(res => {
          expect(res.body.status).to.equal('success');
          expect(res.body.data.id).to.equal('TEST_SITE_ID');
          expect(res.body.data.name).to.equal('TEST_SITE_NAME');
          return Promise.resolve();
        });
    });

    after(() => {
      config.delete('app.pms.site');
    });
  });
});
