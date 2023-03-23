const { expect } = require('chai');
const SuperTest = require('supertest');
const config = require('../util/config');

const app = require('../app');
const request = SuperTest.agent(app);

const roomsMock = {
  '201': {
    name: {
      full: 'Mrs. Pearl Brooks',
    },
    folio: {
      id: '201-1',
      balance: 5.99,
    },
  },
  '202': {
    name: {
      full: 'Mrs. Tom Smith',
    },
    folio: {
      id: '202-1',
      balance: 11.99,
    },
  },
};

describe('api::checkouts', () => {
  describe('test checkouts api with room id', () => {
    beforeEach(() => {
      config.set('app.room', roomsMock);
    });

    it('checkout room "201" will return success', () => {
      return request.post('/api/pms/v2/rooms/201/checkouts')
        .expect(200)
        .then(res => {
          const rooms = config.get('app.room');

          expect(res.body.status).to.equal('success');
          expect(rooms['201']).to.be.a('undefined');
          expect(rooms['202']).to.not.be.a('undefined');
          return Promise.resolve();
        });
    });

    it('checkout room "202" will return success', () => {
      return request.post('/api/pms/v2/rooms/202/checkouts')
        .expect(200)
        .then(res => {
          const rooms = config.get('app.room');

          expect(res.body.status).to.equal('success');
          expect(rooms['201']).to.not.be.a('undefined');
          expect(rooms['202']).to.be.a('undefined');
          return Promise.resolve();
        });
    });

    it('checkout unknown room will return error', () => {
      return request.post('/api/pms/v2/rooms/100/checkouts')
        .expect(400)
        .then(res => {
          const rooms = config.get('app.room');

          expect(res.body.status).to.equal('error');
          expect(res.body.error.message).to.equal('Guest not checked in');
          expect(rooms['100']).to.be.a('undefined');
          expect(rooms['201']).to.not.be.a('undefined');
          return Promise.resolve();
        });
    });

    afterEach(() => {
      config.delete('app.room');
    });
  });

  describe('test checkouts api with guest id and balance', () => {
    beforeEach(() => {
      config.set('app.room', roomsMock);
    });

    it('checkout room "201" will return success', () => {
      const body = {
        balance: 5.99,
      };

      return request.post('/api/pms/v2/rooms/201/checkouts/201-1')
        .send(body)
        .expect(200)
        .then(res => {
          const rooms = config.get('app.room');

          expect(res.body.status).to.equal('success');
          expect(rooms['201']).to.be.a('undefined');
          return Promise.resolve();
        });
    });

    it('checkout room "201" with invalid balance will return error', () => {
      const body = {
        balance: 99.99,
      };

      return request.post('/api/pms/v2/rooms/201/checkouts/201-1')
        .send(body)
        .expect(400)
        .then(res => {
          const rooms = config.get('app.room');

          expect(res.body.status).to.equal('error');
          expect(res.body.error.message).to.equal('Payment Rejected, check balance');
          expect(rooms['201']).to.not.be.a('undefined');
          return Promise.resolve();
        });
    });

    it('checkout room "201" with wrong zero balance will return error', () => {
      const body = {
        balance: 0,
      };

      return request.post('/api/pms/v2/rooms/201/checkouts/201-1')
        .send(body)
        .expect(400)
        .then(res => {
          const rooms = config.get('app.room');

          expect(res.body.status).to.equal('error');
          expect(res.body.error.message).to.equal('Folio Total are Not Zero');
          expect(rooms['201']).to.not.be.a('undefined');
          return Promise.resolve();
        });
    });

    it('checkout room unknown room will return error', () => {
      const body = {
        balance: 10,
      };

      return request.post('/api/pms/v2/rooms/100/checkouts/100-1')
        .send(body)
        .expect(400)
        .then(res => {
          const rooms = config.get('app.room');

          expect(res.body.status).to.equal('error');
          expect(res.body.error.message).to.equal('Guest not checked in');
          expect(rooms['201']).to.not.be.a('undefined');
          return Promise.resolve();
        });
    });

    it('checkout room invalid folio id will return error', () => {
      const body = {
        balance: 5.99,
      };

      return request.post('/api/pms/v2/rooms/201/checkouts/100-1')
        .send(body)
        .expect(400)
        .then(res => {
          const rooms = config.get('app.room');

          expect(res.body.status).to.equal('error');
          expect(res.body.error.message).to.equal('invalid account number for room');
          expect(rooms['201']).to.not.be.a('undefined');
          return Promise.resolve();
        });
    });

    afterEach(() => {
      config.delete('app.room');
    });
  });
});
