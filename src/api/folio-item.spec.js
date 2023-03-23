const { expect } = require('chai');
const SuperTest = require('supertest');
const _ = require('lodash');
const config = require('../util/config');

const app = require('../app');
const request = SuperTest.agent(app);

const now = new Date();
const roomsMock = {
  '201': {
    name: {
      full: 'Mrs. Pearl Brooks',
    },
    id: '201-1',
    folio: {
      id: '201-1',
      balance: 10.99,
      status: 'open',
      items: [{
        id: 1,
        amount: 10.99,
        created: now.toISOString(),
        description: 'Movies',
        display: true,
      }],
      guestId: '201-1',
    },
  },
  '202': {
    name: {
      full: 'Mrs. Tom Smith',
    },
    id: '202-1',
    folio: {
      id: '202-1',
      balance: 5.19,
      status: 'open',
      items: [{
        id: 1,
        amount: 5.19,
        created: now.toISOString(),
        description: 'Popcorn',
        display: true,
      }],
      guestId: '202-1',
    },
  },
};

describe('api::folio-items', () => {
  describe('test folio-items api', () => {
    before(() => {
      config.set('app.room', roomsMock);
    });

    it('post folio item to 201 will return success', () => {
      const now = new Date();
      const item = {
        id: 2,
        amount: 3.99,
        created: now.toISOString(),
        description: 'TV Show',
        display: true,
      };

      return request.post('/api/pms/v2/rooms/201/folios/201-1/folio-items')
        .send(item)
        .expect(204)
        .then(() => {
          const folio = _.get(config.get('app.room'), '201.folio');

          expect(folio.balance).to.equal(14.98);
          expect(folio.items).to.include.deep.members([item]);
          return Promise.resolve();
        });
    });

    it('post folio item to 202 will return success', () => {
      const now = new Date();
      const item = {
        id: 2,
        amount: 2,
        created: now.toISOString(),
        description: 'Coke',
        display: true,
      };

      return request.post('/api/pms/v2/rooms/202/folios/202-1/folio-items')
        .send(item)
        .expect(204)
        .then(() => {
          const folio = _.get(config.get('app.room'), '202.folio');

          expect(folio.balance).to.equal(7.19);
          expect(folio.items).to.include.deep.members([item]);
          return Promise.resolve();
        });
    });

    it('post folio item to wrong room will return error', () => {
      const now = new Date();
      const item = {
        id: 1,
        amount: 1.99,
        created: now.toISOString(),
        description: 'Towel',
        display: true,
      };

      return request.post('/api/pms/v2/rooms/100/folios/100-1/folio-items')
        .send(item)
        .expect(400)
        .then(res => {
          expect(res.body.status).to.equal('error');
          expect(res.body.error.message).to.equal('Guest not checked in');
          return Promise.resolve();
        });
    });

    it('post folio item to wrong account will return error', () => {
      const now = new Date();
      const item = {
        id: 1,
        amount: 1.99,
        created: now.toISOString(),
        description: 'Towel',
        display: true,
      };

      return request.post('/api/pms/v2/rooms/201/folios/201-2/folio-items')
        .send(item)
        .expect(400)
        .then(res => {
          expect(res.body.status).to.equal('error');
          expect(res.body.error.message).to.equal('invalid account number for room');
          return Promise.resolve();
        });
    });

    after(() => {
      config.delete('app.room');
    });
  });
});
