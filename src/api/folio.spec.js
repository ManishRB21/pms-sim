const { expect } = require('chai');
const SuperTest = require('supertest');
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

describe('api::folios', () => {
  describe('test folios api', () => {
    before(() => {
      config.set('app.room', roomsMock);
    });

    it('get folio of room "201" will return success', () => {
      return request.get('/api/pms/v2/rooms/201/folios/201-1')
        .expect(200)
        .then(res => {
          expect(res.body.status).to.equal('success');
          expect(res.body.data.id).to.equal('201-1');
          expect(res.body.data.balance).to.equal(10.99);
          expect(res.body.data.status).to.equal('open');
          return Promise.resolve();
        });
    });

    it('get folio of room "202" will return success', () => {
      return request.get('/api/pms/v2/rooms/202/folios/202-1')
        .expect(200)
        .then(res => {
          expect(res.body.status).to.equal('success');
          expect(res.body.data.id).to.equal('202-1');
          expect(res.body.data.balance).to.equal(5.19);
          expect(res.body.data.status).to.equal('open');
          return Promise.resolve();
        });
    });

    it('get folio with wrong guest id will return empty', () => {
      return request.get('/api/pms/v2/rooms/201/folios/201-2')
        .expect(400)
        .then(res => {
          expect(res.body.status).to.equal('error');
          expect(res.body.error.message).to.equal('invalid account number for room');
          return Promise.resolve();
        });
    });

    it('get folio with wrong room id will return empty', () => {
      return request.get('/api/pms/v2/rooms/100/folios/100-1')
        .expect(400)
        .then(res => {
          expect(res.body.status).to.equal('error');
          expect(res.body.error.message).to.equal('Guest not checked in');
          return Promise.resolve();
        });
    });

    it('get folio with wrong room id will return empty', () => {
      return request.get('/api/pms/v2/rooms/100/folios/100-2')
        .expect(400)
        .then(res => {
          expect(res.body.status).to.equal('error');
          expect(res.body.error.message).to.equal('Guest not checked in');
          return Promise.resolve();
        });
    });

    after(() => {
      config.delete('app.room');
    });
  });
});
